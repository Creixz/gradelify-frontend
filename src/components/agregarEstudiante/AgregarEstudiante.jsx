import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import axios from 'axios';
import Modal from 'react-modal';
import './AgregarEstudiante.css';
import qrCodeImage from '../../assets/qrCodeImage.png'; // Ruta a la imagen del código QR

Modal.setAppElement('#root'); // Asegúrate de que esto apunta al elemento principal de tu aplicación

const AgregarEstudiante = () => {
  const { token } = useAuth();
  let navegacion = useNavigate();
  const urlEstudiante = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/students`;
  const urlClassrooms = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classrooms/section/4`;

  const [estudiante, setEstudiante] = useState({
    codigoEstudiante: '',
    nombres: '',
    apellidos: '',
    idClassroom: ''
  });

  const [classrooms, setClassrooms] = useState([]);
  const [errors, setErrors] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    cargarClassrooms();
  }, []);

  const cargarClassrooms = async () => {
    const resultado = await axios.get(urlClassrooms, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setClassrooms(resultado.data);
  };

  const validarDni = () => {
    let errorMessages = { ...errors };

    if (!/^\d{8}$/.test(estudiante.codigoEstudiante)) {
      errorMessages.codigoEstudiante = 'El DNI debe tener exactamente 8 dígitos numéricos.';
    } else {
      delete errorMessages.codigoEstudiante;
    }

    setErrors(errorMessages);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;

    let errorMessages = { ...errors };

    if (name === 'nombres' || name === 'apellidos') {
      if (/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/.test(value)) {
        errorMessages[name] = 'No puede contener números o símbolos.';
      } else {
        delete errorMessages[name];
      }
    }

    setErrors(errorMessages);
    setEstudiante({ ...estudiante, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    validarDni(); // Validación del DNI
    if (Object.keys(errors).length === 0 && estudiante.codigoEstudiante !== '' && estudiante.nombres !== '' && estudiante.apellidos !== '' && estudiante.idClassroom !== '' && paymentConfirmed) {
      try {
        await axios.post(urlEstudiante, estudiante, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navegacion('/estudiantes');
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Por favor, corrija los errores en el formulario y confirme el pago.");
    }
  };

  const openModal = () => {
    if (!errors.codigoEstudiante) {
      setModalIsOpen(true);
    } else {
      alert("Por favor, valide el DNI antes de realizar el pago.");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const confirmPayment = () => {
    setPaymentConfirmed(true);
    closeModal();
  };

  return (
    <div className='container__agregar-profesor'>
      <h3 className='titulo__agregar-profesor'>Matricular Estudiante</h3>
      <form onSubmit={onSubmit}>
        <div className="division">
          <div className="division__1">
            <div className="label__input">
              <label htmlFor="codigo" className="form-label">Código</label>
              <div className="input-group">
                <input type="text" className="form__control" id="codigo" name='codigoEstudiante' required value={estudiante.codigoEstudiante} onChange={onInputChange} />
                <button type="button" className="btn__validar" onClick={validarDni}>Validar DNI</button>
              </div>
              {errors.codigoEstudiante && <span className="error">{errors.codigoEstudiante}</span>}
            </div>
            <div className="label__input">
              <label htmlFor="nombres" className="form-label">Nombres</label>
              <input type="text" className="form__control" id="nombres" name='nombres' required value={estudiante.nombres} onChange={onInputChange} />
              {errors.nombres && <span className="error">{errors.nombres}</span>}
            </div>
            <div className="label__input">
              <label htmlFor="apellidos" className="form-label">Apellidos</label>
              <input type="text" className="form__control" id="apellidos" name='apellidos' required value={estudiante.apellidos} onChange={onInputChange} />
              {errors.apellidos && <span className="error">{errors.apellidos}</span>}
            </div>
            <div className="label__input">
              <label htmlFor="idClassroom" className="form-label">Grado</label>
              <select className="form__control" id="idClassroom" name='idClassroom' required value={estudiante.idClassroom} onChange={onInputChange}>
                <option value="">Seleccione un grado</option>
                {classrooms.map(classroom => (
                  <option key={classroom.idClassroom} value={classroom.idClassroom}>
                    {classroom.level.levelName} - {classroom.section.sectionName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className='botones__agregar-profesor'>
          <button type="button" className="btn__agregar" onClick={openModal}>Realizar Pago</button>
          <button type="submit" className="btn__agregar">Agregar</button>
          <Link to='/estudiantes' className='btn__regresar'>Regresar</Link>
        </div>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmar Pago"
        className="modal"
        overlayClassName="overlay"
      >
        <div className='contenedor-modal'>
          <h2>Escanea el código QR con Plin para realizar el pago</h2>
          <h2 className='monto-qr'>Monto Matrícula: S/. 560</h2>
          <img src={qrCodeImage} alt="Código QR de Plin" />
          <div className='contenedor-botones'>
            <button className="btn__confirmar" onClick={confirmPayment}>Se realizó el pago</button>
            <button className="btn__cerrar" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AgregarEstudiante;
