const express = require("express");
const axios = require("axios");
const {op} = require("sequelize")
const { Pokemon, Type } = require('../db.js')



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
            model: Type,
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

const createPokemon = async (req, res) => {
    const {name, image, hp, attack, defense, speed, height, weigth, type} = req.body;
    
    if (!name || !image) {
        return res.status(404).json({error : 'Name and image are requerid fields.'});
    }


        //Verificar que el nombre este disponible.
        let pokemonSearch = await getApiInfoPokemon(name);

        // busqueda en la base de datos
        if (pokemonSearch.error){ // no encontrado en la API externa
            pokemonSearch = await getAllPokemons(name); }

        if (pokemonSearch){
            return res.status(400).json({ error: "Pokemon name already existing." });}
        
        
    try {
        const newPokemon = await Pokemon.create(req.body);

        if (newPokemon && type && Array.isArray(types))
        {
            const promisesTypes = type.map(async (t) => {
                let type = await Type.findAll({
                    where: { name: t.name}
                    });
                
                return newPokemon.setTypes(type); //la asociacion la realiza como objeto
                });  

            await Promise.all(promisesTypes); 
        } // end-if 

        let resultPokemon = await Pokemon.findAll({
            where:{ 
                name: name
             },
            //include: [Types]
            include: [{
                    model: Type,
                    attributes: ['id', 'name']
            }]
            });

        //  --------- aca agrego la relacion con Types
        return res.status(201).json(resultPokemon[0]); // pokemon creado
    }
    catch (error) {
        next(error);
    }
    
}

module.exports={getApiInfoPokemon,getAllPokesOrByQuery,getAllPokemons,getDbInfo,getPokeById,createPokemon}