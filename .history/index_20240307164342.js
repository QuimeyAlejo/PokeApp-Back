const express = require('express');
const app = express();
const cors = require('cors');
const { conn } = require("../Back/src/db.js");
const {getApiInfoPokemon,getAllPokesOrByQuery} = require("../Back/src/controller/pokemonController.js")


app.use(cors());
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!, bienvenido al backend de PokeApp Remake');
});
app.get("/pokemons",getAllPokesOrByQuery)


const PORT = 3000;
conn.sync({ force: true }).then(async () => {
  
  
    app.listen(PORT, () => {
      console.log("Servidor escuchando en el puerto " + PORT);
    });
  });