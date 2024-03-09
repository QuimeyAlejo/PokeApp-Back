const express = require('express');
const app = express();
const cors = require('cors');
const { conn } = require("../Back/src/db.js");
const {getApiInfoPokemon,getAllPokesOrByQuery} = require("../Back/src/controller/pokemonController.js")
const routes = require("./src/routes/routes.js")


app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use('/', routes);


const PORT = 3000;
conn.sync({ force: true }).then(async () => {
  
  
    app.listen(PORT, () => {
      console.log("Servidor escuchando en el puerto " + PORT);
    });
  });