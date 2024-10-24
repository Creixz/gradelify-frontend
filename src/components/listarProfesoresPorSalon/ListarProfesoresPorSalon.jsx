import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './ListarProfesoresPorSalon.css'
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { IoPersonAddSharp } from 'react-icons/io5';
import { BsExclamationCircle } from "react-icons/bs";

const ListarProfesoresPorSalon = () => {

  const { token } = useAuth();
  const storedToken = localStorage.getItem('token');
  const { id } = useParams();
  const filtroUsernameRef = useRef('');

  const urlProfesoresPorSalon = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classroom-teachers/${id}`;
  const urlProfesores = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/profesores`;

  const [profesoresSalon, setProfesoresSalon] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [profesoresSeleccionados, setProfesoresSeleccionados] = useState([]);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [profesorIdToDelete, setProfesorIdToDelete] = useState(null);
  const [classroomName, setClassroomName] = useState(''); 

  useEffect(() => {
    cargarProfesoresPorSalon();
    cargarProfesores();
    cargarGradoId();
  }, []);

  const cargarProfesoresPorSalon = async () => {
    const resultado = await axios.get(urlProfesoresPorSalon, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setProfesoresSalon(resultado.data);
  }

  const cargarProfesores = async () => {
    const resultado = await axios.get(urlProfesores, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setProfesores(resultado.data)
  }

  const guardarProfesores = async (idsProfesores, idSalon) => {
    const classroomTeacher = {
      classroomId: idSalon,
      teacherIds: idsProfesores
    }
    const urlGuardarProfesor = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classroom-teachers`;
    const resultado = await axios.post(urlGuardarProfesor, classroomTeacher, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return resultado;
  }

  const cargarGradoId = async () => {
    const urlClassroom = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classrooms/${id}`;
    const resultado = await axios.get(urlClassroom, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });
    setClassroomName(`${resultado.data.level.levelName} - ${resultado.data.section.sectionName}`); 
  };

  const eliminarProfesorSalon = async (idProfesor) => {
    const urlEliminarProfesor = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/remove-teacher`;
    await axios.delete(urlEliminarProfesor, {
      params: {
        classroomId: id,
        teacherId: idProfesor
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await cargarProfesoresPorSalon();
  };

  const showConfirmation = (idProfesor) => {
    setProfesorIdToDelete(idProfesor);
    setShowConfirmationModal(true);
  };

  const hideConfirmation = () => {
    setShowConfirmationModal(false);
    setProfesorIdToDelete(null);
  };

  const confirmDeleteProfesor = async () => {
    await eliminarProfesorSalon(profesorIdToDelete);
    hideConfirmation();
  };

  const handleAgregarProfesores = async () => {
    if (profesoresSeleccionados.length > 0) {
      await guardarProfesores(profesoresSeleccionados, id);
      await cargarProfesoresPorSalon();
      setShowModal(false); // Cierra el modal después de agregar los profesores
      clearSelection();
      filtroUsernameRef.current.value = '';
      await cargarProfesores();
    }
  };

  const handleBuscar = () => {
    // Filtrar los usuarios por el nombre de usuario
    const filtro = filtroUsernameRef.current.value;
    if (filtro.trim() === '') {
      cargarProfesores();
    } else {
      const usuariosFiltrados = profesores.filter(profesor => profesor.username.includes(filtro));
      setProfesores(usuariosFiltrados);
    }
  };

  const toggleSelect = (id) => {
    setProfesores((prevProfesores) =>
      prevProfesores.map((profesor) =>
        profesor.idTeacher === id
          ? { ...profesor, selected: !profesor.selected }
          : profesor
      )
    );

    setProfesoresSeleccionados((prevSeleccionados) => {
      if (prevSeleccionados.includes(id)) {
        return prevSeleccionados.filter((profesorId) => profesorId !== id);
      } else {
        return [...prevSeleccionados, id];
      }
    });
  };

  const clearSelection = () => {
    setProfesores((prevProfesores) =>
      prevProfesores.map((profesor) => ({ ...profesor, selected: false }))
    );
    setProfesoresSeleccionados([]);
  };

  return (
    <div className="listado__profesores">

      <section className='barra__profesores'>
        <Link to="/salones" className='btn__regresar'>
          Regresar
        </Link>
        <button onClick={() => setShowModal(true)} className='btn__agregar'>
          <IoPersonAddSharp style={{ width: '24px' }} /> Agregar Profesor al Salón
        </button>
      </section>

      <h3 className='nombre__salon'>Salon: {classroomName}</h3> 

      <table className="profesores__table">
        <thead className="profesores__thead">
          <tr className='profesor__table-row'>
            <th scope="col">N°</th>
            <th scope="col">Username</th>
            <th scope="col">Nombre</th>
            <th scope="col">Apellidos</th>
            <th scope="col">Correo</th>
            <th scope="col">Curso</th>
            <th></th>
          </tr>
        </thead>
        {Array.isArray(profesoresSalon) && profesoresSalon.length > 0 ? (
          <tbody className="profesores__tbody">
            {profesoresSalon.map((profesor, indice) => (
              <tr key={profesor.idTeacher} className='profesor__table-row'>
                <th scope='row'>{indice + 1}</th>
                <td>{profesor.username}</td>
                <td>{profesor.nombre}</td>
                <td>{profesor.apellidos}</td>
                <td>{profesor.correo}</td>
                <td>{profesor.subject.subjectName}</td>
                <td>
                  <button className='btn__icon-eliminar' onClick={() => showConfirmation(profesor.idTeacher)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="8">No hay profesores en este salón.</td>
            </tr>
          </tbody>
        )}
      </table>

      {/* Modal para seleccionar un profesor existente */}
      {showModal && (
        <div className="modal">
          <div className="modal-content modal-table">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2 className='subtitulo'>Seleccionar Profesor</h2>

            <section className='barra__profesores'>
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

            <table className="profesores__table">
              <thead className="profesores__thead">
                <tr className='profesor__table-row'>
                  <th scope="col">N°</th>
                  <th scope="col">Username</th>
                  <th scope="col">Nombre y Apellidos</th>
                  <th scope="col">Curso</th>
                  <th scope="col"> </th>
                </tr>
              </thead>
              <tbody className="profesores__tbody">
                {
                  profesores.map((profesor, indice) => (
                    <tr key={profesor.idTeacher} className='profesor__table-row'>
                      <th scope='row'>{indice + 1}</th>
                      <td>{profesor.username}</td>
                      <td>{profesor.nombre} {profesor.apellidos}</td>
                      <td>{profesor.subject.subjectName}</td>
                      <td>
                        <button
                          className={`btn__seleccionar ${profesor.selected ? 'selected' : ''}`}
                          onClick={() => toggleSelect(profesor.idTeacher)}
                        >
                          {profesor.selected ? 'Seleccionado' : 'Seleccionar'}
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <button className='btn__agregar' onClick={handleAgregarProfesores}>Agregar</button>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirmationModal && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal">
            <BsExclamationCircle className='exclamation'/>
            <h2>¿Estás seguro que deseas eliminar al profesor del salón?</h2>
            <div className="confirmation-buttons">
              <button className='btn-eliminar' onClick={confirmDeleteProfesor}>Confirmar</button>
              <button className='btn-cancelar' onClick={hideConfirmation}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ListarProfesoresPorSalon;
