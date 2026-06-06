const mongoose = require("mongoose");

async function conectarMongo() {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB conectado"
        );

    } catch (error) {

        console.error(
            "Error MongoDB:",
            error.message
        );

        process.exit(1);
    }
}

module.exports = conectarMongo;