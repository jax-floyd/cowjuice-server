// const shippo = require('../../configs/shippo');

const { Shippo } = require('shippo');

require('../../configs/loadEnv')(); // or dotenv.config()


const shippo = new Shippo({
  apiKey: process.env.NODE_ENV === 'production'
    ? process.env.SHIPPO_API_KEY_LIVE
    : process.env.SHIPPO_API_KEY_TEST,
  shippoApiVersion: '2018-02-08',
});

const setupGetRatesShippo = (router) => {
  router.post('/admin/shippo/get-rates', async (req, res) => {
    console.log("'/admin/shippo/get-rates' endpoint was reached.");

    const { toAddress, parcel } = req.body;

    try {
      const shipment = await shippo.shipments.create({
        addressFrom: {
          name: 'Planet Milk',
          company: 'Cow Juice Inc.',
          street1: '334 W 86 St',
          street3: 'Apt 1',
          city: 'New York',
          state: 'NY',
          zip: '10024',
          country: 'US',
          phone: '9178631395',
          email: 'cowjuiceman@gotcowjuice.com',
          isResidential: false,
        },
        addressTo: {
          name: toAddress.name,
          street1: toAddress.street1,
          street2: toAddress.street2 || '',
          city: toAddress.city,
          state: toAddress.state,
          zip: toAddress.zip,
          country: toAddress.country,
          phone: toAddress.phone || '9178631395',
          email: toAddress.email,
          isResidential: true,
        },
        parcels: [
          {
            length: parcel.length.toString(),
            width: parcel.width.toString(),
            height: parcel.height.toString(),
            distanceUnit: 'in',
            weight: parcel.weight.toString(),
            massUnit: 'oz', // ✅ CORRECTED camelCase
          },
        ],
        async: false,
        metadata: 'Compare rates for Cow Juice',
      });

      console.log('✅ Shippo shipment created:', shipment.object_id);

      res.json({
        rates: shipment.rates,
        shipment_id: shipment.object_id,
      });
    } catch (err) {
      console.error('❌ Shippo Get Rates Error:', err?.response?.data || err.message || err);
      res.status(500).json({ error: 'Failed to fetch shipping rates via Shippo' });
    }
  });
};

module.exports = setupGetRatesShippo;