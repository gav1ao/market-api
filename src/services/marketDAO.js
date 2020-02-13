const Invoice = require('../models/Invoice');

const getMarketCities = async () => {

    let cities = await Invoice.aggregate([
        { 
            $group : {
                '_id': '$market.address.municipality',
                'state': { $last : '$market.address.state' }
            },
        },
        {
            $sort: {
                _id: 1,
                state: 1,
            },
        },
    ]);

    cities = cities
                .filter(city => city._id !== null)
                .map(city => {
                    return {
                        '_id': city._id.toUpperCase(),
                        'state' : city.state.toUpperCase(),
                    }
                })
                .reduce( (arr, curr) => {
                    const previousCity = arr[arr.length - 1];

                    if (arr.length === 0
                        || previousCity._id !==  curr._id
                        || (previousCity._id ===  curr._id && previousCity.state !== curr.state)
                    ) {
                        arr.push(curr);
                    }

                    return arr;
                }, []);

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