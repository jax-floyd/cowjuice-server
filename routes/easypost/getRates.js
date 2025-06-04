const easypost = require('../../configs/easypost');

const setupGetRates = (router) => {
  router.post('/admin/get-rates', async (req, res) => {
    console.log("'/admin/get-rates' [EasyPost] was reached.");

    const { toAddress, parcel } = req.body;

    try {
      const to = await new easypost.Address({
        ...toAddress,
        verify: ['delivery']
      }).save();

      const from = await new easypost.Address({
        name: 'Cow Juice Warehouse',
        street1: '334 W 86 St Apt 2A',
        city: 'New York',
        state: 'NY',
        zip: '10024',
        country: 'US',
        phone: '9178631395',
        email: 'cowjuiceman@gotcowjuice.com',
      }).save();

      const parcelObj = await new easypost.Parcel({
        length: parcel.length,
        width: parcel.width,
        height: parcel.height,
        weight: parcel.weight,
      }).save();

      const shipment = await new easypost.Shipment({
        to_address: to,
        from_address: from,
        parcel: parcelObj,
      }).save();

      res.json({ rates: shipment.rates });
    } catch (err) {
      console.error('EasyPost Get Rates Error:', err);
      res.status(500).json({ error: 'Failed to fetch shipping rates' });
    }
  });
};

module.exports = setupGetRates;
