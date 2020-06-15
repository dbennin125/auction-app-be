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
  beforeEach(async() => {
    user = await User.create({
      email: 'yep@no.com',
      password: 'donotshow'
    });
  });
  let auction; 
  beforeEach(async() => {
    auction = await Auction.create({
      user: user.id,
      title: 'Stuff',
      description: 'This is some stuff',
      quantity: 2,
      expires: Date.now()
    });
  });
  let bid;
  beforeEach(async() => {
    bid = await Bid.create({
      auction: auction.id,
      user: user.id,
      price: 12,
      quantity: 2, 
      accepted: false
      
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('makes an auction via POST', () => {
    return request(app)
      .post('/api/v1/auctions')
      .auth('yep@no.com', 'donotshow')
      .send({
        user: user.id,
        title: 'Stuff',
        description: 'This is some stuff',
        quantity: 2,
        expires: Date.now()
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          title:'Stuff',
          description: 'This is some stuff',
          quantity: 2,
          expires: expect.anything()
        });
      });
  });

  it('gets an auction by ID via GET', async() => {
    const auction = await Auction.create({
      user: user.id,
      title: 'Stuff',
      description: 'This is some stuff',
      quantity: 2,
      expires: Date.now()
    });
    return request(app)
      .get(`/api/v1/auctions/${auction._id}`)
      .auth('yep@no.com', 'donotshow')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          bids: [],
          user: { _id: expect.anything(), email: 'yep@no.com' },
          title:'Stuff',
          description: 'This is some stuff',
          quantity: 2,
          expires: expect.anything()
        });
      });
  });
});
