const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

let db;

async function conectarMongo() {
    try {
        await client.connect();
        db = client.db("hotel");

        console.log("MongoDB conectado");
    } catch (error) {
        console.error("Error MongoDB:", error.message);
        process.exit(1);
    }
}

function getMongoDB() {
    if (!db) {
        throw new Error("MongoDB no está conectado");
    }

    return db;
}

module.exports = {
    conectarMongo,
    getMongoDB
};