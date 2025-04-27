const setupHomeRoute = ( router ) => {
    router.get('/', (req, res, next) => {
        res.status(200).json({
            "message": "The President & Head Juicer of Cow Juice Inc. welcomes you to Cow Juice's Express JS server."
        });
    });
};

module.exports = setupHomeRoute;