import { Link, useNavigate } from 'react-router-dom';
import './AgregarProfesor.css'
import { useAuth } from '../../../AuthContext';
import axios from 'axios';
import { useEffect, useState } from 'react';

const AgregarProfesor = () => {

  const { token } = useAuth();

  let navegacion = useNavigate();

  const urlBaseRol = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/roles`;
  const urlCurso = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/cursos`;

  const [roles, setRoles] = useState([]);
  const [cursos, setCursos] = useState([]);

  const [profesor, setProfesor] = useState({
    nombre: '',       // Inicializa el nombre
    apellidos: '',    // Inicializa los apellidos
    correo: '',       // Inicializa el correo
    password: '',     // Inicializa la contraseña
    idRol: '',        // Inicializa el rol
    idSubject: ''     // Inicializa el curso
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarRoles();
    cargarCursos();
  }, [])

  const cargarRoles = async () => {
    const resultado = await axios.get(urlBaseRol, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRoles(resultado.data);
  }

  const cargarCursos = async () => {
    const resultado = await axios.get(urlCurso, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCursos(resultado.data)
  }

  const onInputChange = (e) => {
    const { name, value } = e.target;

    // Validations
    let errorMessages = { ...errors };

    if (name === 'nombre' || name === 'apellidos') {
      if (/[^a-zA-Z\s]/.test(value)) {
        errorMessages[name] = 'No puede contener números o símbolos.';
      } else {
        delete errorMessages[name];
      }
    }

    if (name === 'correo') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMessages[name] = 'Correo electrónico no válido.';
      } else {
        delete errorMessages[name];
      }
    }

    if (name === 'password') {
      if (/[^a-zA-Z0-9]/.test(value)) {
        errorMessages[name] = 'La contraseña no puede contener símbolos.';
      } else {
        delete errorMessages[name];
      }
    }

    setErrors(errorMessages);
    setProfesor({ ...profesor, [name]: value });
  }

  const onSubmit = async (e) => {
    e.preventDefault(); // evita que los parámetros se envíen en la URL
    if (Object.keys(errors).length === 0) {
      const urlRegistrar = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/register`;
      await axios.post(urlRegistrar, profesor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Redirigimos a la página de inicio
      navegacion('/profesores');
    } else {
      alert("Por favor, corrija los errores en el formulario.");
    }
  }

  return (
    <div className='container__agregar-profesor'>

      <h3 className='titulo__agregar-profesor'>Agregar Profesor</h3>

      <form onSubmit={(e) => onSubmit(e)}>

        <div className="division">
          <div className="division__1">
            <div className="label__input">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input type="text" className="form__control" id="nombre" name='nombre' required={true} value={profesor.nombre} onChange={(e) => onInputChange(e)} />
              {errors.nombre && <span className="error">{errors.nombre}</span>}
            </div>

            <div className="label__input">
              <label htmlFor="apellidos" className="form-label">Apellidos</label>
              <input type="text" className="form__control" id="apellidos" name='apellidos' required={true} value={profesor.apellidos} onChange={(e) => onInputChange(e)} />
              {errors.apellidos && <span className="error">{errors.apellidos}</span>}
            </div>

            <div className="label__input">
              <label htmlFor="password" className="form-label"><b>Contraseña</b></label>
              <input type="password" className="form__control" id="password" name='password' required={true} value={profesor.password} onChange={(e) => onInputChange(e)} />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
          </div>
          <div className="division__2">
            <div className="label__input">
              <label htmlFor="correo" className="form-label">Correo</label>
              <input type="email" className="form__control" id="correo" name='correo' required={true} value={profesor.correo} onChange={(e) => onInputChange(e)} />
              {errors.correo && <span className="error">{errors.correo}</span>}
            </div>

            <div className="form-group label__input">
              <label className='form-label' htmlFor="rol"><b>Rol</b></label>
              <select
                className="form__control"
                name="idRol"
                value={profesor.idRol}
                onChange={(e) => onInputChange(e)}
                required
              >
                <option className='' value="">-</option>
                {roles.map((rol) => (
                  <option key={rol.idRol} value={rol.idRol}>
                    {rol.rol}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group label__input">
              <label className='form-label' htmlFor="curso"><b>Curso</b></label>
              <select
                className="form__control"
                name="idSubject"
                value={profesor.idSubject}
                onChange={(e) => onInputChange(e)}
                required
              >
                <option className='' value="">-</option>
                {cursos.map((curso) => (
                  <option key={curso.idSubject} value={curso.idSubject}>
                    {curso.subjectName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className='botones__agregar-profesor'>
          <button type="submit" className="btn__agregar">Agregar</button>
          <Link to='/profesores' className='btn__regresar'>Regresar</Link>
        </div>
      </form>
    </div>
  )
}

export default AgregarProfesor
