import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Link } from 'react-router-dom';
import './SalonesDeProfesor.css';
import axios from 'axios';

const SalonesDeProfesor = () => {
  const { token, teacherId, nombreCompleto, subject } = useAuth();
  const [salones, setSalones] = useState([]);

  const urlSalonesPorProfesor = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/teacher-classrooms/${teacherId}`;

  useEffect(() => {
    const cargarSalones = async () => {
      try {
        const response = await axios.get(urlSalonesPorProfesor, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSalones(response.data);
      } catch (error) {
        console.error('Error al cargar los salones:', error);
      }
    };

    cargarSalones();
  }, [teacherId, token]);

  return (
    <div className="listado__salones">
      
      <h3 className='titulo__agregar-profesor'>Profesor: <span>{nombreCompleto}</span></h3>
      <h3 className='titulo__agregar-profesor'>Curso: <span>{subject}</span></h3>
      <table className="profesores__table">
        <thead className="profesores__thead">
          <tr className='profesor__table-row'>
            <th scope="col">N°</th>
            <th scope="col">Nivel</th>
            <th scope="col">Sección</th>
            <th scope="col">Estudiantes</th>
          </tr>
        </thead>
        <tbody className="profesores__tbody">
          {salones.map((salon, index) => (
            <tr key={index} className='profesor__table-row'>
              <td>{index + 1}</td>
              <td>{salon.level.levelName}</td>
              <td>{salon.section.sectionName}</td>
              <td>
                <Link to={`/salon/${salon.idClassroom}/estudiantes`} className='btn__estudiantes'>
                  Ver Registro
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalonesDeProfesor;
