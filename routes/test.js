const setupTestRoute = ( router ) => {
    router.get('/test', (req, res) => {
        console.log("The 'test' endpoint was reached.")
        res.status(200).json({
          success: true,
          message: 'Server is reachable!',
          timestamp: new Date().toISOString(),
        });
    });
};

module.exports = setupTestRoute;