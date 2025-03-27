
const connection = require('../../config/db');


const obtenerMaestros = (callback) => {
    const query = 'SELECT * FROM maestro';
    connection.query(query, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

module.exports = {
    obtenerMaestros,
};