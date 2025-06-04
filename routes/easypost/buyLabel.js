const easypost = require('../../configs/easypost');

const setupBuyLabel = (router) => {
  router.post('/admin/buy-label', async (req, res) => {
    console.log("'/admin/buy-label' endpoint was reached.");

    const { shipmentId, rateId } = req.body;

    if (!shipmentId || !rateId) {
      return res.status(400).json({ error: 'Missing shipmentId or rateId' });
    }

    try {

      const shipment = await easypost.Shipment.retrieve(shipmentId);
      const rate = shipment.rates.find((r) => r.id === rateId);

      if (!rate) {
        return res.status(404).json({ error: 'Rate not found on shipment' });
      }

      const boughtShipment = await easypost.Shipment.buy(shipment.id, rate);
      console.log('Bought Shipment:', boughtShipment);

      res.json({
        label_url: boughtShipment.postage_label.label_url,
        tracking_number: boughtShipment.tracking_code,
      });
    } catch (err) {
      console.error('EasyPost Buy Label Error:', err);

      // Catch known EasyPost error when a label already exists
      if (err.code === 'SHIPMENT.POSTAGE.EXISTS') {
        return res.status(409).json({
          error: 'A label has already been purchased for this shipment.',
        });
      }

      // Fallback generic error
      res.status(500).json({
        error: 'Failed to buy label. Please try again or contact support.',
      });
    }
  });
};

module.exports = setupBuyLabel;