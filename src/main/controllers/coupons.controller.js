const couponsCtrl = {};
const axios = require('axios');
const Item = require('../models/items');

couponsCtrl.postCoupons = async (req,res) => {
    const items = req.body.item_ids;
    const amount = req.body.amount;

    const unrepeatedItems = new Set(items);

    if(unrepeatedItems.size < items.length){
        res.send({ message: "There are repeated items" });
    }

   try {
        // Realizar todas las solicitudes en paralelo
        const itemPricePromises = items.map(item => axios.get(process.env.ML_CLIENT_URI + item));
        const itemPriceResponses = await Promise.all(itemPricePromises);

        let sum = 0;
        const selectedItems = [];

        for (let i = 0; i < itemPriceResponses.length; i++) {
            const itemPrice = itemPriceResponses[i].data.price;
            const item = items[i];

            if (sum + itemPrice < amount) {
                sum += itemPrice;
                selectedItems.push(item);

                // Guardar el nuevo artículo en la base de datos
                const newItem = new Item({ item });
                await newItem.save(); // Si necesitas guardar cada artículo seleccionado
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