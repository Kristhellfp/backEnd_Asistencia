const express = require('express');
const router = express.Router();
const connection = require('../../config/db'); 

router.post('/login', (req, res) => {
    const { usuario, contraseña } = req.body;

    // Comprobar si el usuario y la contraseña son correctos
    const query = 'SELECT * FROM maestro WHERE email = ? AND contraseña = ?';
    connection.query(query, [usuario, contraseña], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al conectar con la base de datos' });
        }

        if (results.length > 0) {
            // Si se encuentra al usuario, retornar la respuesta con los datos del usuario
            const user = results[0];
            res.status(200).json({
                id_maestro: user.id,
                nombre: user.nombre,
            });
        } else {
            // Si no se encuentra el usuario, retornar error
            res.status(400).json({ error: 'Credenciales incorrectas' });
        }
    });
});

module.exports = router;
