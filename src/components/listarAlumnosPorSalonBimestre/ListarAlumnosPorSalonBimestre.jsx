import { Link, useParams } from 'react-router-dom';
import './ListarAlumnosPorSalonBimestre.css';
import { useAuth } from '../../AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BsExclamationCircle } from 'react-icons/bs';

const ListarAlumnosPorSalonBimestre = () => {
  const { salonId } = useParams();
  const { token } = useAuth();
  const storedToken = localStorage.getItem('token');

  const [estudiantes, setEstudiantes] = useState([]);
  const [bimestre, setBimestre] = useState('0');
  const [showModal, setShowModal] = useState(false);
  const [studentsByGrade, setStudentsByGrade] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [gradoId, setGradoId] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [studentIdToDelete, setStudentIdToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [classroomName, setClassroomName] = useState('');

  useEffect(() => {
    cargarGradoId();
    if (bimestre !== '0') {
      cargarEstudiantesPorSalonYBimestre();
    }
  }, [bimestre]);

  useEffect(() => {
    if (gradoId && bimestre !== '0') {
      cargarEstudiantesPorBimestreYNivel(bimestre, gradoId);
    }
  }, [gradoId, bimestre]);

  const cargarGradoId = async () => {
    const urlClassroom = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classrooms/${salonId}`;
    const resultado = await axios.get(urlClassroom, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });
    setGradoId(resultado.data.level.idLevel);
    setClassroomName(`${resultado.data.level.levelName} - ${resultado.data.section.sectionName}`);
  };

  const cargarEstudiantesPorSalonYBimestre = async () => {
    const urlEstudiantesPorSalonYBimestre = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classroom-students?classroomId=${salonId}&bimestre=${bimestre}`;
    const resultado = await axios.get(urlEstudiantesPorSalonYBimestre, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });
    setEstudiantes(resultado.data);
  };

  const cargarEstudiantesPorBimestreYNivel = async (bimestre, levelId) => {
    const urlEstudiantesPorBimestreYNivel = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classroom-students/not-in-any-classroom?bimestre=${bimestre}&levelId=${levelId}`;
    const resultado = await axios.get(urlEstudiantesPorBimestreYNivel, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });
    setStudentsByGrade(resultado.data);
    setFilteredStudents(resultado.data);
  };

  const handleBimestreChange = (e) => {
    const selectedBimestre = e.target.value;
    setBimestre(selectedBimestre);
  };

  const handleAgregarEstudiantes = async () => {
    await cargarEstudiantesPorBimestreYNivel(bimestre, gradoId);
    setShowModal(true);
  };

  const handleSeleccionarEstudiante = (idEstudiante) => {
    setStudentsByGrade((prevStudents) =>
      prevStudents.map((student) =>
        student.idEstudiante === idEstudiante
          ? { ...student, selected: !student.selected }
          : student
      )
    );

    setSelectedStudents((prevSelected) =>
      prevSelected.includes(idEstudiante)
        ? prevSelected.filter((id) => id !== idEstudiante)
        : [...prevSelected, idEstudiante]
    );
  };

  const handleAgregarSeleccionados = async () => {
    const urlAgregarEstudiantes = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classroom-students/add`;
    try {
      await axios.post(
        urlAgregarEstudiantes,
        {
          classroomId: salonId,
          bimestre: bimestre,
          studentIds: selectedStudents,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      setShowModal(false);
      setSelectedStudents([]);
      setStudentsByGrade((prevStudents) =>
        prevStudents.map((student) => ({ ...student, selected: false }))
      );
      cargarEstudiantesPorSalonYBimestre();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Error al agregar estudiantes');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudents([]);
    setStudentsByGrade((prevStudents) =>
      prevStudents.map((student) => ({ ...student, selected: false }))
    );
    setErrorMessage('');
  };

  const eliminarEstudianteSalon = async (idEstudiante) => {
    const urlEliminarEstudiante = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classroom-students/remove`;
    await axios.delete(urlEliminarEstudiante, {
      params: {
        classroomId: salonId,
        studentId: idEstudiante,
        bimestre: bimestre,
      },
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });
    cargarEstudiantesPorSalonYBimestre();
  };

  const showConfirmation = (idEstudiante) => {
    setStudentIdToDelete(idEstudiante);
    setShowConfirmationModal(true);
  };

  const hideConfirmation = () => {
    setShowConfirmationModal(false);
    setStudentIdToDelete(null);
  };

  const confirmDeleteEstudiante = async () => {
    await eliminarEstudianteSalon(studentIdToDelete);
    hideConfirmation();
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    setFilteredStudents(
      studentsByGrade.filter(
        (student) =>
          student.codigoEstudiante.toLowerCase().includes(searchTerm) ||
          student.nombres.toLowerCase().includes(searchTerm) ||
          student.apellidos.toLowerCase().includes(searchTerm)
      )
    );
  };

  return (
    <div className="listado__profesores">
      <section className="barra__profesores">
        <Link to="/salones" className="btn__regresar">
          Regresar
        </Link>

        <select className="curso__select" value={bimestre} onChange={handleBimestreChange}>
          <option value="0">Selec. Bimestre</option>
          <option value="1">Bimestre 1</option>
          <option value="2">Bimestre 2</option>
          <option value="3">Bimestre 3</option>
          <option value="4">Bimestre 4</option>
        </select>

        {bimestre !== '0' && (
          <button onClick={handleAgregarEstudiantes} className="btn__agregar">
            Agregar Estudiantes
          </button>
        )}
      </section>

      <h3 className='nombre__salon'>Salon: {classroomName}</h3>

      <table className="profesores__table">
        <thead className="profesores__thead">
          <tr className="profesor__table-row">
            <th scope="col">N°</th>
            <th scope="col">Código</th>
            <th scope="col">Apellidos</th>
            <th scope="col">Nombres</th>
            <th></th>
          </tr>
        </thead>
        {Array.isArray(estudiantes) && estudiantes.length > 0 ? (
          <tbody className="profesores__tbody">
            {estudiantes
              .slice()
              .sort((a, b) => a.apellidos.localeCompare(b.apellidos))
              .map((estudiante, indice) => (
                <tr key={estudiante.idEstudiante} className="profesor__table-row">
                  <th scope="row">{indice + 1}</th>
                  <td>{estudiante.codigoEstudiante}</td>
                  <td>{estudiante.apellidos}</td>
                  <td>{estudiante.nombres}</td>
                  <td>
                    <button className='btn__icon-eliminar' onClick={() => showConfirmation(estudiante.idEstudiante)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="8">No hay estudiantes en este salón.</td>
            </tr>
          </tbody>
        )}
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content modal-table">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2 className="subtitulo">Seleccionar Estudiantes</h2>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <section className='barra__profesores'>
              <input
                type="text"
                className="input__busqueda"
                placeholder="Buscar por código, nombre o apellido"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="btn__agregar" onClick={handleAgregarSeleccionados}>
              Agregar
            </button>
            </section>

            <table className="profesores__table">
              <thead className="profesores__thead">
                <tr className="profesor__table-row">
                  <th scope="col">N°</th>
                  <th scope="col">Código</th>
                  <th scope="col">Apellidos y Nombres</th>
                  <th scope="col"> </th>
                </tr>
              </thead>
              <tbody className="profesores__tbody">
                {filteredStudents.map((student, indice) => (
                  <tr key={student.idEstudiante} className="profesor__table-row">
                    <th scope="row">{indice + 1}</th>
                    <td>{student.codigoEstudiante}</td>
                    <td>
                      {student.apellidos} {student.nombres}
                    </td>
                    <td>
                      <button
                        className={`btn__seleccionar ${selectedStudents.includes(student.idEstudiante) ? 'selected' : ''
                          }`}
                        onClick={() => handleSeleccionarEstudiante(student.idEstudiante)}
                      >
                        {selectedStudents.includes(student.idEstudiante) ? 'Seleccionado' : 'Seleccionar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showConfirmationModal && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal">
            <BsExclamationCircle className='exclamation' />
            <h2>¿Estás seguro que deseas eliminar al estudiante del salón?</h2>
            <div className="confirmation-buttons">
              <button className='btn-eliminar' onClick={confirmDeleteEstudiante}>Confirmar</button>
              <button className='btn-cancelar' onClick={hideConfirmation}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarAlumnosPorSalonBimestre;
