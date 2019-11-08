const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

const getProductsByName = async (productName) => {
    const products = await Product.find({ $text: { $search: productName } });
    const productsArr = [];

    products.map((prod) => {
        const product = {
            id: prod._id,
            name: prod.name,
            price: prod.price,
            marketName: prod.marketName,
            purchaseDate: prod.purchaseDate,
        }

        productsArr.push(product);
    });

    console.log(productsArr);
    return productsArr;
}

const getAllProducts = () => {
    return new Promise( (resolve, reject) => {
        Invoice.findOne()
    });
}

module.exports = {
    getProductsByName: async (productName) => await getProductsByName(productName),
    getAllProducts: () => getAllProducts()
}