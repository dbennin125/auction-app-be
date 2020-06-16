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
  });

