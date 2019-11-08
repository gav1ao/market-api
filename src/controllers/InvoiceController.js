const puppeteer = require('puppeteer');

const invoiceInfo = require('../services/invoiceInfoRequest');

let globalBrowser, userPage;

module.exports = {
    async index(req, res) {

        const { user } = req.headers;
        
        const loggedDev = await Dev.findById(user);

        const users = await Dev.find({
            $and: [
                { _id: { $ne: user} },
                { _id: { $nin: loggedDev.likes } },
                { _id: { $nin: loggedDev.dislikes } },

            ]
        })

        return res.json(users);
    },

    async requestAccess(req, res) {
        if (globalBrowser === undefined) {
            globalBrowser = await puppeteer.launch({headless: false});
            // globalBrowser = await puppeteer.launch();
        }

        const { accessCode } = req.body;

        userPage = await globalBrowser.newPage();

        const response = await invoiceInfo.requestAccess(accessCode, userPage);

        return res.send(response);
    },

    async getResultPage(req, res) {
        if (globalBrowser === undefined) {
            // TODO: Tratar erro de browser e páginas fechadas
            console.error("Browser closed");
        }

        //TODO: Tratar caso em que recebe captcha errada

        const { accesscode, captchacode } = req.headers;


        const response = await invoiceInfo.getResultPage(accesscode, captchacode, userPage);

        return res.send(response);
    },

    async getResultWithQRCode(req, res) {
        if (globalBrowser === undefined) {
            globalBrowser = await puppeteer.launch({headless: false});
        }

        const { url } = req.headers;

        console.log('URL: ' + url);
        
        userPage = await globalBrowser.newPage();

        const response = await invoiceInfo.getResultPageWithQRCode(url, userPage);

        return res.send(response);
    },

    async teste(req, res) {
        /*if (globalBrowser === undefined) {
            globalBrowser = await puppeteer.launch({headless: false});
            // globalBrowser = await puppeteer.launch();
        }

        let page = await globalBrowser.newPage();*/
        let page = null;
        const response = await invoiceInfo.teste(page);
        

        return res.json(response);
    }
};