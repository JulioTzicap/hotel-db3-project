require("dotenv").config();


const express = require("express");

const { conectarMongo } = require("./config/mongo");


const routes = require(
    "./routes"
);

const app = express();

app.use(express.json());

conectarMongo();

app.use("/api", routes);

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Servidor corriendo en puerto ${PORT}`
    );
});