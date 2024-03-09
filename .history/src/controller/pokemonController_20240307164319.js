const express = require("express");
const axios = require("axios");
const {op} = require("sequelize")


const getApiInfoPokemon = async () => {
    try {
        const apiU = await axios.get('https://pokeapi.co/api/v2/pokemon');
        const apiU2 = await axios.get(apiU.data.next);
        const allPokes = apiU.data.results.concat(apiU2.data.results);
        
        const finalInfo = await Promise.all(
            allPokes.map(async e => {
                try {
                    const poke = await axios.get(e.url);
                    return {
                        id: poke.data.id,
                        img: poke.data.sprites.other.home.front_default,
                        name: poke.data.name,
                        hp: poke.data.stats[0].base_stat,
                        attack: poke.data.stats[1].base_stat,
                        defense: poke.data.stats[2].base_stat,
                        speed: poke.data.stats[5].base_stat,
                        height: poke.data.height,
                        weight: poke.data.weight,
                        type: poke.data.types 
                    };
                } catch (error) {
                    console.error(`Error fetching data for Pokemon: ${e.name}`, error);
                    // Puedes manejar el error según tus necesidades, por ejemplo, puedes retornar un objeto con información de error.
                    return {
                        error: `Error fetching data for Pokemon: ${e.name}`
                    };
                }
            })
        );

        return finalInfo;
    } catch (error) {
        console.error('Error fetching Pokemon data:', error);
        // Puedes manejar el error según tus necesidades, por ejemplo, puedes retornar un objeto con información de error.
        return {
            error: 'Error fetching Pokemon data'
        };
    }
};
const getDbInfo = async () =>{
    return await Pokemon.findAll({
        include:{
            model: Types,
            attributes: ['name'],
            through:{
                attributes: [],
            },
        }
    })
}


const getAllPokemons = async () => {
    const apiInfo = await getApiInfoPokemon();
    const dbInfo = await getDbInfo();
    const infoTotal = apiInfo.concat(dbInfo);
    return infoTotal;
}


const getAllPokesOrByQuery = async (req, res)=>{
    const name = req.query.name;
    const allPokes = await getAllPokemons();
    if(name){
        const pokeName = await allPokes.filter(e => e.name.toLowerCase().includes(name.toLowerCase()))
        pokeName.length ? res.status(200).send(pokeName) : res.status(404).send('Pokemon not found');
    }else{
        res.status(200).send(allPokes)
    }
}


const getPokeById = async (req, res)=>{
    const {id} = req.params;
    const pokesId = await getAllPokemons();
    let pokesFilter = pokesId.filter(e => e.id == id)
    if(pokesFilter.length > 0){
        return res.status(200).send(pokesFilter)
    }else{
        res.status(404).send('Id not found')
    }
}

module.exports={getApiInfoPokemon,getAllPokesOrByQuery,getPokeById,getAllPokemons,getDbInfo}