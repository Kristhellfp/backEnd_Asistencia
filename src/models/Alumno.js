const connection = require('../../config/db');

// Obtener todos los alumnos
const obtenerAlumnos = (callback) => {
    const query = 'SELECT * FROM alumno';
    connection.query(query, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

module.exports = {
    obtenerAlumnos,
};