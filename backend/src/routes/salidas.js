
const express = require('express');
const router = express.Router();

const controlador = require('../controllers/salidas.controller');
const verificarAdministrador = require('../middleware/auth');

// CONSULTAS PÚBLICAS
router.get('/', controlador.listarSalidas);
router.get('/:id', controlador.obtenerSalida);

// OPERACIONES EXCLUSIVAS DEL ADMINISTRADOR
router.post('/', verificarAdministrador, controlador.crearSalida);
router.put('/:id', verificarAdministrador, controlador.actualizarSalida);
router.delete('/:id', verificarAdministrador, controlador.eliminarSalida);

module.exports = router;
