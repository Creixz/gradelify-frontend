import './Navbar.css'
import { FaBook } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { IoSchool } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { IoLogOutOutline } from "react-icons/io5";

const Navbar = () => {

  const { nombreCompleto, subject, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="navabar__logo">
        <FaBook style={{ fontSize: '1.5rem', color: '#F4633A' }}/>
        <span>Gradelify</span>
      </div>
      <div className="navbar__icons">
        <div className="navbar__subject">
          <IoSchool style={{ width: '24px'}}/>
          <span>{subject}</span>
        </div>
        <div className="navbar__school">
          <span>Colegio-X</span>
        </div>
        <NavLink className="navbar__user">
          <FaCircleUser />
          <span>Prof. {nombreCompleto}</span>
        </NavLink>
        <NavLink className="navbar__logout" to="/login" onClick={logout}>
          <span>Salir</span>
          <IoLogOutOutline />
        </NavLink>
      </div>
    </div>
  )
}

export default Navbar