const express = require('express');
const router = express.Router();
const connection = require('../../server'); 

// Ruta de login
router.post('/login', (req, res) => {
    const { usuario, contraseña } = req.body;

    
    if (!usuario || !contraseña) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    const query = 'SELECT * FROM maestro WHERE email = ? AND contraseña = ?';
    connection.query(query, [usuario, contraseña], (err, results) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

       
        if (results.length > 0) {
            return res.status(200).json({
                id_maestro: results[0].id,
                nombre: results[0].nombre,
            });
        } else {
            // Si no se encuentra el usuario
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }
    });
});

module.exports = router;
