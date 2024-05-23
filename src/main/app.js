const express = require('express');
const cors = require('cors');
const compression = require('compression');

const app = express();

app.use(compression());
  

app.set('port', process.env.PORT || 8080)

app.use(cors())
app.use(express.json());

app.post('/coupon', limiter, require('./routes/coupon.js'))
app.get('/coupon', limiter, require('./routes/coupon.js'))
app.get('/', (req, res) => {res.send('Coupon API')});

module.exports = app;