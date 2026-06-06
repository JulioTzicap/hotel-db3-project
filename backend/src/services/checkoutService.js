const pool = require("../config/postgres");

async function realizarCheckout(datos) {

    const {
        id_reserva,
        monto_pago,
        metodo_pago
    } = datos;

    await pool.query(

        `
        CALL realizar_checkout(
            $1,
            $2,
            $3
        )
        `,
        [
            id_reserva,
            monto_pago,
            metodo_pago
        ]
    );

    return {
        mensaje:
            "Check-out realizado correctamente"
    };
}

module.exports = {
    realizarCheckout
};