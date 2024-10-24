import './GraficosPorSalon.css';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

const GraficosPorSalon = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { distributionPA1, distributionPA2, distributionPA3, distributionPC, distributionRC, classroomName, bimestre } = state;

  const createDoughnutData = (distribution) => ({
    labels: ['A+', 'A', 'B+', 'B', 'C'],
    datasets: [
      {
        label: 'Distribución',
        data: [distribution.A_plus, distribution.A, distribution.B_plus, distribution.B, distribution.C],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
          },
        },
      },
      datalabels: {
        color: 'white',
        formatter: (value, context) => value > 0 ? context.chart.data.labels[context.dataIndex] : '',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  };

  return (
    <div className="listado__profesores">
      <section className="barra__profesores">
        <button onClick={() => navigate(-1)} className="btn__regresar">Regresar</button>
        
      </section>
      <h2 className='nombre__salon'>Salon: <span>{classroomName}</span></h2>
      <h2 className='nombre__salon'>Bimestre: <span>{bimestre}</span></h2>
      <div className="graficos-distribucion">
        <div className="grafico">
          <h3>Distribución de Participación Activa 1</h3>
          <Doughnut data={createDoughnutData(distributionPA1)} options={chartOptions} />
        </div>
        <div className="grafico">
          <h3>Distribución de Participación Activa 2</h3>
          <Doughnut data={createDoughnutData(distributionPA2)} options={chartOptions} />
        </div>
        <div className="grafico">
          <h3>Distribución de Participación Activa 3</h3>
          <Doughnut data={createDoughnutData(distributionPA3)} options={chartOptions} />
        </div>
        <div className="grafico">
          <h3>Distribución de Práctica Calificada</h3>
          <Doughnut data={createDoughnutData(distributionPC)} options={chartOptions} />
        </div>
        <div className="grafico">
          <h3>Distribución de Revisión de Cuaderno</h3>
          <Doughnut data={createDoughnutData(distributionRC)} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default GraficosPorSalon;
