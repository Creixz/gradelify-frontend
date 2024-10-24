import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../AuthContext'
import './ListadoProfesores.css'
import axios from 'axios';
import Dropdown from '../../dropDown/DropDownCurso';
import { IoPersonAddSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { BiSolidUserDetail } from 'react-icons/bi';

const ListadoProfesores = () => {

  const { token, role } = useAuth();

  const urlBase = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/profesores`;
  const urlCurso = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/cursos`;

  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const filtroUsernameRef = useRef('');

  useEffect(() => {
    cargarUsuarios();
    cargarCursos();
  }, [])

  const handleCourseChange = (selectedCursoId) => {
    if (selectedCursoId == '') {
      cargarUsuarios();
      return
    }
    cargarProfesoresPorCurso(selectedCursoId);
  };

  const cargarUsuarios = async () => {
    const resultado = await axios.get(urlBase, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsuarios(resultado.data)
  }

  const cargarCursos = async () => {
    const resultado = await axios.get(urlCurso, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCursos(resultado.data)
    console.log(resultado.data)
  }

  const cargarProfesoresPorCurso = async (idCurso) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/profesores/s?idSubject=${idCurso}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsuarios(response.data)
  }

  const toggleEstado = async (idTeacher) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/profesores/${idTeacher}/toggle-state`;
    await axios.put(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    cargarUsuarios();
  }

  const handleBuscar = () => {
    // Filtrar los usuarios por el nombre de usuario
    const filtro = filtroUsernameRef.current.value;
    console.log(filtro.trim())
    if (filtro.trim() === '') {
      console.log("Campo de búsqueda vacío");
      cargarUsuarios();
    } else {
      const usuariosFiltrados = usuarios.filter(usuario => usuario.username.includes(filtro));
      setUsuarios(usuariosFiltrados);
    }

  };

  return (
    <div className="listado__profesores">

      {role === 'ADMINISTRADOR' ?
        <section className='barra__profesores'>
          <Link to="/agregar-profesor" className='btn__agregar'>
            <IoPersonAddSharp style={{ width: '24px' }} /> Agregar Personal
          </Link>
          <Dropdown options={cursos} onChange={handleCourseChange} />
          <div className="buscar__form">
            <input
              className='input__busqueda'
              placeholder='Ingresa username'
              type="text"
              id="buscar"
              onChange={handleBuscar}
              ref={filtroUsernameRef}
            />
          </div>
        </section>
        : null}

      <table className="profesores__table">
        <thead className="profesores__thead">
          <tr className='profesor__table-row'>
            <th scope="col">N°</th>
            <th scope="col">Username</th>
            <th scope="col">Nombre y Apellidos</th>
            <th scope="col">Correo</th>
            <th scope="col">Curso</th>
            <th scope="col">Rol</th>
            <th scope="col">Estado</th>
            <th scope="col">Salones</th>
            <th scope="col"> </th>
          </tr>
        </thead>
        <tbody className="profesores__tbody">
          {
            usuarios.map((usuario, indice) => (
              <tr key={indice} className='profesor__table-row'>
                <th scope='row'>{indice + 1}</th>
                <td>{usuario.username}</td>
                <td>{usuario.nombre} {usuario.apellidos}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.subject.subjectName}</td>
                <td>{usuario.rol.rol}</td>
                <td>
                  <button className={usuario.estado === 1 ? 'activo' : 'inactivo'} onClick={() => toggleEstado(usuario.idTeacher)}>
                    {usuario.estado === 1 ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td>
                  <Link to={`/profesor/salones/${usuario.idTeacher}`} className='btn__listar-salones'>
                    <BiSolidUserDetail className='icono__listar-salon' style={{ width: '24px' }} /> Lista
                  </Link>
                </td>
                <td>
                  <Link to={`/profesores/${usuario.idTeacher}`} className='edit__bottom'>
                    <FaRegEdit style={{ width: '2rem', fontSize: '1.3rem', marginBottom: '-0.35rem' }} />
                  </Link>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default ListadoProfesores