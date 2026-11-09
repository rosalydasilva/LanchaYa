
const fs = require('fs');
const path = require('path');

const archivo = path.join(__dirname, '../data/salidas.json');

// Leer datos del archivo JSON
function leerSalidas() {
    return JSON.parse(fs.readFileSync(archivo, 'utf8'));
}

// Guardar datos en el archivo JSON
function guardarSalidas(salidas) {
    fs.writeFileSync(
        archivo,
        JSON.stringify(salidas, null, 2),
        'utf8'
    );
}

// Validar información de una salida
function validarSalida(datos, esNueva = false) {
    const campos = [
        'empresa',
        'embarcacion',
        'destino',
        'puerto',
        'fechaHora'
    ];

    for (const campo of campos) {
        if (
            typeof datos[campo] !== 'string' ||
            !datos[campo].trim()
        ) {
            return `El campo ${campo} es obligatorio`;
        }
    }

    if (!['lancha', 'rapido', 'deslizador'].includes(datos.tipo)) {
        return 'Tipo de embarcación no válido';
    }

    const fecha = new Date(datos.fechaHora);

    if (Number.isNaN(fecha.getTime())) {
        return 'La fecha y hora no son válidas';
    }

    if (esNueva && fecha.getTime() <= Date.now()) {
        return 'La fecha y hora deben ser futuras';
    }

    if (!Number.isFinite(Number(datos.precio)) ||
        Number(datos.precio) <= 0) {
        return 'El precio debe ser mayor que cero';
    }

    if (!Number.isFinite(Number(datos.duracionHoras)) ||
        Number(datos.duracionHoras) <= 0) {
        return 'La duración debe ser mayor que cero';
    }

    if (!Number.isInteger(Number(datos.cupos)) ||
        Number(datos.cupos) <= 0) {
        return 'Los cupos deben ser un entero mayor que cero';
    }

    return null;
}

// 1. LISTAR TODAS LAS SALIDAS Y APLICAR FILTROS
exports.listarSalidas = (req, res) => {
    let salidas = leerSalidas();

    const { destino, fecha, tipo } = req.query;

    if (destino) {
        salidas = salidas.filter(s =>
            s.destino.toLowerCase() === destino.toLowerCase()
        );
    }

    if (fecha) {
        salidas = salidas.filter(s =>
            s.fechaHora.startsWith(fecha)
        );
    }

    if (tipo) {
        salidas = salidas.filter(s => s.tipo === tipo);
    }

    salidas.sort((a, b) =>
        new Date(a.fechaHora) - new Date(b.fechaHora)
    );

    res.json(salidas);
};

// 2. BUSCAR UNA SALIDA POR ID
exports.obtenerSalida = (req, res) => {
    const salidas = leerSalidas();

    const salida = salidas.find(
        s => s.id === Number(req.params.id)
    );

    if (!salida) {
        return res.status(404).json({
            mensaje: 'Salida no encontrada'
        });
    }

    res.json(salida);
};

// 3. REGISTRAR UNA NUEVA SALIDA
exports.crearSalida = (req, res) => {
    const error = validarSalida(req.body, true);

    if (error) {
        return res.status(400).json({ mensaje: error });
    }

    const salidas = leerSalidas();

    const nuevaSalida = {
        id: salidas.length
            ? Math.max(...salidas.map(s => s.id)) + 1
            : 1,
        empresa: req.body.empresa.trim(),
        embarcacion: req.body.embarcacion.trim(),
        tipo: req.body.tipo,
        destino: req.body.destino.trim(),
        puerto: req.body.puerto.trim(),
        fechaHora: req.body.fechaHora,
        duracionHoras: Number(req.body.duracionHoras),
        precio: Number(req.body.precio),
        cupos: Number(req.body.cupos)
    };

    salidas.push(nuevaSalida);
    guardarSalidas(salidas);

    res.status(201).json(nuevaSalida);
};

// 4. EDITAR UNA SALIDA
exports.actualizarSalida = (req, res) => {
    const salidas = leerSalidas();

    const indice = salidas.findIndex(
        s => s.id === Number(req.params.id)
    );

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Salida no encontrada'
        });
    }

    const error = validarSalida(req.body);

    if (error) {
        return res.status(400).json({ mensaje: error });
    }

    const datos = req.body;

    salidas[indice] = {
        ...salidas[indice],
        empresa: datos.empresa.trim(),
        embarcacion: datos.embarcacion.trim(),
        tipo: datos.tipo,
        destino: datos.destino.trim(),
        puerto: datos.puerto.trim(),
        fechaHora: datos.fechaHora,
        duracionHoras: Number(datos.duracionHoras),
        precio: Number(datos.precio),
        cupos: Number(datos.cupos)
    };

    guardarSalidas(salidas);

    res.json(salidas[indice]);
};

// 5. ELIMINAR UNA SALIDA
exports.eliminarSalida = (req, res) => {
    let salidas = leerSalidas();

    const existe = salidas.some(
        s => s.id === Number(req.params.id)
    );

    if (!existe) {
        return res.status(404).json({
            mensaje: 'Salida no encontrada'
        });
    }

    salidas = salidas.filter(
        s => s.id !== Number(req.params.id)
    );

    guardarSalidas(salidas);

    res.status(204).send();
};

// 6. LISTAR DESTINOS SIN REPETIR
exports.listarDestinos = (req, res) => {
    const salidas = leerSalidas();

    const destinos = [
        ...new Set(salidas.map(s => s.destino))
    ];

    res.json(destinos.sort());
};
