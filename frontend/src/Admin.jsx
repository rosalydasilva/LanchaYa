import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

axios.defaults.withCredentials = true;
const API = 'http://localhost:3001';

const formularioInicial = {
    empresa: '',
    embarcacion: '',
    tipo: 'rapido',
    destino: '',
    puerto: '',
    fechaHora: '',
    duracionHoras: '',
    precio: '',
    cupos: ''
};

function Admin() {
    const [salidas, setSalidas] = useState([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [editando, setEditando] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(true);
    const navegar = useNavigate();

    const cargarSalidas = async () => {
        try {
            const respuesta = await axios.get(`${API}/api/salidas`);
            setSalidas(respuesta.data);
        } catch (error) {
            setMensaje('No se pudieron cargar las salidas.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        const verificarSesion = async () => {
            try {
                const respuesta = await axios.get(`${API}/api/auth/estado`);

                if (!respuesta.data.autenticado) {
                    navegar('/login');
                    return;
                }

                await cargarSalidas();
            } catch (error) {
                navegar('/login');
            }
        };

        verificarSesion();
    }, []);

    const cambiarCampo = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const guardarSalida = async (e) => {
        e.preventDefault();
        setMensaje('');

        if (
            !formulario.empresa.trim() ||
            !formulario.embarcacion.trim() ||
            !formulario.destino.trim() ||
            !formulario.puerto.trim() ||
            !formulario.fechaHora
        ) {
            setMensaje('Completa todos los campos obligatorios.');
            return;
        }

        if (
            Number(formulario.precio) <= 0 ||
            Number(formulario.duracionHoras) <= 0 ||
            !Number.isInteger(Number(formulario.cupos)) ||
            Number(formulario.cupos) <= 0
        ) {
            setMensaje('Precio, duración y cupos deben ser mayores que cero. Los cupos deben ser enteros.');
            return;
        }

        if (!editando && new Date(formulario.fechaHora) <= new Date()) {
            setMensaje('La fecha de salida debe ser futura.');
            return;
        }

        const datos = {
            ...formulario,
            duracionHoras: Number(formulario.duracionHoras),
            precio: Number(formulario.precio),
            cupos: Number(formulario.cupos)
        };

        try {
            if (editando) {
                await axios.put(`${API}/api/salidas/${editando}`, datos);
                setMensaje('Salida actualizada correctamente.');
            } else {
                await axios.post(`${API}/api/salidas`, datos);
                setMensaje('Salida registrada correctamente.');
            }

            setFormulario(formularioInicial);
            setEditando(null);
            await cargarSalidas();
        } catch (error) {
            setMensaje(error.response?.data?.mensaje || 'Ocurrió un error al guardar la salida.');
        }
    };

    const editarSalida = (salida) => {
        setFormulario({
            ...salida,
            duracionHoras: String(salida.duracionHoras),
            precio: String(salida.precio),
            cupos: String(salida.cupos)
        });
        setEditando(salida.id);
        setMensaje('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const eliminarSalida = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta salida?')) return;

        try {
            await axios.delete(`${API}/api/salidas/${id}`);
            setMensaje('Salida eliminada correctamente.');
            await cargarSalidas();

            if (editando === id) {
                cancelarEdicion();
            }
        } catch (error) {
            setMensaje(error.response?.data?.mensaje || 'No se pudo eliminar la salida.');
        }
    };

    const cancelarEdicion = () => {
        setFormulario(formularioInicial);
        setEditando(null);
    };

    const cerrarSesion = async () => {
        try {
            await axios.post(`${API}/api/auth/logout`);
            navegar('/login');
        } catch (error) {
            setMensaje('No se pudo cerrar la sesión.');
        }
    };

    return (
        <div className="admin">
            <header className="admin-header">
                <a href="/" className="admin-logo">🚤 LanchaYa</a>
                <nav>
                    <a href="/">Inicio</a>
                    <a href="/#salidas">Consultar viajes</a>
                    <a href="/admin">Administrar salidas</a>
                    <button onClick={cerrarSesion} className="admin-cancelar">
                        Cerrar sesión
                    </button>
                </nav>
            </header>

            <main className="admin-contenido">
                <div className="admin-titulo">
                    <span>GESTIÓN DEL SISTEMA</span>
                    <h1>Administrar salidas</h1>
                    <p>Registra, modifica y organiza los viajes fluviales.</p>
                </div>

                <section className="admin-formulario">
                    <h2>{editando ? 'Editar salida' : 'Registrar nueva salida'}</h2>

                    <form onSubmit={guardarSalida}>
                        <div className="admin-grid">
                            <label>
                                Empresa
                                <input name="empresa" value={formulario.empresa} onChange={cambiarCampo} placeholder="Nombre de la empresa" required />
                            </label>

                            <label>
                                Embarcación
                                <input name="embarcacion" value={formulario.embarcacion} onChange={cambiarCampo} placeholder="Nombre de la embarcación" required />
                            </label>

                            <label>
                                Tipo
                                <select name="tipo" value={formulario.tipo} onChange={cambiarCampo}>
                                    <option value="lancha">Lancha</option>
                                    <option value="rapido">Rápido</option>
                                    <option value="deslizador">Deslizador</option>
                                </select>
                            </label>

                            <label>
                                Destino
                                <input name="destino" value={formulario.destino} onChange={cambiarCampo} placeholder="Ej. Nauta" required />
                            </label>

                            <label>
                                Puerto
                                <input name="puerto" value={formulario.puerto} onChange={cambiarCampo} placeholder="Nombre del puerto" required />
                            </label>

                            <label>
                                Fecha y hora
                                <input type="datetime-local" name="fechaHora" value={formulario.fechaHora} onChange={cambiarCampo} required />
                            </label>

                            <label>
                                Duración (horas)
                                <input type="number" min="0.1" step="any" name="duracionHoras" value={formulario.duracionHoras} onChange={cambiarCampo} required />
                            </label>

                            <label>
                                Precio (S/)
                                <input type="number" min="0.01" step="0.01" name="precio" value={formulario.precio} onChange={cambiarCampo} required />
                            </label>

                            <label>
                                Cupos disponibles
                                <input type="number" min="1" step="1" name="cupos" value={formulario.cupos} onChange={cambiarCampo} required />
                            </label>
                        </div>

                        <div className="admin-acciones">
                            <button type="submit" className="admin-guardar">
                                {editando ? 'Guardar cambios' : 'Registrar salida'}
                            </button>

                            {editando && (
                                <button type="button" className="admin-cancelar" onClick={cancelarEdicion}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>

                    {mensaje && <p className="admin-mensaje">{mensaje}</p>}
                </section>

                <section className="admin-listado">
                    <div className="admin-listado-titulo">
                        <h2>Salidas registradas</h2>
                        <span>{salidas.length} viajes</span>
                    </div>

                    {cargando ? (
                        <p>Cargando salidas...</p>
                    ) : salidas.length === 0 ? (
                        <p>No hay salidas registradas.</p>
                    ) : (
                        <div className="admin-tabla-contenedor">
                            <table className="admin-tabla">
                                <thead>
                                    <tr>
                                        <th>Destino</th>
                                        <th>Empresa</th>
                                        <th>Fecha</th>
                                        <th>Precio</th>
                                        <th>Cupos</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salidas.map((salida) => (
                                        <tr key={salida.id}>
                                            <td>{salida.destino}</td>
                                            <td>{salida.empresa}</td>
                                            <td>{salida.fechaHora.replace('T', ' ')}</td>
                                            <td>S/ {Number(salida.precio).toFixed(2)}</td>
                                            <td>{salida.cupos}</td>
                                            <td>
                                                <button className="admin-editar" onClick={() => editarSalida(salida)}>
                                                    Editar
                                                </button>
                                                <button className="admin-eliminar" onClick={() => eliminarSalida(salida.id)}>
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Admin;
