const shippo = require('../../configs/shippo');

const setupBuyLabelShippo = (router) => {
  router.post('/admin/shippo/buy-label', async (req, res) => {
    console.log("'/admin/shippo/buy-label' endpoint was reached.");

    const { shipmentId, rateId } = req.body;

    if (!shipmentId || !rateId) {
      return res.status(400).json({ error: 'Missing shipmentId or rateId' });
    }

    try {
      const transactionRes = await shippo.post('/transactions', {
        rate: rateId,
        label_file_type: 'PDF',
        async: false,
      });

      const transaction = transactionRes.data;

      if (transaction.status !== 'SUCCESS') {
        return res.status(500).json({
          error: 'Shippo failed to generate label',
          messages: transaction.messages || [],
        });
      }

      console.log('✅ Shippo label purchased:', transaction.object_id);

      res.json({
        label_url: transaction.label_url,
        tracking_number: transaction.tracking_number,
        tracking_url: transaction.tracking_url_provider,
        transaction_id: transaction.object_id,
      });
    } catch (err) {
      console.error('❌ Shippo Buy Label Error:', err.response?.data || err.message);

      res.status(500).json({
        error: 'Failed to buy label via Shippo',
        details: err.response?.data || err.message,
      });
    }
  });
};

module.exports = setupBuyLabelShippo;