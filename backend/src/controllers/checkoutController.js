const checkoutService = require(
    "../services/checkoutService"
);

async function checkout(req, res) {

    try {

        const resultado =
            await checkoutService.realizarCheckout(
                req.body
            );

        res.json(resultado);

    } catch (error) {

        res.status(500).json({

            error: error.message
        });
    }
}

module.exports = {
    checkout
};