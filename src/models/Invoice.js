const { Schema, model } = require('mongoose');

const InvoiceSchema = new Schema({
    accessCode: {
        type: String,
        required: true,
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
        },
        address: {
            street: {
                type: String,
            },
            number: {
                type: String,
            },
            addressLine2: {
                type: String,
            },
            neighbourhood: {
                type: String,
            },
            municipality: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
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