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