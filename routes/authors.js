const express = require('express');
const Author = require('../models/author');

const router = express.Router();

/**
 * GET authors listing.
 */
router.get('/', async (req, res) => {
  try {
    let filters = {};
    if (req.query.pais) filters = { pais: req.query.pais };
    const authors = await Author.find(filters);
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Create a new Author
 */
router.post('/', async (req, res) => {
  try {
    let author = new Author(req.body);
    author = await author.save({ new: true });
    res.status(201).json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    let author= new Author();
    await author.findByIdAndRemove(req.params.id);
    res.json({status: 'Author Deleted'});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Consulta 1: Nombres y apellidos de autores colombianos que tengan 20 o menos publicaciones 
router.get('/consulta1', async (req, res) => {
  try {
    let filters = {};
    filters = { $and: [{publicados: {$lte:20} }, {pais:"Colombia"} ] }, {nombre:1, apellido: 1, publicados: 0, pais:0};
    const authors = await Author.find(filters);
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Consulta2: Nombre de autores con apellido
router.get('/consulta2', async (req, res) => {
  try {
    let filters = {};
    filters = {apellido: {$exists:true} }, {nombre:1, apellido: 0, publicados: 0, pais:0};
    const authors = await Author.find(filters);
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Consulta3: Apellidos de autores argentinos con mas de 20 publicacones
router.get('/consulta3', async (req, res) => {
  try {
    let filters = {};
    filters = { $or: [{publicados: {$gt:20} }, {pais:"Argentina"} ] }, {nombre:0, apellido: 1, publicados: 0, pais:0};
    const authors = await Author.find(filters);
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
