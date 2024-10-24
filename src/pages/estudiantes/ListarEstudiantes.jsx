import { useEffect, useRef, useState } from 'react';
import './ListarEstudiantes.css';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import { Link } from 'react-router-dom';
import { FaPlusSquare, FaRegEdit } from 'react-icons/fa';
import { BsExclamationCircle } from 'react-icons/bs';

const ListarEstudiantes = () => {
  const { token, role } = useAuth();
  const storedToken = localStorage.getItem('token');
  const filtroStudentRef = useRef(null);

  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    const resultado = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classroom-allStudents-details?page=0&size=1000`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });
    const estudiantesOrdenados = resultado.data.content.sort((a, b) => {
      if (a.level < b.level) return -1;
      if (a.level > b.level) return 1;
      if (a.apellidos < b.apellidos) return -1;
      if (a.apellidos > b.apellidos) return 1;
      return 0;
    });
    setEstudiantes(estudiantesOrdenados);
    setFilteredEstudiantes(estudiantesOrdenados);
    setTotalPaginas(Math.ceil(estudiantesOrdenados.length / 10));
  };

  const handleBuscarEstudiante = () => {
    const filtro = filtroStudentRef.current.value.trim().toLowerCase();

    if (filtro === '') {
      setFilteredEstudiantes(estudiantes);
      setTotalPaginas(Math.ceil(estudiantes.length / 10));
      setPaginaActual(0);
    } else {
      const estudiantesFiltrados = estudiantes.filter(estudiante =>
        estudiante.codigo.toLowerCase().includes(filtro) ||
        estudiante.nombres.toLowerCase().includes(filtro) ||
        estudiante.apellidos.toLowerCase().includes(filtro)
      );

      setFilteredEstudiantes(estudiantesFiltrados);
      setTotalPaginas(Math.ceil(estudiantesFiltrados.length / 10));
      setPaginaActual(0);
    }
  };

  const toggleEstado = async (idStudent) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/students/${idStudent}/toggle-state`;
    await axios.put(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    cargarEstudiantes();
  };

  const handleLinkClick = (event, classroomId) => {
    if (!classroomId) {
      event.preventDefault();
      setShowModal(true);
    }
  };

  const hideModal = () => {
    setShowModal(false);
  };

  const cambiarPagina = (pagina) => {
    setPaginaActual(pagina);
  };

  const estudiantesPaginados = filteredEstudiantes.slice(paginaActual * 10, (paginaActual + 1) * 10);

  return (
    <div className="listado__salones">
      {role === 'ADMINISTRADOR' ? (
        <section className='barra__profesores'>
          <Link to="/agregar-estudiante" className='btn__agregar'>
            <FaPlusSquare style={{ width: '24px' }} /> Matricular Estudiante
          </Link>
          <div className="buscar__form">
            <input
              className='input__busqueda'
              placeholder='Código, nombre o apellido'
              type="text"
              id="buscar"
              onChange={handleBuscarEstudiante}
              ref={filtroStudentRef}
            />
          </div>
        </section>
      ) : null}

      <table className="profesores__table">
        <thead className="profesores__thead">
          <tr className='profesor__table-row'>
            <th scope="col">N°</th>
            <th scope="col">Código</th>
            <th scope="col">Apellidos</th>
            <th scope="col">Nombres</th>
            <th scope="col">Grado</th>
            <th scope="col">I Bim</th>
            <th scope="col">II Bim</th>
            <th scope="col">III Bim</th>
            <th scope="col">IV Bim</th>
            <th scope="col">Estado</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody className="profesores__tbody">
          {estudiantesPaginados.map((estudiante, indice) => (
            <tr key={indice} className='profesor__table-row'>
              <th scope='row'>{paginaActual * 10 + indice + 1}</th>
              <td>{estudiante.codigo}</td>
              <td>{estudiante.apellidos}</td>
              <td>{estudiante.nombres}</td>
              <td>{estudiante.level}</td>
              <td>
                <Link to={`/notas-estudiantes/${estudiante.id}/salon/${estudiante.bimestre1Classroom?.idClassroom}/bimestre/1`} onClick={(e) => handleLinkClick(e, estudiante.bimestre1Classroom?.idClassroom)}>
                  {estudiante.bimestre1Classroom?.section.sectionName || 'N/A'}
                </Link>
              </td>
              <td>
                <Link to={`/notas-estudiantes/${estudiante.id}/salon/${estudiante.bimestre2Classroom?.idClassroom}/bimestre/2`} onClick={(e) => handleLinkClick(e, estudiante.bimestre2Classroom?.idClassroom)}>
                  {estudiante.bimestre2Classroom?.section.sectionName || 'N/A'}
                </Link>
              </td>
              <td>
                <Link to={`/notas-estudiantes/${estudiante.id}/salon/${estudiante.bimestre3Classroom?.idClassroom}/bimestre/3`} onClick={(e) => handleLinkClick(e, estudiante.bimestre3Classroom?.idClassroom)}>
                  {estudiante.bimestre3Classroom?.section.sectionName || 'N/A'}
                </Link>
              </td>
              <td>
                <Link to={`/notas-estudiantes/${estudiante.id}/salon/${estudiante.bimestre4Classroom?.idClassroom}/bimestre/4`} onClick={(e) => handleLinkClick(e, estudiante.bimestre4Classroom?.idClassroom)}>
                  {estudiante.bimestre4Classroom?.section.sectionName || 'N/A'}
                </Link>
              </td>
              <td>
                <button
                  className={estudiante.estado === 1 ? 'activo' : 'inactivo'}
                  onClick={() => toggleEstado(estudiante.id)}>
                  {estudiante.estado === 1 ? 'Activo' : 'Inactivo'}
                </button>
              </td>
              <td>
                <Link to={`/estudiantes/${estudiante.id}`} className='edit__bottom'>
                  <FaRegEdit style={{ width: '2rem', fontSize: '1.3rem', marginBottom: '-0.35rem' }} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal">
            <BsExclamationCircle className='exclamation' />
            <h2>El alumno aún no ha sido inscrito en un salón en este bimestre.</h2>
            <div className="confirmation-buttons">
              <button className='btn-cancelar' onClick={hideModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <div className="paginacion">
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 0}
        >
          Anterior
        </button>
        <span>{paginaActual + 1} de {totalPaginas}</span>
        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas - 1}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ListarEstudiantes;
