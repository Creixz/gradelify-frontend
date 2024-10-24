import { NavLink } from 'react-router-dom'
import './Menu.css'
import { FaSchoolFlag } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { PiNotebookFill } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { BsFillPenFill } from "react-icons/bs";
import { ImProfile } from "react-icons/im";
import { useAuth } from '../../AuthContext';

const Menu = () => {

  const { role } = useAuth();

  return (
    <div>
      {role === 'ADMINISTRADOR' &&
        <div>
          <h3 className='rol_board'>ADMINISTRADOR</h3>
          <div className="menu__list">
            <NavLink to="/" className="list__item" activeclassname="active">
              <FaSchoolFlag style={{ width: '20px' }} />
              <span className="item__title">Home</span>
            </NavLink>
            <NavLink to="/profesores" className="list__item" activeclassname="active">
              <FaChalkboardTeacher style={{ width: '20px' }} />
              <span className="item__title">Personal</span>
            </NavLink>
            <NavLink to="/estudiantes" className="list__item" activeclassname="active">
              <PiStudentFill style={{ width: '20px' }} />
              <span className="item__title">Estudiantes</span>
            </NavLink>
            <NavLink to="/cursos" className="list__item" activeclassname="active">
              <PiNotebookFill style={{ width: '20px' }} />
              <span className="item__title">Cursos</span>
            </NavLink>
            <NavLink to="/salones" className="list__item" activeclassname="active">
              <SiGoogleclassroom style={{ width: '20px' }} />
              <span className="item__title">Salones</span>
            </NavLink>
            {/* <NavLink to="/notas" className="list__item" activeclassname="active">
              <BsFillPenFill style={{ width: '20px' }} />
              <span className="item__title">Notas</span>
            </NavLink> */}
          </div>
        </div>
      }

      <h3 className='rol_board'>PROFESOR</h3>
      <div className="menu__list">
        <NavLink to="/profesor" className="list__item" activeclassname="active">
          <FaSchoolFlag style={{ width: '20px' }} />
          <span className="item__title">Home</span>
        </NavLink>
        <NavLink to="/perfil" className="list__item" activeclassname="active">
          <ImProfile style={{ width: '20px' }} />
          <span className="item__title">Perfil</span>
        </NavLink>
        <NavLink to="/salones-de-profesor" className="list__item" activeclassname="active">
          <SiGoogleclassroom style={{ width: '20px' }} />
          <span className="item__title">Salones</span>
        </NavLink>
        {/* <NavLink to="/alumnos" className="list__item" activeclassname="active">
          <PiStudentFill style={{ width: '20px' }} />
          <span className="item__title">Alumnos</span>
        </NavLink> */}
      </div>

    </div>

  )
}

export default Menu