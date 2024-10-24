import { useEffect, useState } from 'react';
import './ListarSalonesPorProfesor.css'
import { useAuth } from '../../AuthContext';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const ListarSalonesPorProfesor = () => {

  const { token } = useAuth();
  const storedToken = localStorage.getItem('token');
  const { id } = useParams();

  const urlSalonesPorProfesor = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/teacher-classrooms/${id}`;

  const [salones, setSalones] = useState([])

  useEffect(() => {
    cargarSalonesPorProfesor();
  }, []);

  const cargarSalonesPorProfesor = async () => {
    const resultado = await axios.get(urlSalonesPorProfesor, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSalones(resultado.data);
  }

  return (
    <div className="listado__profesores">

      <section className='barra__profesores'>
        <Link to="/profesores" className='btn__regresar'>
          Regresar
        </Link>
      </section>

      <h3>Profesor: {}</h3>

      <table className="profesores__table">
        <thead className="profesores__thead">
          <tr className='profesor__table-row'>
            <th scope="col">N°</th>
            <th scope="col">Año</th>
            <th scope="col">Sección</th>
          </tr>
        </thead>
        {Array.isArray(salones) && salones.length > 0 ? (
          <tbody className="profesores__tbody">
            {salones.map((salon, indice) => (
              <tr key={indice} className='profesor__table-row'>
                <th scope='row'>{indice + 1}</th>
                <td>{salon.level.levelName}</td>
                <td>{salon.section.sectionName}</td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="8">El profesor no tiene salones aún.</td>
            </tr>
          </tbody>
        )}
      </table>


    </div>
  )
}

export default ListarSalonesPorProfesor