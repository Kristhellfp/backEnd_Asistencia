
const connection = require('../../config/db');


const obtenerGrados = (callback) => {
    const query = 'SELECT * FROM grado';
    connection.query(query, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

module.exports = {
    obtenerGrados,
};