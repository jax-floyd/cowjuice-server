const setupHomeRoute = ( router ) => {
    router.get('/', (req, res, next) => {
        res.status(200).json({
            "message": "The Chief Juicing Officer welcomes you to Cow Juice's backend server."
        });
    });
};

module.exports = setupHomeRoute;