import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomeProfesor.css';
import { useAuth } from '../../AuthContext';

const HomeProfesor = () => {
  const { token, teacherId } = useAuth();
  const storedToken = localStorage.getItem('token');

  const [totalSalones, setTotalSalones] = useState(0);

  useEffect(() => {
    const fetchTotalSalones = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/teacher-classrooms/${teacherId}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        setTotalSalones(response.data.length);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchTotalSalones();
  }, [storedToken, teacherId]);

  return (
    <div className="home-profesor-container">
      <div className="card card1">
        <h3>Total de Salones</h3>
        <p>{totalSalones}</p>
      </div>
    </div>
  );
};

export default HomeProfesor;
