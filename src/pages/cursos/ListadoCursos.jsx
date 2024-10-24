import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import './ListadoCursos.css'
import { Link } from 'react-router-dom';
import { IoPersonAddSharp } from 'react-icons/io5';
import axios from 'axios';

const ListadoCursos = () => {

  const { token, role } = useAuth();

  const urlCurso = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/cursos`;

  const [cursos, setCursos] = useState([])

  useEffect(() => {
    cargarCursos();
  }, [])

  const cargarCursos = async () => {
    const resultado = await axios.get(urlCurso, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCursos(resultado.data)
    console.log(resultado.data)
  }

  return (
    <div className="listado__cursos">

      {role === 'ADMINISTRADOR' ?
        <section className='barra__profesores'>
            <Link to="/agregar-curso" className='btn__agregar'>
             <IoPersonAddSharp style={{ width: '24px'}}/> Agregar Curso
            </Link>
        </section>
        : null}

      <table className="profesores__table">
        <thead className="profesores__thead">
          <tr className='profesor__table-row'>
            <th scope="col">N°</th>
            <th scope="col">Curso</th>
          </tr>
        </thead>
        <tbody className="profesores__tbody">
          {
            cursos.map((curso, indice) => (
              <tr key={indice} className='profesor__table-row'>
                <th scope='row'>{indice + 1}</th>
                <td>{curso.subjectName}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default ListadoCursos