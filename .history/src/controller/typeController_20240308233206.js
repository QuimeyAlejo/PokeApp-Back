const express = require("express");
const axios = require("axios");
const {op} = require("sequelize")
const { Type } = require('../db.js')


const getTypes = async (req, res) => {
    try {
      const apiU = await axios.get('https://pokeapi.co/api/v2/type');
      const finalInfo = apiU.data.results.map((e) => e.name);
  
      // Utilizamos Promise.all para esperar a que todas las operaciones de Types.findOrCreate se completen
      await Promise.all(
        finalInfo.map(async (e) => {
          await Type.findOrCreate({
            where: {
              name: e,
            },
          });
        })
      );
  
      res.status(200).send(finalInfo, 'Info obtenida');
    } catch (error) {
      console.error('Error en la función getApiInfoTypes:', error);
      res.status(500).send('Error interno del servidor');
    }
  };
  