const marketDAO = require('../services/marketDAO');

module.exports = {

    async getMarketCities(req, res) {

        try {

            const response = await marketDAO.getMarketCities();

            return res.status(200).send(response);

        } catch (ex) {
            console.error(ex);

            return res.status(500).send({
                "error": "There was a problem trying to get the market municipalities."
            });
        }
    },

    async getMarketNameListByMunicipality(req, res) {

        try {

            const { municipality, state } = req.body;

            const response = await marketDAO.getMarketNameListByMunicipality(municipality, state);

            return res.status(200).send(response);

        } catch (ex) {
            console.error(ex);

            return res.status(500).send({
                "error": "There was a problem trying to get the market's name by municipality."
            });
        }
    },

}