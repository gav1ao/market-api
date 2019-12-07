const Invoice = require('../models/Invoice');

const getMarketCities = async () => {

    let cities = await Invoice.aggregate([{
        $group : {
            '_id': '$market.address.municipality',
            'state': { $last : '$market.address.state' }
        }
    }]);

    cities = cities.filter(city => city._id !== null);

    return cities;
};

const getMarketNameListByMunicipality = async (municipality, state) => {
    const markets = await Invoice.aggregate([
        {
            $match : {
                'market.address.municipality' : municipality,
                'market.address.state' : state,
            }

        },
        {
            $group : {
                '_id': '$market.name',
            }
        },
    ]);

    return markets;
}

module.exports = {
    getMarketCities: async () => await getMarketCities(),
    getMarketNameListByMunicipality: async (municipality, state) => getMarketNameListByMunicipality(municipality, state),
}