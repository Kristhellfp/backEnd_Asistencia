
const connection = require('../../config/db'); 

// Controlador para el login
exports.login = (req, res) => {
    const { usuario, contraseña } = req.body;

    // Verificar si los campos están completos
    if (!usuario || !contraseña) {
        return res.status(400).json({ error: 'Por favor, ingrese usuario y contraseña' });
    }

    const query = `
        SELECT id, nombre
        FROM maestro
        WHERE email = ? AND contraseña = ?;
    `;

    connection.query(query, [usuario, contraseña], (error, results) => {
        if (error) {
            console.error('Error al verificar credenciales:', error);
            return res.status(500).json({ error: 'Error interno al verificar usuario' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        res.json({
            id_maestro: results[0].id,
            nombre: results[0].nombre,
        });
    });
};
