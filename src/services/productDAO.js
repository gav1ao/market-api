const crypto = require('crypto');

const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

const marketDAO = require('./marketDAO');

const md5 = (string) => {
    return crypto.createHash('md5').update(string).digest('hex');
}

const removeDuplicates = (products) => {

    const uniqueItens = [];
    const productsUnique = [];

    for (let i = 0; i < products.length; i++){
        const prod = products[i];
        
        const item = {
            name : prod.name,
            marketName : prod.marketName
        }

        const prodHash = md5(JSON.stringify(item));

        if (uniqueItens.indexOf(prodHash) == -1) {
            uniqueItens.push(prodHash);
            productsUnique.push(prod);
        }
    }

    return productsUnique;
}

const getProductsByName = async (productName, option) => {

    let products = [];
    
    if (option.address) {
        const { municipality, state } = option.address;
        const marketNamesList = await marketDAO.getMarketNameListByMunicipality(municipality, state);
        const names = marketNamesList.map(n => n._id);

        products = await Product.aggregate([
            { $match: {
                $text: { $search: productName } }
            },
            { $sort:
                {
                    name: 1,
                    marketName: 1,
                    purchaseDate: -1
                }
            },
            {
                $match: { "marketName": {$in: names } }
            }
        ]);
    }

    if (option.all) {
         // TODO: Tratar caso de supermercados homônimos
        products = await Product.aggregate([
            { $match: {
                $text: { $search: productName } }
            },
            { $sort:
                {
                    name: 1,
                    marketName: 1,
                    purchaseDate: -1
                }
            }
        ]);
    }

    const productsFiltered = removeDuplicates(products);

    const productsArr = [];

    productsFiltered.map((prod) => {
        const product = {
            id: prod._id,
            name: prod.name,
            price: prod.price,
            marketName: prod.marketName,
            purchaseDate: prod.purchaseDate,
        }

        productsArr.push(product);
    });

    return productsArr;
}

const getAllProducts = () => {
    return new Promise( (resolve, reject) => {
        Invoice.findOne()
    });
}

module.exports = {
    getProductsByName: async (productName, option) => await getProductsByName(productName, option),
    getAllProducts: () => getAllProducts()
}