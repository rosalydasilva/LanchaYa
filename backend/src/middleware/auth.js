
function verificarAdministrador(req, res, next) {
    if (!req.session || !req.session.administrador) {
        return res.status(401).json({
            mensaje: 'Debes iniciar sesión como administrador.'
        });
    }

    next();
}

module.exports = verificarAdministrador;
