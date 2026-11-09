
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');

const salidasRoutes = require('./routes/salidas');
const authRoutes = require('./routes/auth');
const controlador = require('./controllers/salidas.controller');

const app = express();
const PORT = 3001;

// Verificar que las variables estén configuradas
if (!process.env.ADMIN_USER ||
    !process.env.ADMIN_PASSWORD_HASH ||
    !process.env.SESSION_SECRET) {
    throw new Error('Faltan variables de configuración en el archivo .env');
}

// MIDDLEWARES
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 2
    }
}));

// RUTA PRINCIPAL
app.get('/', (req, res) => {
    res.json({
        proyecto: 'LanchaYa Iquitos',
        mensaje: 'API funcionando correctamente',
        puerto: PORT
    });
});

// AUTENTICACIÓN
app.use('/api/auth', authRoutes);

// SALIDAS
app.use('/api/salidas', salidasRoutes);

// DESTINOS
app.get('/api/destinos', controlador.listarDestinos);

// RUTAS INCORRECTAS
app.use((req, res) => {
    res.status(404).json({
        mensaje: 'La ruta solicitada no existe'
    });
});

// MANEJO DE ERRORES
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        mensaje: 'Error interno del servidor'
    });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log('====================================');
    console.log('       LANCHAYA IQUITOS');
    console.log('====================================');
    console.log(`Servidor iniciado: http://localhost:${PORT}`);
    console.log('API REST disponible');
});
