const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    invoiceId: {
        type: Schema.Types.ObjectId,
        ref: 'Invoice',
    },
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    marketName: {
        type: String,
        required: true,
    },
    purchaseDate: {
        type: Date,
        required: true,
    }
},
{
    timestamps: true,
});

module.exports = model('Product', ProductSchema);