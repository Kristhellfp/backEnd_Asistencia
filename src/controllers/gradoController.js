const connection = require('../../config/db'); 

const obtenerGrados = (req, res) => {
    connection.query('SELECT * FROM grados', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
};

module.exports = { obtenerGrados };
