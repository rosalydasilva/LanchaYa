
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API = 'http://localhost:3001';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const navegar = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await axios.post(
        `${API}/api/auth/login`,
        { usuario, password },
        { withCredentials: true }
      );

      navegar('/admin');
    } catch (error) {
      setError(
        error.response?.data?.mensaje ||
        'No se pudo conectar con el servidor.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-pagina">
      <form className="login-tarjeta" onSubmit={iniciarSesion}>
        <div className="login-icono">🚤</div>

        <h1>LanchaYa</h1>
        <p>Acceso exclusivo para administradores</p>

        <label>Usuario</label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Ingresa tu usuario"
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          required
        />

        {error && <div className="login-error">{error}</div>}

        <button type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>

        <a href="/">Volver al inicio</a>
      </form>
    </div>
  );
}

export default Login;
