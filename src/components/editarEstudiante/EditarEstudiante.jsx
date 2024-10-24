import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../AuthContext'
import './EditarEstudiante.css'
import { useEffect, useState } from 'react';
import axios from 'axios';

const EditarEstudiante = () => {

  const { token } = useAuth();
  let navegacion = useNavigate();
  const { id } = useParams();

  const urlEstudiante = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/students/${id}`;

  const [estudiante, setEstudiante] = useState({
    codigoEstudiante: '',
    nombres: '',
    apellidos: ''
  });

  const { codigoEstudiante, nombres, apellidos } = estudiante;

  useEffect(() => {
    cargarEstudiante();
  }, []);

  const cargarEstudiante = async () => {
    const resultado = await axios.get(urlEstudiante, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setEstudiante({
      codigoEstudiante: resultado.data.codigoEstudiante,
      nombres: resultado.data.nombres,
      apellidos: resultado.data.apellidos
    });
  }

  const onInputChange = (e) => {
    setEstudiante({ ...estudiante, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault(); // evita que los parametros se envien en la URL

    await axios.put(urlEstudiante, estudiante, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navegacion('/estudiantes');
  }

  return (
    <div className='container__agregar-profesor'>

      <h3 className='titulo__agregar-profesor'>Agregar Estudiante</h3>

      <form onSubmit={(e) => onSubmit(e)}>

        <div className="division">
          <div className="division__1">
            <div className="label__input">
              <label htmlFor="codigo" className="form-label">Código</label>
              <input type="text" className="form__control" id="codigo" name='codigoEstudiante' required={true} value={codigoEstudiante} onChange={(e) => onInputChange(e)} />
            </div>

            <div className="label__input">
              <label htmlFor="nombres" className="form-label">Nombres</label>
              <input type="text" className="form__control" id="nombres" name='nombres' required={true} value={nombres} onChange={(e) => onInputChange(e)} />
            </div>

            <div className="label__input">
              <label htmlFor="apellidos" className="form-label">Apellidos</label>
              <input type="text" className="form__control" id="apellidos" name='apellidos' required={true} value={apellidos} onChange={(e) => onInputChange(e)} />
            </div>
          </div>
        </div>

        <div className='botones__agregar-profesor'>
          <button type="submit" className="btn__agregar">Agregar</button>
          <Link to='/estudiantes' className='btn__regresar'>Regresar</Link>
        </div>
      </form>
    </div>
  )
}

export default EditarEstudiante