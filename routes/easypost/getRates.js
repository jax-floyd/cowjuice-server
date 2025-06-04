const easypost = require('../../configs/easypost');

const setupGetRates = (router) => {
  router.post('/admin/get-rates', async (req, res) => {
    console.log("'/admin/get-rates' [EasyPost] was reached.");

    const { toAddress, parcel } = req.body;

    try {
      const shipment = new easypost.Shipment({
        to_address: {
          ...toAddress,
          phone: toAddress.phone || '9178631395',
        },
        from_address: {
          name: 'Cow Juice Warehouse',
          street1: '334 W 86 St Apt 2A',
          city: 'New York',
          state: 'NY',
          zip: '10024',
          country: 'US',
          email: 'cowjuiceman@gotcowjuice.com',
          phone: '9178631395',
        },
        parcel: {
          length: parcel.length,
          width: parcel.width,
          height: parcel.height,
          weight: parcel.weight,
        },
      });

      await shipment.save(); // <-- Note: `save()` is valid in the instance-based approach

      res.json({ rates: shipment.rates });
    } catch (err) {
      console.error('EasyPost Get Rates Error:', err);
      res.status(500).json({ error: 'Failed to fetch shipping rates' });
    }
  });
};

module.exports = setupGetRates;