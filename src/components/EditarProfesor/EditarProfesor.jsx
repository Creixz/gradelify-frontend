import { Link, useNavigate, useParams } from 'react-router-dom';
import './EditarProfesor.css'
import { useAuth } from '../../AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

const EditarProfesor = () => {

  const { token } = useAuth();
  let navegacion = useNavigate();
  const { id } = useParams();

  const urlProfesor = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/profesores/${id}`;
  const urlCursos = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/cursos`;
  const urlRoles = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/roles`;

  const [cursos, setCursos] = useState([])
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    cargarProfesor();
    cargarCursos();
    cargarRoles();
  }, []);

  const [profesor, setProfesor] = useState({
    username: '',
    nombre: '',
    apellidos: '',
    correo: '',
    rol: {}, 
    subject: {}
  });


  const [profesorUpd, setProfesorUpd] = useState({
    username: '',
    nombre: '',
    apellidos: '',
    correo: '',
    idRol: '', 
    idSubject: ''
  });

  const { username, nombre, apellidos, correo, idRol, idSubject } = profesorUpd;

  const cargarProfesor = async () => {
    const resultado = await axios.get(urlProfesor, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setProfesor(resultado.data);

    setProfesorUpd({
      username: resultado.data.username,
      nombre: resultado.data.nombre,
      apellidos: resultado.data.apellidos,
      correo: resultado.data.correo,
      idRol: resultado.data.rol.idRol,
      idSubject: resultado.data.subject.idSubject
    });
  }

  const cargarCursos = async () => {
    const resultado = await axios.get(urlCursos, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCursos(resultado.data)
    console.log(resultado.data)
  }

  const cargarRoles = async () => {
    const resultado = await axios.get(urlRoles, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRoles(resultado.data);
  }


  const onInputChange = (e) => {
    //spread operator ... (expandir los atributos del tipo medida)
    setProfesorUpd({ ...profesorUpd, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault(); // evita que los parametros se envien en la URL

    await axios.put(urlProfesor, profesorUpd, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navegacion('/profesores');
  }



  return (
    <div className='container__agregar-profesor'>

      <h3 className='titulo__agregar-profesor'>Editar Profesor</h3>

      <form onSubmit={(e) => onSubmit(e)}>

        <div className="division">
          <div className="division__1">

            <div className="label__input">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form__control" id="username" name='username' required={true} value={username} onChange={(e) => onInputChange(e)} />
            </div>

            <div className="label__input">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input type="text" className="form__control" id="nombre" name='nombre' required={true} value={nombre} onChange={(e) => onInputChange(e)} />
            </div>

            <div className="label__input">
              <label htmlFor="apellidos" className="form-label">Apellidos</label>
              <input type="text" className="form__control" id="apellidos" name='apellidos' required={true} value={apellidos} onChange={(e) => onInputChange(e)} />
            </div>
          </div>

          <div className="division__2">

            <div className="label__input">
              <label htmlFor="correo" className="form-label">Correo</label>
              <input type="email" className="form__control" id="correo" name='correo' required={true} value={correo} onChange={(e) => onInputChange(e)} />
            </div>

            <div className="form-group label__input">
              <label className='form-label' htmlFor="curso"><b>Curso</b></label>
              <select
                className="form__control"
                name="idSubject"
                value={idSubject}
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

            <div className="form-group label__input">
              <label className='form-label' htmlFor="rol"><b>Rol</b></label>
              <select
                className="form__control"
                name="idRol"
                value={idRol}
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

          </div>

        </div>

        <div className='botones__agregar-profesor'>
          <button type="submit" className="btn__agregar">Guardar</button>
          <Link to='/profesores' className='btn__regresar'>Regresar</Link>
        </div>
      </form>
    </div>
  )
}

export default EditarProfesor