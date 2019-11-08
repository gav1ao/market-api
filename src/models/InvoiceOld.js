const { Schema, model } = require('mongoose');

const InvoiceSchema = new Schema({
    accessCode: {
        type: String,
        // required: true,
    },
    
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
    }],
    
    market: {
        type: Schema.Types.ObjectId,
        ref: 'Market',
    },

    purchaseDate: {
        type: Date,
        required: true,
        default: Date.now,
    }
},
{
    timestamps: true,
});

module.exports = model('Invoice', InvoiceSchema);