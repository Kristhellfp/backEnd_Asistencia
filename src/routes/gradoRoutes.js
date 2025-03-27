const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.get('/api/grados', async (req, res) => {
    try {
        const grados = await db.query('SELECT * FROM grados'); 
        res.json(grados.rows);
    } catch (error) {
        console.error('Error al obtener grados:', error);
        res.status(500).json({ error: 'Error al obtener los grados' });
    }
});

module.exports = router;
