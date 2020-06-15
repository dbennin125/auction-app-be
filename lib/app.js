const express = require('express');
const app = express();

app.use(express.json());

app.unsubscribe((req, res, next) => {
  console.log(req.headers.authorization);
});

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/auctions', require('./routes/auctions'));
app.use('/api/v1/bids', require('./routes/bids'));


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
