const express = require('express');
const app = express();
const cors = require('cors');
const { conn } = require("../Back/src/db.js");
const {getApiInfoPokemon} = require("../Back/src/controller/pokemonController.js")


app.use(cors());
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!, bienvenido al backend de PokeApp Remake');
});
app.get("/pokemons",getApiInfoPokemon)


const PORT = 3000;
conn.sync({ force: true }).then(async () => {
  
  
    app.listen(PORT, () => {
      console.log("Servidor escuchando en el puerto " + PORT);
    });
  });