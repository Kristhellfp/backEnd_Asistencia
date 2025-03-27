const express = require('express');
const router = express.Router();
const connection = require('../../server'); 

router.post('/login', (req, res) => {
    const { usuario, contraseña } = req.body;

  
    if (!usuario || !contraseña) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    // Consulta SQL
    const query = 'SELECT * FROM maestro WHERE email = ? AND contraseña = ?';
    connection.query(query, [usuario, contraseña], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error de conexión a la base de datos' });
        }

        if (results.length > 0) {
            // Si las credenciales son correctas
            const user = results[0];
            res.status(200).json({
                id_maestro: user.id,
                nombre: user.nombre
            });
        } else {
            // Credenciales incorrectas
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    });
});

module.exports = router;
