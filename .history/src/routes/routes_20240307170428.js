const { Router } = require('express');
const { getAllPokesOrByQuery, createPokemon, getPokeById } = require ('../controller/pokemonController.js');
const { getApiInfoTypes } = require('../controllers/typesController');




const router = Router();
     

router.get('/pokemons', getAllPokesOrByQuery)

router.get('/types', getApiInfoTypes)

router.post('/pokemons', createPokemon)

router.get('/pokemons/:id', getPokeById)
    
module.exports = router;
