import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Login.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBook } from 'react-icons/fa6';
import { BsExclamationCircle } from 'react-icons/bs';

const MAX_ATTEMPTS = 100;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showInvalidCredentialsModal, setShowInvalidCredentialsModal] = useState(false);
  const [showLockedUserModal, setShowLockedUserModal] = useState(false);
  const [showDisabledUserModal, setShowDisabledUserModal] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const storedToken = localStorage.getItem('token');

  useEffect(() => {
    if (storedToken) {
      navigate('/');
    }

    const failedAttempts = localStorage.getItem('failedAttempts');
    if (failedAttempts && parseInt(failedAttempts) >= MAX_ATTEMPTS) {
      setShowLockedUserModal(true);
    }
  }, [storedToken, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setShowInvalidCredentialsModal(true);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/login`,
        { username, password }
      );
      const token = response.data.token;

      if (!token) {
        setShowDisabledUserModal(true);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('failedAttempts', 0); // Reset failed attempts on successful login
      login(token);
      navigate('/');

    } catch (error) {
      console.error('Error de autenticación', error);

      let failedAttempts = parseInt(localStorage.getItem('failedAttempts')) || 0;
      failedAttempts += 1;
      localStorage.setItem('failedAttempts', failedAttempts);

      if (failedAttempts >= MAX_ATTEMPTS) {
        await toggleEstado(username); // Bloquea al usuario después de tres intentos fallidos
        setShowLockedUserModal(true);
      } else {
        setShowInvalidCredentialsModal(true);
      }
    }
  };

  const toggleEstado = async (username) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/profesores/username/${username}/toggle-state`;
      await axios.put(url)
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
    }
  };

  return (
    <div className='super-contenedor'>
      <div className='contenedor'>
        <div className='logo'>
          <FaBook style={{ fontSize: '4rem', color: '#F4633A', width: '70px' }} className='book' />
          <span> Gradelify</span>
        </div>
        <div className='contenido'>
          <form onSubmit={(e) => handleLogin(e)}>
            <div className='title'>Login</div>
            <div className='input-box underline'>
              <input
                type='text'
                name='username'
                placeholder='Ingresa tu username'
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className='underline'></div>
            </div>
            <div className='input-box'>
              <input
                type='password'
                name='password'
                placeholder='Ingresa tu contraseña'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className='underline'></div>
            </div>
            <div className='input-box button'>
              <input type='submit' value='Ingresar' />
            </div>
          </form>
        </div>
      </div>

      {/* Modal para credenciales incorrectas */}
      {showInvalidCredentialsModal && (
        <div className="modal">
          <div className="modal-content modal-login">
            <span className="close" onClick={() => setShowInvalidCredentialsModal(false)}>&times;</span>
            <BsExclamationCircle className='exclamation'/>
            <h2>Credenciales incorrectas</h2>
            <p>Por favor, verifica tus credenciales e intenta de nuevo.</p>
          </div>
        </div>
      )}
      {/* Modal para usuario bloqueado */}
      {showLockedUserModal && (
        <div className="modal">
          <div className="modal-content modal-login">
            <span className="close" onClick={() => setShowLockedUserModal(false)}>&times;</span>
            <BsExclamationCircle className='exclamation'/>
            <h2>Usuario bloqueado</h2>
            <p>Tu cuenta ha sido bloqueada debido a múltiples intentos fallidos de inicio de sesión. Contacta al administrador para desbloquear tu cuenta.</p>
          </div>
        </div>
      )}
      {/* Modal para usuario deshabilitado */}
      {showDisabledUserModal && (
        <div className="modal">
          <div className="modal-content modal-login">
            <span className="close" onClick={() => setShowDisabledUserModal(false)}>&times;</span>
            <BsExclamationCircle className='exclamation'/>
            <h2>Usuario deshabilitado</h2>
            <p>Tu usuario ha sido deshabilitado. Por favor, contacta al administrador para más información.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
