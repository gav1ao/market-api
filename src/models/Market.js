const { Schema, model } = require('mongoose');

const MarketSchema = new Schema({
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
});

module.exports = model('Market', MarketSchema);