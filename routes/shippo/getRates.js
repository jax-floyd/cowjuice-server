const shippo = require('../../configs/shippo');

const setupGetRatesShippo = (router) => {
  router.post('/admin/shippo/get-rates', async (req, res) => {
    console.log("'/admin/shippo/get-rates' endpoint was reached.");

    const { toAddress, parcel } = req.body;

    try {
      const shipment = await shippo.shipments.create({
        address_from: {
          name: 'Planet Milk',
          street1: '334 W 86 St',
          city: 'New York',
          state: 'NY',
          zip: '10024',
          country: 'US',
          phone: '9178631395',
          email: 'cowjuiceman@gotcowjuice.com',
        },
        address_to: {
          name: toAddress.name,
          street1: toAddress.street1,
          city: toAddress.city,
          state: toAddress.state,
          zip: toAddress.zip,
          country: toAddress.country,
          phone: toAddress.phone || '9178631395',
          email: toAddress.email,
        },
        parcels: [
          {
            length: parcel.length.toString(),
            width: parcel.width.toString(),
            height: parcel.height.toString(),
            distance_unit: 'in',
            weight: parcel.weight.toString(),
            mass_unit: 'lb',
          },
        ],
        async: false,
      });

      console.log('Shippo Shipment Created:', shipment);

      res.json({
        rates: shipment.rates,
        shipment_id: shipment.object_id,
      });
    } catch (err) {
      console.error('Shippo Get Rates Error:', err.response?.data || err.message || err);
      res.status(500).json({ error: 'Failed to fetch shipping rates via Shippo' });
    }
  });
};

module.exports = setupGetRatesShippo;