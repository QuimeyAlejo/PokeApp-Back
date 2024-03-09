const express = require('express');
const app = express();
const cors = require('cors');
const { conn } = require("../Back/src/db.js");
const { getApiInfoPokemon, getAllPokesOrByQuery } = require("../Back/src/controller/pokemonController.js");
const routes = require("./src/routes/routes.js");

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
// app.use(cors(corsOptions));  // Usar corsOptions aquí
app.use('/', routes);

const corsOptions = {
  origin: "http://localhost:5173",
};

const PORT = 3000;
conn.sync({ force: true }).then(async () => {
  app.listen(PORT, () => {
    console.log("Servidor escuchando en el puerto " + PORT);
  });
});