const express = require('express');
const { obtenerMaestros } = require('../controllers/maestroController');
const router = express.Router();


router.get('/maestros', obtenerMaestros);

module.exports = router;
