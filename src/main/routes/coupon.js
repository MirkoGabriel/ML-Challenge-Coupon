const {Router} = require('express');
const router = Router();

const {postItems, getItems} = require('../controllers/coupons.controller')

router.route('/coupon').post(postItems);

router.route('/coupon').get(getItems);


module.exports = router;