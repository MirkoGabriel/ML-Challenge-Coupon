const express = require('express');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(compression());

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 100000,
    message: "Too many requests, please try again later."
  });

app.use(limiter);
  

app.set('port', process.env.PORT || 8080)

app.use(cors())
app.use(express.json());

app.post('/coupon', limiter, require('./routes/coupon.js'))
app.get('/coupon', limiter, require('./routes/coupon.js'))
app.get('/', (req, res) => {res.send('Coupon API')});

module.exports = app;