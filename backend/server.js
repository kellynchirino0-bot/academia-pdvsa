const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const evaluationsRoutes = require('./routes/evaluations');
const certificatesRoutes = require('./routes/certificates');
const simulatorsRoutes = require('./routes/simulators');
const leadsRoutes = require('./routes/leads');
const coursesRoutes = require('./routes/courses');
const tutorsRoutes = require('./routes/tutors');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/evaluations', evaluationsRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/simulators', simulatorsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/tutors', tutorsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Academia Virtual Nasser Group API - PDVSA',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log('============================================');
    console.log(' Academia Virtual Nasser Group - PDVSA');
    console.log(' Backend API v2.0.0');
    console.log(` Servidor corriendo en puerto ${PORT}`);
    console.log('============================================');
    console.log(' Rutas disponibles:');
    console.log('   POST   /api/auth/login');
    console.log('   POST   /api/auth/register');
    console.log('   GET    /api/users');
    console.log('   GET    /api/leads');
    console.log('   GET    /api/courses/modulos');
    console.log('   GET    /api/tutors/estudiantes');
    console.log('   GET    /api/evaluations');
    console.log('   POST   /api/certificates/generate');
    console.log('   POST   /api/simulators/text-prompt');
    console.log('============================================');
});
