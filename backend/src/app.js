const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const pool = require("./config/postgres");
const connectMongo = require("./config/mongo");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      ok: true,
      postgres: result.rows[0],
      message: "API funcionando correctamente"
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

connectMongo();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});