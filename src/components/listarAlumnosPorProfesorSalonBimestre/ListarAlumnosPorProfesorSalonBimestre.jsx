import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ListarAlumnosPorProfesorSalonBimestre.css';
import { Radar, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const ListarAlumnosPorProfesorSalonBimestre = () => {
  const { token, idCurso } = useAuth();
  const storedToken = localStorage.getItem('token');
  const { idSalon } = useParams();
  const navigate = useNavigate();

  const [estudiantes, setEstudiantes] = useState([]);
  const [bimestre, setBimestre] = useState('0');
  const [showModal, setShowModal] = useState(false);
  const [showTopStudentsModal, setShowTopStudentsModal] = useState(false);
  const [salon, setSalon] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [topStudents, setTopStudents] = useState([]);

  useEffect(() => {
    cargarSalon();
    if (bimestre !== '0') {
      cargarEstudiantesPorSalonBimestreYCurso();
    }
  }, [bimestre]);

  const cargarSalon = async () => {
    const urlClassroom = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classrooms/${idSalon}`;
    const resultado = await axios.get(urlClassroom, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });
    setSalon(resultado.data);
  };

  const cargarEstudiantesPorSalonBimestreYCurso = async () => {
    const urlEstudiantesPorSalonBimestreYCurso = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/notas-estudiante/${idSalon}/bimestre/${bimestre}/curso/${idCurso}`;
    const resultado = await axios.get(urlEstudiantesPorSalonBimestreYCurso, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });
    const sortedStudents = resultado.data.sort((a, b) => a.apellidos.localeCompare(b.apellidos));
    setEstudiantes(sortedStudents);
  };

  const handleBimestreChange = (e) => {
    const selectedBimestre = e.target.value;
    setBimestre(selectedBimestre);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEstudiantes = estudiantes.filter(estudiante =>
    estudiante.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudiante.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudiante.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNotaChange = async (idEstudiante, campo, valor) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/actualizar-nota/${idSalon}/bimestre/${bimestre}/curso/${idCurso}/estudiante/${idEstudiante}`,
        { campo, valor },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      cargarEstudiantesPorSalonBimestreYCurso();
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
    }
  };

  const handleShowModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const handleShowTopStudentsModal = () => {
    calcularTopStudents();
    setShowTopStudentsModal(true);
  };

  const handleCloseTopStudentsModal = () => {
    setShowTopStudentsModal(false);
  };

  const handleShowAssistanceModal = () => {
    navigate(`/registro-asistencia/${idSalon}/${bimestre}/${idCurso}`);
  };

  const getStudentData = (student) => {
    return [
      parseFloat(student.pa1) || 0.5,
      parseFloat(student.pa2) || 0.5,
      parseFloat(student.pa3) || 0.5,
      parseFloat(student.pc) || 0.5,
      parseFloat(student.rc) || 0.5,
    ];
  };

  const calcularTopStudents = () => {
    const studentsWithAvg = estudiantes.map(estudiante => {
      const promedio = (parseFloat(estudiante.pa1 || 0) + parseFloat(estudiante.pa2 || 0) + parseFloat(estudiante.pa3 || 0) + parseFloat(estudiante.pc || 0) + parseFloat(estudiante.rc || 0)) / 5;
      return { ...estudiante, promedio };
    });

    const sortedByAvg = studentsWithAvg.sort((a, b) => b.promedio - a.promedio).slice(0, 10);
    setTopStudents(sortedByAvg);
  };

  const getDistribution = (field) => {
    const distribution = { A_plus: 0, A: 0, B_plus: 0, B: 0, C: 0 };
    estudiantes.forEach(estudiante => {
      switch (estudiante[field]) {
        case '5':
          distribution.A_plus += 1;
          break;
        case '4':
          distribution.A += 1;
          break;
        case '3':
          distribution.B_plus += 1;
          break;
        case '2':
          distribution.B += 1;
          break;
        case '1':
          distribution.C += 1;
          break;
        default:
          break;
      }
    });
    return distribution;
  };

  const handleShowGraficos = (bimestre, classroomName) => {
    const distributionPA1 = getDistribution('pa1');
    const distributionPA2 = getDistribution('pa2');
    const distributionPA3 = getDistribution('pa3');
    const distributionPC = getDistribution('pc');
    const distributionRC = getDistribution('rc');
    navigate('/graficos-por-salon', { state: { distributionPA1, distributionPA2, distributionPA3, distributionPC, distributionRC, classroomName, bimestre } });
  };

  return (
    <div className="listado__profesores">
      <h2 className='registro-asistencia'>Registro {salon.level?.levelName} {salon.section?.sectionName}</h2>
      <section className="barra__profesores">
        <Link to="/salones-de-profesor" className="btn__regresar">
          Regresar
        </Link>

        <select className="curso__select" value={bimestre} onChange={handleBimestreChange}>
          <option value="0">Selec. Bimestre</option>
          <option value="1">Bimestre 1</option>
          <option value="2">Bimestre 2</option>
          <option value="3">Bimestre 3</option>
          <option value="4">Bimestre 4</option>
        </select>
      </section>

      <section className="barra__profesores">
        {bimestre !== '0' && (
          <>
            <input
              type="text"
              placeholder="Buscar alumno..."
              value={searchTerm}
              onChange={handleSearchTermChange}
              className="input__busqueda busqueda__registro"
            />
            <div className="doughnut-chart">
              <button className='graficos__pastel-button' onClick={() => handleShowGraficos(bimestre, salon.level.levelName)}>Ver Gráficos de Distribución</button>
            </div>
            <button className="asistencia__button" onClick={handleShowAssistanceModal}>Ver Asistencia</button>
            <button className="top-students__button" onClick={handleShowTopStudentsModal}>Ver Top 10 Alumnos</button>
          </>
        )}
      </section>

      <table className="profesores__table">
        <thead className="profesores__thead">
          <tr className="profesor__table-row">
            <th scope="col">N°</th>
            <th scope="col">Código</th>
            <th scope="col">Apellidos</th>
            <th scope="col">Nombres</th>
            <th scope="col">PA1</th>
            <th scope="col">PA2</th>
            <th scope="col">PA3</th>
            <th scope="col">PC</th>
            <th scope="col">RC</th>
            {bimestre !== '0' && <th scope="col">Estadísticas</th>}
          </tr>
        </thead>
        {bimestre === '0' ? (
          <tbody>
            <tr>
              <td colSpan="10">No hay estudiantes en este salón.</td>
            </tr>
          </tbody>
        ) : (
          <>
            {Array.isArray(filteredEstudiantes) && filteredEstudiantes.length > 0 ? (
              <tbody className="profesores__tbody">
                {filteredEstudiantes.map((estudiante, indice) => (
                  <tr key={estudiante.idEstudiante} className="profesor__table-row">
                    <th scope="row">{indice + 1}</th>
                    <td>{estudiante.codigo}</td>
                    <td>{estudiante.apellidos}</td>
                    <td>{estudiante.nombres}</td>
                    <td>
                      <select
                        value={estudiante.pa1 || '-'}
                        onChange={(e) => handleNotaChange(estudiante.idEstudiante, 'pa1', e.target.value)}
                      >
                        <option value="-">-</option>
                        <option value="5">A+</option>
                        <option value="4">A</option>
                        <option value="3">B+</option>
                        <option value="2">B</option>
                        <option value="1">C</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={estudiante.pa2 || '-'}
                        onChange={(e) => handleNotaChange(estudiante.idEstudiante, 'pa2', e.target.value)}
                      >
                        <option value="-">-</option>
                        <option value="5">A+</option>
                        <option value="4">A</option>
                        <option value="3">B+</option>
                        <option value="2">B</option>
                        <option value="1">C</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={estudiante.pa3 || '-'}
                        onChange={(e) => handleNotaChange(estudiante.idEstudiante, 'pa3', e.target.value)}
                      >
                        <option value="-">-</option>
                        <option value="5">A+</option>
                        <option value="4">A</option>
                        <option value="3">B+</option>
                        <option value="2">B</option>
                        <option value="1">C</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={estudiante.pc || '-'}
                        onChange={(e) => handleNotaChange(estudiante.idEstudiante, 'pc', e.target.value)}
                      >
                        <option value="-">-</option>
                        <option value="5">A+</option>
                        <option value="4">A</option>
                        <option value="3">B+</option>
                        <option value="2">B</option>
                        <option value="1">C</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={estudiante.rc || '-'}
                        onChange={(e) => handleNotaChange(estudiante.idEstudiante, 'rc', e.target.value)}
                      >
                        <option value="-">-</option>
                        <option value="5">A+</option>
                        <option value="4">A</option>
                        <option value="3">B+</option>
                        <option value="2">B</option>
                        <option value="1">C</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleShowModal(estudiante)}>Ver Estadísticas</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="10">No hay estudiantes en este salón.</td>
                </tr>
              </tbody>
            )}
          </>
        )}
      </table>

      {showModal && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content telaraña-modal">
            <div className="modal-header">
              <h2 className="modal-title">Estadística de {selectedStudent.nombres}</h2>
              <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            </div>
            <div className="modal-body">
              <Radar
                data={{
                  labels: ['Participación Activa 1', 'Participación Activa 2', 'Participación Activa 3', 'Práctica Calificada', 'Revisión de Cuaderno'],
                  datasets: [
                    {
                      label: `${selectedStudent.nombres} ${selectedStudent.apellidos}`,
                      data: getStudentData(selectedStudent),
                      backgroundColor: 'rgba(34, 202, 236, .2)',
                      borderColor: 'rgba(34, 202, 236, 1)',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  scales: {
                    r: {
                      min: 0,
                      max: 5,
                      ticks: { beginAtZero: true, display: false },
                      pointLabels: { fontSize: 14, color: 'white' },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.3)'
                      },
                      angleLines: {
                        color: 'rgba(255, 255, 255, 0.3)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: 'white',
                        font: {
                          size: 14
                        }
                      }
                    }
                  },
                  responsive: true,
                  maintainAspectRatio: false
                }}
                height={200}
                width={200}
              />
            </div>
            <div className="modal-footer">
            </div>
          </div>
        </div>
      )}

      {showTopStudentsModal && (
        <div className="modal-overlay">
          <div className="modal-content bar-chart-modal">
            <div className="modal-header">
              <h2 className="modal-title">Top 10 Alumnos</h2>
              <button className="modal-close" onClick={handleCloseTopStudentsModal}>&times;</button>
            </div>
            <div className="modal-body">
              <Bar
                data={{
                  labels: topStudents.map(student => `${student.nombres} ${student.apellidos}`),
                  datasets: [
                    {
                      label: 'Promedio',
                      data: topStudents.map(student => student.promedio),
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 5
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  responsive: true,
                  maintainAspectRatio: false
                }}
                height={400}
                width={600}
              />
            </div>
            <div className="modal-footer">
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarAlumnosPorProfesorSalonBimestre;
