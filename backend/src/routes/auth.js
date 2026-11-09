
const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

// INICIAR SESIÓN
router.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({
            mensaje: 'Ingresa tu usuario y contraseña.'
        });
    }

    if (usuario !== process.env.ADMIN_USER) {
        return res.status(401).json({
            mensaje: 'Usuario o contraseña incorrectos.'
        });
    }

    const coincide = await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH
    );

    if (!coincide) {
        return res.status(401).json({
            mensaje: 'Usuario o contraseña incorrectos.'
        });
    }

    req.session.administrador = true;

    req.session.save((error) => {
        if (error) {
            return res.status(500).json({
                mensaje: 'No se pudo iniciar la sesión.'
            });
        }

        res.json({
            mensaje: 'Inicio de sesión correcto.',
            autenticado: true
        });
    });
});

// CONSULTAR SESIÓN
router.get('/estado', (req, res) => {
    res.json({
        autenticado: Boolean(req.session.administrador)
    });
});

// CERRAR SESIÓN
router.post('/logout', (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            return next(error);
        }

        res.clearCookie('connect.sid');

        res.json({
            mensaje: 'Sesión cerrada correctamente.'
        });
    });
});

module.exports = router;
