import '../styles/App.css'
import Menu from './components/menu/Menu'
import Navbar from './components/navbar/Navbar'
import { createBrowserRouter, RouterProvider, Outlet, useNavigate } from "react-router-dom";
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Profesores from './pages/profesores/Profesores';
import { AuthProvider, useAuth } from './AuthContext';
import AgregarProfesor from './components/profesores/agregarProfesor/AgregarProfesor';
import ListadoCursos from './pages/cursos/ListadoCursos';
import { useEffect } from 'react';
import Footer from './components/footer/Footer';
import ListarSalones from './pages/salones/ListarSalones';
import AgregarSalon from './components/agregarSalon/AgregarSalon';
import ListarProfesoresPorSalon from './components/listarProfesoresPorSalon/ListarProfesoresPorSalon';
import ListarEstudiantes from './pages/estudiantes/ListarEstudiantes';
import AgregarEstudiante from './components/agregarEstudiante/AgregarEstudiante';
import ListarAlumnosPorSalonBimestre from './components/listarAlumnosPorSalonBimestre/ListarAlumnosPorSalonBimestre';
import EditarProfesor from './components/EditarProfesor/EditarProfesor';
import PerfilProfesor from './components/perfilProfesor/PerfilProfesor';
import ListarSalonesPorProfesor from './components/listarSalonesPorProfesor/ListarSalonesPorProfesor';
import EditarEstudiante from './components/editarEstudiante/EditarEstudiante';
import NotasEstudiantesCursos from './components/notasEstudiantesCursos/NotasEstudiantesCursos';
import SalonesDeProfesor from './components/salonesDeProfesor/SalonesDeProfesor';
import ListarAlumnosPorProfesorSalonBimestre from './components/listarAlumnosPorProfesorSalonBimestre/ListarAlumnosPorProfesorSalonBimestre';
import GraficosPorSalon from './components/graficosPorSalon/GraficosPorSalon';
import RegistroAsistenciaPorSalon from './components/registroAsistenciaPorSalon/RegistroAsistenciaPorSalon';
import HomeProfesor from './pages/home/HomeProfesor';

function App() {

  

  const Layout = () => {

    const storedToken = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
      if (!storedToken) {
        navigate('/login');
      }
    }, [storedToken]);

    return (
      <main className="main">
        <Navbar />
        <div className="container">
          <div className="container__menu">
            <Menu />
          </div>
          <div className="container__content">
            <Outlet />
          </div>
        </div>
        <Footer />
      </main>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profesor",
          element: <HomeProfesor />,
        },
        {
          path: "/profesores",
          element: <Profesores />,
        },
        {
          path: "/profesores/:id",
          element: <EditarProfesor />,
        },
        {
          path: "/agregar-profesor",
          element: <AgregarProfesor />,
        },
        {
          path: "/profesor/salones/:id",
          element: <ListarSalonesPorProfesor />
        },
        {
          path: "/cursos",
          element: <ListadoCursos />
        },
        {
          path: "/salones",
          element: <ListarSalones />
        },
        {
          path: "/agregar-salon",
          element: <AgregarSalon />
        },
        {
          path: "/salon/profesores/:id",
          element: <ListarProfesoresPorSalon />
        },
        {
          path: "/estudiantes",
          element: <ListarEstudiantes />
        },
        {
          path: "/agregar-estudiante",
          element: <AgregarEstudiante />
        },
        {
          path: "/estudiantes/:id",
          element: <EditarEstudiante />,
        },
        {
          path: "/notas-estudiantes/:idEstudiante/salon/:idSalon/bimestre/:bimestre",
          element: <NotasEstudiantesCursos />,
        },
        {
          path: "/registro-asistencia/:idSalon/:bimestre/:idCurso",
          element: <RegistroAsistenciaPorSalon />,
        },
        {
          path: "/salon/alumnos/:salonId",
          element: <ListarAlumnosPorSalonBimestre />
        },
        {
          path: "/perfil",
          element: <PerfilProfesor />
        },
        {
          path: "/salones-de-profesor",
          element: <SalonesDeProfesor />
        },
        {
          path: "/salon/:idSalon/estudiantes",
          element: <ListarAlumnosPorProfesorSalonBimestre />
        },
        {
          path: "/graficos-por-salon",
          element: <GraficosPorSalon />
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (

    <AuthProvider >
      <RouterProvider router={router} />
    </AuthProvider>

  )
}

export default App
