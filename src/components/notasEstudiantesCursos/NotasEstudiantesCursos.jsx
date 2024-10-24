import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { Bar } from 'react-chartjs-2';
import './NotasEstudiantesCursos.css';

Modal.setAppElement('#root'); // Asegúrate de que esto apunta al elemento principal de tu aplicación

const NotasEstudiantesCursos = () => {
  const { idEstudiante, idSalon, bimestre } = useParams();
  const [notas, setNotas] = useState([]);
  const [alumno, setAlumno] = useState({});
  const [salon, setSalon] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar notas
        const responseNotas = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/notas-estudiante/${idEstudiante}/salon/${idSalon}/bimestre/${bimestre}`);
        setNotas(responseNotas.data);

        // Cargar detalles del alumno
        const responseAlumno = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/students/${idEstudiante}`);
        setAlumno(responseAlumno.data);

        // Cargar detalles del salón
        const responseSalon = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classrooms/${idSalon}`);
        setSalon(responseSalon.data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    cargarDatos();
  }, [idEstudiante, idSalon, bimestre]);

  const calcularPromedios = () => {
    return notas.map(nota => {
      const promedio = (parseFloat(nota.pa1 || 0) + parseFloat(nota.pa2 || 0) + parseFloat(nota.pa3 || 0) + parseFloat(nota.pc || 0) + parseFloat(nota.rc || 0)) / 5;
      return { curso: nota.curso, promedio };
    });
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const promedios = calcularPromedios();

  return (
    <div className="listado__salones">
      <div className="barra__profesores">
        <button className="btn__regresar" onClick={() => navigate('/estudiantes')}>Regresar</button>
        <button className="btn__ver-promedio" onClick={handleShowModal}>Ver Promedio</button>
      </div>

      <div className="detalles-estudiante">
        <p><strong>Alumno:</strong> {alumno.nombres} {alumno.apellidos}</p>
        <p><strong>Salón:</strong> {salon.level?.levelName} - {salon.section?.sectionName}</p>
        <p><strong>Bimestre:</strong> {bimestre}</p>
      </div>

      <table className="profesores__table">
        <thead className="profesores__thead">
          <tr className='profesor__table-row'>
            <th scope="col">N°</th>
            <th scope="col">Curso</th>
            <th scope="col">PA1</th>
            <th scope="col">PA2</th>
            <th scope="col">PA3</th>
            <th scope="col">PC</th>
            <th scope="col">RC</th>
          </tr>
        </thead>
        <tbody className="profesores__tbody">
          {notas.map((nota, index) => (
            <tr key={index} className='profesor__table-row'>
              <td>{index + 1}</td>
              <td>{nota.curso}</td>
              <td>{nota.pa1 || '-'}</td>
              <td>{nota.pa2 || '-'}</td>
              <td>{nota.pa3 || '-'}</td>
              <td>{nota.pc || '-'}</td>
              <td>{nota.rc || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        contentLabel="Promedio de Notas"
        className="modal-content bar-chart-modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2 className="modal-title">Promedio de Notas por Curso</h2>
          <button className="modal-close" onClick={handleCloseModal}>&times;</button>
        </div>
        <div className="modal-body">
          <Bar
            data={{
              labels: promedios.map(p => p.curso),
              datasets: [
                {
                  label: 'Promedio',
                  data: promedios.map(p => p.promedio),
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
      </Modal>
    </div>
  );
};

export default NotasEstudiantesCursos;
