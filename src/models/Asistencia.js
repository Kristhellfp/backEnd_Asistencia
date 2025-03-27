const connection = require('../../config/db');


const obtenerAsistencias = (callback) => {
    const query = 'SELECT * FROM asistencia';
    connection.query(query, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

module.exports = {
    obtenerAsistencias,
};