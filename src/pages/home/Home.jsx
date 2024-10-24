import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import { useAuth } from '../../AuthContext';

const Home = () => {
  const { token } = useAuth();
  const storedToken = localStorage.getItem('token');

  const [totales, setTotales] = useState({
    salones: 0,
    alumnos: 0,
    cursos: 0,
    profesores: 0,
  });

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const [classrooms, profesores, cursos, students] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classrooms`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/profesores`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/cursos`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classroom-allStudents-details?page=0&size=1000`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }),
        ]);

        setTotales({
          salones: classrooms.data.length,
          alumnos: students.data.content.length,
          cursos: cursos.data.length,
          profesores: profesores.data.length,
        });
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchTotals();
  }, [storedToken]);

  return (
    <div className="home-container">
      <div className="card card1">
        <h3>Total de Salones</h3>
        <p>{totales.salones}</p>
      </div>
      <div className="card card2">
        <h3>Total de Alumnos</h3>
        <p>{totales.alumnos}</p>
      </div>
      <div className="card card3">
        <h3>Total de Cursos</h3>
        <p>{totales.cursos}</p>
      </div>
      <div className="card card4">
        <h3>Total de Profesores</h3>
        <p>{totales.profesores}</p>
      </div>
    </div>
  );
};

export default Home;
