const connection = require('../../config/db'); 

const obtenerAlumnos = (req, res) => {

  connection.query('SELECT * FROM alumnos', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message }); 
      res.json(results); 
    }
  });
};

module.exports = { obtenerAlumnos };
