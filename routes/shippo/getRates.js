const shippo = require('../../configs/shippo');

console.log('Shippo API Key:', shippo.apiKey); // Debugging line to check if the API key is loaded correctly

const setupGetRates = (router) => {
  router.post('/admin/get-rates', async (req, res) => {
    console.log("'/admin/get-rates' endpoint was reached.");

    const {
      toAddress,
      parcel,
    } = req.body;

    try {
      // Define your FROM address (this is you, the sender)
      const fromAddress = {
        name: 'Cow Juice Warehouse',
        company: 'Cow Juice Inc.',
        street1: '334 W 86 St,',
        city: 'New York',
        state: 'NY',
        zip: '10024',
        country: 'US',
        phone: '+1 917-863-1395',
        email: 'cowjuiceman@gotcowjuice.com',
      };

      // Create TO address
      const to = await shippo.address.create({
        ...toAddress,
        validate: true,
      });

      // Create parcel
      const parcelObj = await shippo.parcel.create({
        length: parcel.length, // in inches
        width: parcel.width,
        height: parcel.height,
        distance_unit: 'in',
        weight: parcel.weight, // in ounces
        mass_unit: 'oz',
      });

      // Create shipment to get rates
      const shipment = await shippo.shipment.create({
        address_from: fromAddress,
        address_to: to,
        parcels: [parcelObj],
        async: false,
      });

      res.json({ rates: shipment.rates });
    } catch (err) {
      console.error('Shippo Get Rates Error:', err);
      res.status(500).json({ error: 'Failed to fetch shipping rates' });
    }
  });
};

module.exports = setupGetRates;
