// src/app.js
const express = require('express');
const cors = require('cors');
const alumnoRoutes = require('./routes/alumnoRoutes');
const gradoRoutes = require('./routes/gradoRoutes');
const maestroRoutes = require('./routes/maestroRoutes');
const asistenciaRoutes = require('./routes/asistenciaRoutes');
const authRoutes = require('./routes/authRoutes'); 

const app = express();


const corsOptions = {
  origin: 'http://localhost:5500', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions)); // Aplica CORS

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Rutas
app.use('/api', alumnoRoutes);
app.use('/api', gradoRoutes);
app.use('/api', maestroRoutes);
app.use('/api', asistenciaRoutes);
app.use('/api', authRoutes); 

module.exports = app;
