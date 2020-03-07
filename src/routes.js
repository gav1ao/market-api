
const express = require('express');

const routes = express.Router();

const InvoiceController = require('./controllers/InvoiceController');
const ProductController = require('./controllers/ProductController');
const MarketController = require('./controllers/MarketController');

routes.get('/invoice/code/', InvoiceController.requestAccess);
routes.post('/invoice/code/', InvoiceController.getResultPage);
routes.post('/invoice/qrcode/', InvoiceController.getResultWithQRCode);
routes.get('/teste', InvoiceController.teste);

routes.get('/admin/browser/open', InvoiceController.openBrowser);
routes.get('/admin/browser/close', InvoiceController.closeBrowser);
routes.get('/admin/browser/status', InvoiceController.getBrowserStatus);

routes.get('/product/', ProductController.index);
routes.post('/product/', ProductController.getProductsByName);

routes.get('/market/cities', MarketController.getMarketCities);
routes.post('/market/names', MarketController.getMarketNameListByMunicipality);

/*routes.post('/devs', DevController.store);
routes.post('/devs/:devId/likes', LikeController.store);
routes.post('/devs/:devId/dislikes', DislikeController.store);*/

module.exports = routes;