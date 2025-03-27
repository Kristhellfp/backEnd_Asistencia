const connection = require('../../config/db');

const obtenerMaestros = (req, res) => {
    connection.query('SELECT * FROM maestro', (error, results) => {
        if (error) {
            console.error('Error al obtener maestros:', error);
            return res.status(500).json({ error: 'Error al obtener maestros' });
        }
        res.json(results);
    });
};

module.exports = { obtenerMaestros };
