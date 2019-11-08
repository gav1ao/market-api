const { Schema, model } = require('mongoose');

const InvoiceSchema = new Schema({
    accessCode: {
        type: String,
        // required: true,
    },
    
    products: [
        {
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
        }
    ],
    
    market: {
        name: {
            type: String,
            required: true,
        },
        cnpj: {
            type: String,
            // required: true,
        },
        adress: {
            type: String,
            // required: true,
        },
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