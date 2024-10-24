import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './RegistroAsistenciaPorSalon.css';
import { BsExclamationCircle } from 'react-icons/bs';

const RegistroAsistenciaPorSalon = () => {
    const navigate = useNavigate();
    const { token, idCurso } = useAuth();
    const storedToken = localStorage.getItem('token');
    const { idSalon, bimestre } = useParams();

    const [estudiantes, setEstudiantes] = useState([]);
    const [salon, setSalon] = useState({});
    const [assistanceData, setAssistanceData] = useState([]);
    const [numWeeks, setNumWeeks] = useState(0); // Estado para controlar el número de semanas
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Estado para controlar el modal de confirmación
    const [toggleState, setToggleState] = useState({}); // Estado para alternar asistencia

    useEffect(() => {
        cargarSalon();
        cargarEstudiantesPorSalonBimestreYCurso();
        cargarAssistanceData();
    }, []);

    const cargarSalon = async () => {
        const urlClassroom = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classrooms/${idSalon}`;
        const resultado = await axios.get(urlClassroom, {
            headers: {
                Authorization: `Bearer ${storedToken}`,
            },
        });
        setSalon(resultado.data)
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

    const cargarAssistanceData = async () => {
        const urlAssistance = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/assistance/classroom/${idSalon}/bimestre/${bimestre}/subject/${idCurso}`;
        const resultado = await axios.get(urlAssistance, {
            headers: {
                Authorization: `Bearer ${storedToken}`,
            },
        });
        setAssistanceData(resultado.data);
        const maxWeek = Math.max(0, ...resultado.data.map(a => a.semana)); // Use 0 as default if no weeks are found
        setNumWeeks(maxWeek === -Infinity ? 0 : maxWeek); // Set to 0 if maxWeek is -Infinity
    };

    const handleAddWeek = () => {
        setShowConfirmModal(true);
    };

    const confirmAddWeek = () => {
        setNumWeeks(numWeeks + 1);
        setShowConfirmModal(false);
    };

    const cancelAddWeek = () => {
        setShowConfirmModal(false);
    };

    const handleAssistanceChange = async (idEstudiante, semana, estadoAsistencia) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/assistance/${idSalon}/student/${idEstudiante}/subject/${idCurso}/bimestre/${bimestre}/week/${semana}`,
                null,
                {
                    params: { status: estadoAsistencia },
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                }
            );
            cargarAssistanceData(); // Recargar los datos de asistencia después de la actualización
        } catch (error) {
            console.error('Error al actualizar la asistencia:', error);
        }
    };

    const handleToggleColumn = async (weekIndex) => {
        const newState = toggleState[weekIndex] === '1' ? '-' : '1';
        setToggleState((prevState) => ({
            ...prevState,
            [weekIndex]: newState,
        }));

        for (const estudiante of estudiantes) {
            await handleAssistanceChange(estudiante.idEstudiante, weekIndex + 1, newState);
        }
    };

    return (
        <div className="listado__profesores">
            <h2 className='registro-asistencia'>Asistencia {salon.level?.levelName} {salon.section?.sectionName} - Bimestre: {bimestre}</h2>
            <section className="barra__profesores">
                <button onClick={() => navigate(-1)} className="btn__regresar">Regresar</button>
                <button className="btn__agregar" onClick={handleAddWeek}>Agregar Semana</button>
            </section>
            <table className="profesores__table">
                <thead className="profesores__thead">
                    <tr className='profesor__table-row'>
                        <th>N°</th>
                        <th>Código</th>
                        <th>Apellidos</th>
                        <th>Nombres</th>
                        {Array.from({ length: numWeeks }, (_, i) => (
                            <th className='semana' key={i}>
                                S{i + 1}
                                <button className='button-allAsistio' onClick={() => handleToggleColumn(i)}>A</button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="profesores__tbody">
                    {estudiantes.map((estudiante, indice) => (
                        <tr key={estudiante.idEstudiante}>
                            <td>{indice + 1}</td>
                            <td>{estudiante.codigo}</td>
                            <td>{estudiante.apellidos}</td>
                            <td>{estudiante.nombres}</td>
                            {Array.from({ length: numWeeks }, (_, i) => {
                                const asistencia = assistanceData.find(a => a.classroomStudent.student.idEstudiante === estudiante.idEstudiante && a.semana === (i + 1));
                                const estadoAsistencia = asistencia ? asistencia.estadoAsistencia : '-';
                                return (
                                    <td key={i} className={`asistencia-general ${estadoAsistencia === '1' ? 'asistencia-presente' : (estadoAsistencia === '0' ? 'asistencia-ausente' : '')}`}>
                                        <select
                                            value={estadoAsistencia}
                                            onChange={(e) => handleAssistanceChange(estudiante.idEstudiante, i + 1, e.target.value)}
                                            className="select-asistencia"
                                        >
                                            <option value="-">-</option>
                                            <option value="1">A</option>
                                            <option value="0">F</option>
                                        </select>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showConfirmModal && (
                <div className="confirmation-modal-overlay">
                    <div className="confirmation-modal">
                        <BsExclamationCircle className='exclamation' />
                        <h2>¿Seguro que quieres agregar una nueva semana?</h2>
                        <div className="confirmation-buttons">
                            <button className='btn-cancelar' onClick={confirmAddWeek}>Sí</button>
                            <button className='btn-eliminar' onClick={cancelAddWeek}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistroAsistenciaPorSalon;
