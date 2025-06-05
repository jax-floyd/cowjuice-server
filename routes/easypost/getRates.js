const easypost = require('../../configs/easypost');

const setupGetRates = (router) => {
  router.post('/admin/easypost/get-rates', async (req, res) => {
    console.log("'/admin/easypost/get-rates' endpoint was reached.");

    const { toAddress, parcel } = req.body;

    try {
      const shipment = await easypost.Shipment.create({
        to_address: {
          name: toAddress.name,
          street1: toAddress.street1,
          city: toAddress.city,
          state: toAddress.state,
          zip: toAddress.zip,
          country: toAddress.country,
          phone: toAddress.phone || '9178631395',
          email: toAddress.email,
        },
        from_address: {
          name: 'Planet Milk',
          street1: '334 W 86 St',
          city: 'New York',
          state: 'NY',
          zip: '10024',
          country: 'US',
          phone: '9178631395',
          email: 'cowjuiceman@gotcowjuice.com',
        },
        parcel: {
          length: parcel.length,
          width: parcel.width,
          height: parcel.height,
          weight: parcel.weight,
        },
      });

      res.json({ rates: shipment.rates, shipment_id: shipment.id });
    } catch (err) {
      console.error('EasyPost Get Rates Error:', err);
      res.status(500).json({ error: 'Failed to fetch shipping rates' });
    }
  });
};

module.exports = setupGetRates;
