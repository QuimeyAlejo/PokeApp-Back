const express = require('express');
const app = express();
const cors = require('cors');
const { conn } = require("../Back/src/db.js");


app.use(cors());
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});


const PORT = 3000;
conn.sync({ force: true }).then(async () => {
  
  
    app.listen(PORT, () => {
      console.log("Servidor escuchando en el puerto " + PORT);
    });
  });