const shippo = require('../../configs/shippo');

const setupGetRatesShippo = (router) => {
  router.post('/admin/shippo/get-rates', async (req, res) => {
    console.log("'/admin/shippo/get-rates' endpoint was reached.");

    const { toAddress, parcel } = req.body;

    const shipmentPayload = {
      address_from: {
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
        is_residential: false,
      },
      address_to: {
        name: toAddress.name,
        street1: toAddress.street1,
        street2: toAddress.street2 || '',
        city: toAddress.city,
        state: toAddress.state,
        zip: toAddress.zip,
        country: toAddress.country,
        phone: toAddress.phone || '9178631395',
        email: toAddress.email,
        is_residential: true,
      },
      parcels: [
        {
          length: parcel.length.toString(),
          width: parcel.width.toString(),
          height: parcel.height.toString(),
          distance_unit: 'in',
          weight: parcel.weight.toString(),
          mass_unit: 'oz',
        },
      ],
      async: false,
      metadata: 'Cow Juice shipping rate check',
    };

    try {
      const response = await shippo.post('/shipments', shipmentPayload);
      console.log('✅ Shippo shipment created:', response.data.object_id);

      res.json({
        rates: response.data.rates,
        shipment_id: response.data.object_id,
      });
    } catch (err) {
      console.error(
        '❌ Shippo Get Rates Error:',
        err.response?.data || err.message
      );
      res.status(500).json({
        error: 'Failed to fetch shipping rates via Shippo',
      });
    }
  });
};

module.exports = setupGetRatesShippo;
