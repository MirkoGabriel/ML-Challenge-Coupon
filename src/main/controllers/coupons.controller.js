const couponsCtrl = {};
const axios = require('axios');
const Item = require('../models/items');

couponsCtrl.postCoupons = async (req,res) => {
    const items = req.body.item_ids;
    const amount = req.body.amount;

   try {
        let sum = 0;
        const selectedItems = [];
        
        for (const item of items) {
            const itemPriceResponse = await axios.get(process.env.ML_CLIENT_URI + item);
            const itemPrice = itemPriceResponse.data.price;
            
            const newItem = new Item({
                item: item
            })
            await newItem.save();

            if (sum + itemPrice < amount) {
                sum += itemPrice;
                selectedItems.push(item);
            } 
        }

        res.send({ item_ids: selectedItems, amount: sum });
        
        } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error fetching item prices' });
    }
};

couponsCtrl.getCoupons = async (req,res) => {
  const items = await Item.aggregate([
        {
            $group: {
                _id: "$item", 
                count: { $sum: 1 } 
            }
        },
        {
            $sort: { count: -1 } 
        },
        {
            $limit: 5 
        }
    ]);
    const nestedResult = items.reduceRight((acc, item) => {
        return { [item._id]: item.count, ... acc };
    }, {});
    res.json(nestedResult);
};

module.exports = couponsCtrl;