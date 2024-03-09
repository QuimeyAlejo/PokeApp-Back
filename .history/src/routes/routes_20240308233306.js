const { Router } = require('express');
const { getAllPokesOrByQuery, createPokemon, getPokeById } = require ('../controller/pokemonController.js');
const { getTypes } = require('../controller/typeController.js'); 




const router = Router();
     

router.get('/pokemons', getAllPokesOrByQuery)

router.get('/types', getTypes)

router.post('/pokemons', createPokemon)

router.get('/pokemons/:id', getPokeById)
    
module.exports = router;
