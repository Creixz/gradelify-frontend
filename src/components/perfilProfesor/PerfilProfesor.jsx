import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './PerfilProfesor.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PerfilProfesor = () => {
  const { token, teacherId, role, subject } = useAuth();
  let navegacion = useNavigate();

  const urlProfesor = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/profesores/${teacherId}`;

  const [profesorUpd, setProfesorUpd] = useState({
    username: '',
    nombre: '',
    apellidos: '',
    correo: '',
    idRol: '',
    idSubject: ''
  });

  const { username, nombre, apellidos, correo, idRol, idSubject } = profesorUpd;

  useEffect(() => {
    cargarProfesor();
  }, []);

  const cargarProfesor = async () => {
    const resultado = await axios.get(urlProfesor, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProfesorUpd({
      username: resultado.data.username,
      nombre: resultado.data.nombre,
      apellidos: resultado.data.apellidos,
      correo: resultado.data.correo,
      idRol: resultado.data.rol.idRol,
      idSubject: resultado.data.subject.idSubject
    });
  }

  const onInputChange = (e) => {
    setProfesorUpd({ ...profesorUpd, [e.target.name]: e.target.value });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.put(urlProfesor, profesorUpd, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navegacion('/');
  }

  return (
    <div className='container__agregar-profesor'>
      <h3 className='titulo__agregar-profesor'>Perfil Profesor</h3>

      <form onSubmit={(e) => onSubmit(e)}>

        <div className="division">
          <div className="division__1">
            <div className="label__input">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form__control read-only" id="username" name='username' value={username} readOnly />
            </div>

            <div className="label__input">
              <label htmlFor="correo" className="form-label">Correo</label>
              <input type="email" className="form__control read-only" id="correo" name='correo' value={correo} readOnly />
            </div>

            <div className="label__input">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input type="text" className="form__control" id="nombre" name='nombre' required={true} value={nombre} onChange={(e) => onInputChange(e)} />
            </div>

          </div>

          <div className="division__2">
            <div className="label__input">
              <label htmlFor="apellidos" className="form-label">Apellidos</label>
              <input type="text" className="form__control" id="apellidos" name='apellidos' required={true} value={apellidos} onChange={(e) => onInputChange(e)} />
            </div>

            <div className="label__input">
              <label htmlFor="rol" className="form-label">Rol</label>
              <input type="text" className="form__control read-only" id="rol" name='rol' value={role} readOnly />
            </div>

            <div className="label__input">
              <label htmlFor="curso" className="form-label">Curso</label>
              <input type="text" className="form__control read-only" id="curso" name='curso' value={subject} readOnly />
            </div>
          </div>
        </div>

        <div className='botones__agregar-profesor'>
          <button type="submit" className="btn__agregar">Guardar</button>
          <Link to='/' className='btn__regresar'>Regresar</Link>
        </div>
      </form>
    </div>
  )
}

export default PerfilProfesor;
