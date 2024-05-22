const {Schema, model} = require('mongoose');

const itemSchema = new Schema({
    item: String
},{
    timestamps: true
});

module.exports = model('Item', itemSchema);