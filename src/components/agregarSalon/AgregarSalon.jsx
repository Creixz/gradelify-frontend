import { useEffect, useState } from 'react';
import './AgregarSalon.css'
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AgregarSalon = () => {

  const { token } = useAuth();

  let navegacion = useNavigate();

  const urlGrado = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/grados`;
  const urlSeccion = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/secciones`;

  const [grados, setGrados] = useState([])
  const [secciones, setSecciones] = useState([])
  const [salon, setSalon] = useState({})

  useEffect(() => {
    cargarGrados();
    cargarSecciones();
  }, []);

  const cargarGrados = async () => {
    const resultado = await axios.get(urlGrado, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setGrados(resultado.data);
  }

  const cargarSecciones = async () => {
    const resultado = await axios.get(urlSeccion, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSecciones(resultado.data);
  }

  const onInputChange = (e) => {
    //spread operator ... (expandir los atributos del tipo empleado)
    setSalon({ ...salon, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const urlAgregarSalon = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classrooms`;
    await axios.post(urlAgregarSalon, salon, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navegacion('/salones')
  }


  return (
    <div className="container__agregar-salon">
      <h3 className="titulo__agregar-salon">Agregar Salón</h3>
        <form onSubmit={(e) => onSubmit(e)}>

          <div className="form-group label__input">
            <label className='form-label' htmlFor="grado"><b>Grado</b></label>
            <select
              className="form__control"
              name="idLevel"
              value={salon.idLevel}
              onChange={(e) => onInputChange(e)}
              required
            >
              <option className='' value="">Escoja un grado</option>
              {grados.map((grado) => (
                <option key={grado.idLevel} value={grado.idLevel}>
                  {grado.levelName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group label__input">
            <label className='form-label' htmlFor="seccion"><b>Sección</b></label>
            <select
              className="form__control"
              name="idSection"
              value={salon.idSection}
              onChange={(e) => onInputChange(e)}
              required
            >
              <option className='' value="">Escoja una sección</option>
              {secciones.map((seccion) => (
                <option key={seccion.idSection} value={seccion.idSection}>
                  {seccion.sectionName}
                </option>
              ))}
            </select>
          </div>

          <div className='botones__agregar-profesor'>
            <button type="submit" className="btn__agregar">Agregar</button>
            <Link to='/salones' className='btn__regresar'>Regresar</Link>
          </div>

        </form>
      
    </div>
  )
}

export default AgregarSalon