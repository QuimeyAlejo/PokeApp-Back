const express = require("express");
const axios = require("axios");
const {op} = require("sequelize")
const { Type } = require('../db.js')


const getTypes = async (req, res) => {
    try {
      const apiU = await axios.get('https://pokeapi.co/api/v2/type');
      const finalInfo = apiU.data.results.map((e) => e.name);
  
      await Promise.all(
        finalInfo.map(async (e) => {
          await Type.findOrCreate({
            where: {
              name: e,
            },
          });
        })
      );
  
      // Utilizamos res.json() para enviar una respuesta JSON con el array finalInfo y un código de estado 200
      res.status(200).json(finalInfo);
    } catch (error) {
      console.error('Error en la función getApiInfoTypes:', error);
      res.status(500).send('Error interno del servidor');
    }
  };
  
  
  module.exports={
    getTypes}