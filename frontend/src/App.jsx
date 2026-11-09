
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:3001';

function App() {
  const [salidas, setSalidas] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [tipo, setTipo] = useState('');

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDestinos();
  }, []);

  useEffect(() => {
    cargarSalidas();
  }, [destino, fecha, tipo]);

  const cargarDestinos = async () => {
    try {
      const respuesta = await axios.get(`${API}/api/destinos`);
      setDestinos(respuesta.data);
    } catch (error) {
      console.error('Error al cargar destinos:', error);
    }
  };

  const cargarSalidas = async () => {
    try {
      setCargando(true);
      setError('');

      const respuesta = await axios.get(`${API}/api/salidas`, {
        params: { destino, fecha, tipo }
      });

      setSalidas(respuesta.data);
    } catch (error) {
      setError('No se pudieron cargar las salidas. Comprueba que el backend esté funcionando.');
    } finally {
      setCargando(false);
    }
  };

  const limpiarFiltros = () => {
    setDestino('');
    setFecha('');
    setTipo('');
  };

  const formatoFecha = (fechaHora) => {
    return new Date(fechaHora).toLocaleString('es-PE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <span className="logo-icon">🚤</span>
          <span>Lancha<span className="logo-color">Ya</span></span>
        </div>

        <nav>
          <a href="#inicio">Inicio</a>
          <a href="#salidas">Salidas</a>
          <a href="#nosotros">Nosotros</a>
          <a href="/login">Iniciar sesión</a>
        </nav>

        <a href="#salidas" className="btn-nav">Consultar viajes</a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-content">
            <span className="etiqueta">TRANSPORTE FLUVIAL · IQUITOS</span>

            <h1>
              Tu próximo viaje por el río,
              <span> comienza aquí.</span>
            </h1>

            <p>
              Consulta horarios, destinos, precios y disponibilidad
              de las embarcaciones desde Iquitos.
            </p>

            <a href="#salidas" className="btn-principal">
              Buscar salidas <span>→</span>
            </a>
          </div>

          <div className="hero-image">
            <div className="hero-card">
              <span>🌊</span>
              <div>
                <strong>Explora la Amazonía</strong>
                <small>Conecta con nuevos destinos</small>
              </div>
            </div>
          </div>
        </section>

        <section className="contenido" id="salidas">
          <div className="titulo-seccion">
            <span className="etiqueta">PLANIFICA TU VIAJE</span>
            <h2>Salidas disponibles</h2>
            <p>Encuentra la embarcación ideal para tu destino.</p>
          </div>

          <div className="filtros">
            <div className="campo">
              <label>Destino</label>
              <select
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
              >
                <option value="">Todos los destinos</option>
                {destinos.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label>Fecha de viaje</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>

            <div className="campo">
              <label>Tipo de embarcación</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                <option value="lancha">Lancha</option>
                <option value="rapido">Rápido</option>
                <option value="deslizador">Deslizador</option>
              </select>
            </div>

            <button className="btn-limpiar" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          </div>

          <div className="resultados">
            <h3>Viajes encontrados</h3>
            <span>{salidas.length} salidas</span>
          </div>

          {cargando && (
            <div className="mensaje">
              Cargando salidas...
            </div>
          )}

          {!cargando && error && (
            <div className="mensaje error">{error}</div>
          )}

          {!cargando && !error && salidas.length === 0 && (
            <div className="mensaje">
              No se encontraron salidas con esos filtros.
            </div>
          )}

          {!cargando && !error && (
            <div className="grid-salidas">
              {salidas.map((salida) => (
                <article className="tarjeta" key={salida.id}>
                  <div className="tarjeta-top">
                    <span className="tipo">
                      {salida.tipo === 'rapido'
                        ? 'Rápido'
                        : salida.tipo.charAt(0).toUpperCase() + salida.tipo.slice(1)}
                    </span>
                    <span className="cupos">
                      {salida.cupos} cupos
                    </span>
                  </div>

                  <h3>{salida.destino}</h3>
                  <p className="empresa">{salida.empresa}</p>

                  <div className="detalle">
                    <p>🚤 <span>{salida.embarcacion}</span></p>
                    <p>📍 <span>{salida.puerto}</span></p>
                    <p>📅 <span>{formatoFecha(salida.fechaHora)}</span></p>
                    <p>⏱️ <span>{salida.duracionHoras} horas de viaje</span></p>
                  </div>

                  <div className="tarjeta-footer">
                    <div>
                      <small>Precio por persona</small>
                      <strong>S/ {Number(salida.precio).toFixed(2)}</strong>
                    </div>
                    <button
                      className="btn-detalle"
                      onClick={() => window.alert(
                        `Destino: ${salida.destino}\nEmpresa: ${salida.empresa}\nPrecio: S/ ${salida.precio}`
                      )}
                    >
                      Ver detalles
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="nosotros" id="nosotros">
          <h2>Conectando destinos de nuestra Amazonía</h2>
          <p>
            LanchaYa facilita la consulta de salidas fluviales
            desde Iquitos para que puedas organizar mejor tu viaje.
          </p>
        </section>
      </main>

      <footer>
        <div className="logo">
          🚤 Lancha<span className="logo-color">Ya</span>
        </div>
        <p>© 2026 LanchaYa Iquitos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
