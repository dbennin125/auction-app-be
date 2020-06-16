const { Router } = require('express');
const Bid = require('../models/Bid');
const { ensureAuth } = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Bid
      .create({
        ...req.body,
        user: req.user._id
      })
      .then(user => res.send(user))
      .catch(next);
  })
  .get('/:id', ensureAuth, (req, res, next) => {
    Bid
      .findById(req.params.id)
      .populate('auction', { 
        title: true,
        description: true
      })
      .populate('user')
      .then(user => res.send(user))
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Bid
      .findByIdAndDelete(req.params.id)
      .then(user => res.send(user))
      .catch(next);
  });
  

