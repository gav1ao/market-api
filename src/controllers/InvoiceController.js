const puppeteer = require('puppeteer');

const invoiceInfo = require('../services/invoiceInfoRequest');

let globalBrowser, userPage;

const openGlobalBrowser = async () => {
    if (!globalBrowser) {
        globalBrowser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

        console.log('Global browser is now opened.')
    }
}

module.exports = {
    async openGlobalBrowser() {
        openGlobalBrowser();   
    },

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
        openGlobalBrowser();

        try {
            const { accessCode } = req.body;

            userPage = await globalBrowser.newPage();

            const response = await invoiceInfo.requestAccess(accessCode, userPage);

            return res.status(200).send(response);

        } catch (ex) {
            return res.status(500).send({
                "error": "There was a problem trying to request the invoice."
            });
        }
    },

    async getResultPage(req, res) {
        openGlobalBrowser();

        try {
            //TODO: Tratar caso em que recebe captcha errada
            const { accessCode, captchaCode } = req.body;

            const response = await invoiceInfo.getResultPage(accessCode, captchaCode, userPage);

            if (response.error) {
                return res.status(response.statusCode).send({ "error" : response.error});
            }

            return res.status(200).send(response);

        } catch (ex) {
            // TODO: Utilizar ferramenta para coleta de erros
            console.error(ex);

            return res.status(500).send({
                "error": "There was a problem trying to register the requested invoice."
            });
        }
    },

    async getResultWithQRCode(req, res) {
        openGlobalBrowser();

        try {
            const { url } = req.headers;

            console.log('URL: ' + url);
            
            userPage = await globalBrowser.newPage();

            const response = await invoiceInfo.getResultPageWithQRCode(url, userPage);

            if (response.error) {
                return res.status(response.statusCode).send({ "error" : response.error});
            }

            return res.status(200).send(response);

        } catch (ex) {
            // TODO: Utilizar ferramenta para coleta de erros
            console.error(ex);

            return res.status(500).send({
                "error": "There was a problem trying to register the requested invoice."
            });
        }
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
    },

    async openBrowser(req, res) {
        if (globalBrowser) {
            return res.status(400).send({"error": "Browser is already opened."});
        }

        try {
            await openGlobalBrowser();

            return res.status(200).send({"info": "Browser opened with success."});

        } catch(ex) {
            // TODO: Utilizar ferramenta para coleta de erros
            console.error(ex);

            return res.status(500).send({
                "error": "There was a problem when tried to open the browser."
            });
        }

    },

    async closeBrowser(req, res) {
        if (!globalBrowser) {
            return res.status(400).send({"error": "Browser is already closed or unavailable."});
        }

        try {
            globalBrowser.close();
            globalBrowser = undefined;

            return res.status(200).send({"info": "Browser closed with success."});

        } catch (ex) {
            // TODO: Utilizar ferramenta para coleta de erros
            console.error(ex);

            return res.status(500).send({
                "error": "There was a problem when tried to close the browser."
            });
        }
    },

    async getBrowserStatus(req, res) {

        if (!globalBrowser) {
            return res.status(400).send({ "error": "Browser not available."});
        }

        try {
            const browserStatus = await globalBrowser.pages();

            return res.send({
                "pagesOpened" : browserStatus.length,
            });

        } catch (ex) {
            // TODO: Utilizar ferramenta para coleta de erros
            console.error(ex);

            return res.status(500).send({
                "error": "There was a problem when tried to get the status."
            });
        }
    }
};