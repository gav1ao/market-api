const invoiceDAO = require('../services/productDAO');

module.exports = {
    async index(req, res) {
        return res.json(invoiceDAO.getAllProducts());
    },

    async getProductsByName(req, res) {

        const { productName, option } = req.body;

        const products = await invoiceDAO.getProductsByName(productName, option);

        return res.json(products);
    }
}