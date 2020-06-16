const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');

const User = require('../lib/models/User');
const Auction = require('../lib/models/Auction');
const Bid = require('../lib/models/Bid');



describe('auction routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;
  let auction; 

  beforeEach(async() => {
    user = await User.create({
      email: 'yep@no.com',
      password: 'donotshow'
    });
  });
  beforeEach(async() => {
    auction = await Auction.create({
      user: user.id,
      title: 'Stuff',
      description: 'This is some stuff',
      quantity: 2,
      expires: Date.now()
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('makes a bid via POST', () => {
    return request(app)
      .post('/api/v1/bids')
      .auth('yep@no.com', 'donotshow')
      .send({
        auction: auction._id,
        price: 20,
        quantity: 1,
        accepted: false
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          auction: auction.id,
          price: 20,
          quantity: 1,
          user: user.id,
          accepted: false
        });
      });
  });

  it('gets a bid by ID via GET', async() => {
    const bid = await Bid.create({
      user: user._id,
      auction: auction._id,
      price: 10,
      quantity: 1,
      accepted: false
    });
    
    return request(app)
      .get(`/api/v1/bids/${bid._id}`)
      .auth('yep@no.com', 'donotshow')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          auction: {
            _id: auction.id,
            description: auction.description,
            title: auction.title
          },
          user: {
            _id: user.id,
            email: user.email
          },
          price: 10,
          quantity: 1,
          accepted: false
        });
      });
  });

  it('deletes a bid by ID via DELETE', async() => {
    const bid = await Bid.create({
      user: user._id,
      auction: auction._id,
      price: 10,
      quantity: 1,
      accepted: false
    });
    
    return request(app)
      .delete(`/api/v1/bids/${bid._id}`)
      .auth('yep@no.com', 'donotshow')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          auction: auction.id,
          price: 10,
          quantity: 1,
          accepted: false,
        });
      });
  });
});
