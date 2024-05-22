const {Router} = require('express');
const router = Router();

const {postCoupons, getCoupons} = require('../controllers/coupons.controller')

router.route('/coupon').post(postCoupons);

router.route('/coupon').get(getCoupons);


module.exports = router;