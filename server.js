const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = 5000;

// Configuración de middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2007',
    database: 'examenfinal_',
    connectTimeout: 10000
});


const handleDisconnect = () => {
    connection.connect(err => {
        if (err) {
            console.error('Error de conexión:', err.message);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('✅ Conectado a MySQL');
        }
    });

    connection.on('error', err => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
};

handleDisconnect();

// Ruta de login
app.post('/api/login', (req, res) => {
    const { usuario, contraseña } = req.body;
    
    if (!usuario || !contraseña) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'Usuario y contraseña son requeridos'
        });
    }

    const query = 'SELECT id, nombre FROM maestro WHERE email = ? AND contraseña = ?';
    connection.query(query, [usuario, contraseña], (err, results) => {
        if (err) {
            console.error('Error en login:', {
                code: err.code,
                message: err.message,
                sql: err.sql
            });
            return res.status(500).json({ 
                error: 'Error en el servidor',
                detalle: err.message
            });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ 
                error: 'Acceso denegado',
                message: 'Credenciales incorrectas'
            });
        }
        
        res.json({
            id_maestro: results[0].id,
            nombre: results[0].nombre
        });
    });
});

// Ruta para obtener grados por maestro
app.get('/api/grados/:idMaestro', (req, res) => {
    const { idMaestro } = req.params;
    
    if (!idMaestro || isNaN(idMaestro)) {
        return res.status(400).json({ 
            error: 'ID inválido',
            message: 'El ID del maestro debe ser un número'
        });
    }

    const query = 'SELECT id, nombre FROM grado WHERE id_maestro = ?';
    connection.query(query, [idMaestro], (err, results) => {
        if (err) {
            console.error('Error al obtener grados:', err);
            return res.status(500).json({ 
                error: 'Error de base de datos',
                detalle: err.sqlMessage
            });
        }
        
        res.json(results);
    });
});

// Ruta para obtener un grado específico
app.get('/api/grado/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT id, nombre FROM grado WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener grado:', err);
            return res.status(500).json({ 
                error: 'Error de base de datos',
                detalle: err.sqlMessage
            });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ 
                error: 'No encontrado',
                message: 'El grado especificado no existe'
            });
        }
        
        res.json(results[0]);
    });
});

// Ruta para obtener alumnos por grado (usando tabla alumno)
app.get('/api/estudiantes/:gradoId', (req, res) => {
    const { gradoId } = req.params;

    
    const checkGrado = 'SELECT id, nombre FROM grado WHERE id = ?';
    connection.query(checkGrado, [gradoId], (err, gradoResults) => {
        if (err) {
            console.error('Error al verificar grado:', err);
            return res.status(500).json({ 
                error: 'Error de base de datos',
                detalle: err.sqlMessage
            });
        }
        
        if (gradoResults.length === 0) {
            return res.status(404).json({ 
                error: 'Grado no encontrado',
                message: `No existe un grado con ID ${gradoId}`
            });
        }
        
        // Obtener alumnos del grado
        const getAlumnos = `
            SELECT id, nombre, apellido 
            FROM alumno 
            WHERE grado_id = ?
            ORDER BY apellido, nombre
        `;
        
        connection.query(getAlumnos, [gradoId], (err, alumnos) => {
            if (err) {
                console.error('Error al obtener alumnos:', err);
                return res.status(500).json({ 
                    error: 'Error de base de datos',
                    detalle: err.sqlMessage
                });
            }
            
            res.json({
                grado: gradoResults[0],
                alumnos: alumnos
            });
        });
    });
});


// Ruta para guardar/actualizar asistencia
app.post('/api/asistencia', (req, res) => {
    const { alumno_id, fecha, presente, observaciones } = req.body;
    
    const query = `
        INSERT INTO asistencia (alumno_id, fecha, presente, observaciones) 
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE presente = VALUES(presente), observaciones = VALUES(observaciones)
    `;
    
    connection.query(query, [alumno_id, fecha, presente, observaciones], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Ruta para obtener asistencia por alumno y fecha
app.get('/api/asistencia/:alumno_id', (req, res) => {
    const { alumno_id } = req.params;
    const { fecha } = req.query;
    
    const query = 'SELECT * FROM asistencia WHERE alumno_id = ? AND fecha = ? LIMIT 1';
    connection.query(query, [alumno_id, fecha], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0] || null);
    });
});

// Ruta de verificación del servidor
app.get('/', (req, res) => {
    res.json({
        status: 'Servidor operativo',
        timestamp: new Date().toISOString(),
        endpoints: {
            login: 'POST /api/login',
            grados: 'GET /api/grados/:idMaestro',
            grado: 'GET /api/grado/:id',
            estudiantes: 'GET /api/estudiantes/:gradoId',
            asistencia: {
                guardar: 'POST /api/asistencia',
                obtener: 'GET /api/asistencia/:alumno_id?fecha=YYYY-MM-DD'
            }
        }
    });
});

// 👇 Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error global no manejado:', err);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'Ocurrió un error inesperado'
    });
});

// 👇 Iniciar servidor
app.listen(port, () => {
    console.log(`🔥 Servidor ejecutándose en http://localhost:${port}`);
    console.log('Endpoints disponibles:');
    console.log(`- POST   http://localhost:${port}/api/login`);
    console.log(`- GET    http://localhost:${port}/api/grados/:idMaestro`);
    console.log(`- GET    http://localhost:${port}/api/grado/:id`);
    console.log(`- GET    http://localhost:${port}/api/estudiantes/:gradoId`);
    console.log(`- POST   http://localhost:${port}/api/asistencia`);
    console.log(`- GET    http://localhost:${port}/api/asistencia/:alumno_id`);
});