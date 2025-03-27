const connection = require('../../config/db'); 

const obtenerAsistencia = (req, res) => {
    connection.query('SELECT * FROM asistencia', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
};

module.exports = { obtenerAsistencia };
