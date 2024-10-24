import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../AuthContext';
import './ListarSalones.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlusSquare } from "react-icons/fa";
import { BiSolidUserDetail } from "react-icons/bi";

const ListarSalones = () => {
  const { token, role } = useAuth();
  const storedToken = localStorage.getItem('token');
  const filtroSalonRef = useRef(null);

  const urlSalon = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classrooms`;

  const [salones, setSalones] = useState([]);
  const [filteredSalones, setFilteredSalones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const itemsPerPage = 13;

  useEffect(() => {
    cargarSalones();
  }, []);

  const cargarSalones = async () => {
    const resultado = await axios.get(urlSalon, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    // Filtrar salones que no tienen section.idSection igual a 4
    const salonesFiltrados = resultado.data.filter(salon => salon.section.idSection !== 4);

    // Ordenar los salones por nivel y luego por sección en orden ascendente
    salonesFiltrados.sort((a, b) => {
      if (a.level.levelName < b.level.levelName) return -1;
      if (a.level.levelName > b.level.levelName) return 1;
      if (a.section.sectionName < b.section.sectionName) return -1;
      if (a.section.sectionName > b.section.sectionName) return 1;
      return 0;
    });

    setSalones(salonesFiltrados);
    setFilteredSalones(salonesFiltrados);
    setTotalPaginas(Math.ceil(salonesFiltrados.length / itemsPerPage));
  };

  const toggleEstado = async (idClassroom) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/gradelify/v1/classrooms/${idClassroom}/toggle-state`;
    await axios.put(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    cargarSalones();
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const salonesFiltrados = salones.filter((salon) =>
      salon.level.levelName.toLowerCase().includes(searchTerm)
    );
    setFilteredSalones(salonesFiltrados);
    setTotalPaginas(Math.ceil(salonesFiltrados.length / itemsPerPage));
    setPaginaActual(0);
  };

  const cambiarPagina = (pagina) => {
    setPaginaActual(pagina);
  };

  const salonesPaginados = filteredSalones.slice(paginaActual * itemsPerPage, (paginaActual + 1) * itemsPerPage);

  return (
    <div className="listado__salones">
      {role === 'ADMINISTRADOR' ? (
        <section className='barra__profesores'>
          <Link to="/agregar-salon" className='btn__agregar'>
            <FaPlusSquare style={{ width: '24px' }} /> Agregar Salón
          </Link>
          <input
            type="text"
            className="input__busqueda"
            placeholder="Buscar por nivel"
            value={searchTerm}
            onChange={handleSearchChange}
            ref={filtroSalonRef}
          />
        </section>
      ) : null}

      <table className="profesores__table">
        <thead className="profesores__thead">
          <tr className='profesor__table-row'>
            <th scope="col">N°</th>
            <th scope="col">Año</th>
            <th scope="col">Sección</th>
            <th scope="col">Estado</th>
            <th scope="col">Profesores</th>
            <th scope="col">Estudiantes</th>
          </tr>
        </thead>
        <tbody className="profesores__tbody">
          {salonesPaginados.map((salon, indice) => (
            <tr key={salon.idClassroom} className='profesor__table-row'>
              <th scope='row'>{paginaActual * itemsPerPage + indice + 1}</th>
              <td>{salon.level.levelName}</td>
              <td>{salon.section.sectionName}</td>
              <td>
                <button className={salon.estado === 1 ? 'activo' : 'inactivo'} onClick={() => toggleEstado(salon.idClassroom)}>
                  {salon.estado === 1 ? 'Activo' : 'Inactivo'}
                </button>
              </td>
              <td>
                <Link to={`/salon/profesores/${salon.idClassroom}`} className='btn__listar'>
                  <BiSolidUserDetail className='icono__listar' style={{ width: '24px' }} /> Lista
                </Link>
              </td>
              <td>
                <Link to={`/salon/alumnos/${salon.idClassroom}`} className='btn__listar'>
                  <BiSolidUserDetail className='icono__listar' style={{ width: '24px' }} /> Lista
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="paginacion">
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 0}
        >
          Anterior
        </button>
        <span>{paginaActual + 1} de {totalPaginas}</span>
        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas - 1}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default ListarSalones;
