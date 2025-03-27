const express = require('express');
const router = express.Router();
const { obtenerAlumnos } = require('../controllers/alumnoController');

router.get('/', obtenerAlumnos);

module.exports = router;
