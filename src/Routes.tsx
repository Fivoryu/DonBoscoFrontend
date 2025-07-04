import { RouteObject } from "react-router-dom";

import Home from "./app/usuarios/Home";
import Login from "./app/usuarios/Login";
import Register from "./app/usuarios/Register";

import SuperAdminLayout from "./app/dashboard/SuperAdmin/Layout";
import SuperAdminInicio from "./app/dashboard/SuperAdmin/Inicio";
import SuperAdminColegios from "./app/dashboard/SuperAdmin/Configuracion Institucional/Colegios";
import SuperAdminUnidades from "./app/dashboard/SuperAdmin/Configuracion Institucional/Unidades";
import SuperAdminUsuarios from "./app/dashboard/SuperAdmin/Gestion Usuarios/Usuarios/Usuarios";
import SuperAdminInfraestructura from "./app/dashboard/SuperAdmin/Infraestructura";

import SuperAdminGrados from "./app/dashboard/SuperAdmin/Gestion Academica/Grado";
import SuperAdminRoles from "./app/dashboard/SuperAdmin/Gestion Usuarios/Rol/Roles";
import RequireAuth from "./app/routes/RequireAuth";
import SuperAdminAulas from "./app/dashboard/SuperAdmin/Gestion Academica/Aulas";
import SuperAdminModulos from "./app/dashboard/SuperAdmin/Gestion Academica/Modulos";
import SuperAdminCursos from "./app/dashboard/SuperAdmin/Gestion Academica/Cursos";
import SuperAdminParalelos from "./app/dashboard/SuperAdmin/Gestion Academica/Paralelos";
import SuperAdminTipoHorario from "./app/dashboard/SuperAdmin/Planificacion Academica/TipoHorario";
import SuperAdminHorario from "./app/dashboard/SuperAdmin/Planificacion Academica/Horario";
import SuperAdminMateria from "./app/dashboard/SuperAdmin/Gestion Academica/Materia";
import SuperAdminMateriaCurso from "./app/dashboard/SuperAdmin/Gestion Academica/MateriaCurso";
import SuperAdminProfesor from "./app/dashboard/SuperAdmin/Gestion Academica/Profesor";
import SuperAdminEspecialidad from "./app/dashboard/SuperAdmin/Gestion Academica/Especialidades";
import BitacoraUsuarioPage from "./app/dashboard/SuperAdmin/Gestion Usuarios/BitacoraUsuarioPage";
import { SuperAdminAdmins } from "./app/dashboard/SuperAdmin/Gestion Usuarios/Admins";
import SuperAdminPuestos from "./app/dashboard/SuperAdmin/Gestion Usuarios/Puestos";
import AdminLayout from "./app/dashboard/Admin/Layout";
import AdminInicio from "./app/dashboard/Admin/Inicio";
import AdminModulos from "./app/dashboard/Admin/Gestion Academica/Modulo";

import TutorLayout from "./app/dashboard/Tutor/Layout";
import TutorInicio from "./app/dashboard/Tutor/Inicio";
import MisEstudiantes from "./app/dashboard/Tutor/MisEstudiantes";
import BoletinDetalle from "./app/dashboard/Tutor/Boletin/BoletinDetalle";


//import SuperAdminCargaHoraria from "./app/dashboard/SuperAdmin/Planificacion Academica/CargaHoraria";
import SuperAdminClase from "./app/dashboard/SuperAdmin/Planificacion Academica/clases";
import SuperAdminCalendarioAcademico
  from "./app/dashboard/SuperAdmin/Calendario Academico/CaledarioAcademico";

import SuperAdminTutor from "./app/dashboard/SuperAdmin/Gestion Estudiantil/Tutores/TutoresPage";
import SuperAdminEstudiantes from "./app/dashboard/SuperAdmin/Gestion Estudiantil/Estudiantes/EstudiantesPage";

import GenerarLicencia from "./app/dashboard/Tutor/GenerarLicencia.tsx";

import SuperAdminLicencia from "./app/dashboard/SuperAdmin/Gestion Estudiantil/Licencia/page.tsx";
import GestionarBoletinPage from "./app/dashboard/SuperAdmin/Evaluacion Academica/Gestionar Boletin/page.tsx";
import SuperAdminCargaHoraria from "./app/dashboard/SuperAdmin/Planificacion Academica/CargaHoraria";
import SuperadminClaseHorario from "./app/dashboard/SuperAdmin/Calendario Academico/ClaseHorario.tsx";
import AttendanceWizardLayout from "./app/dashboard/SuperAdmin/Gestion Estudiantil/Asistencia/pages/AsistenciaWizard/AttendanceWizardLayout.tsx";
import AttendanceWizardPage from "./app/dashboard/SuperAdmin/Gestion Estudiantil/Asistencia/pages/AsistenciaWizard/index.tsx";
import CreateAttendance from "./app/dashboard/SuperAdmin/Gestion Estudiantil/Asistencia/actions/CreateAttendance.tsx";
import AttendanceList from "./app/dashboard/SuperAdmin/Gestion Estudiantil/Asistencia/actions/AttendanceList.tsx";
import AttendanceStats from "./app/dashboard/SuperAdmin/Gestion Estudiantil/Asistencia/actions/AttendanceStats.tsx";
import CrearActividad from "./app/dashboard/Admin/Evaluacion/DimensionEvaluacion.tsx";
import NotaActividadPage from "./app/dashboard/Admin/Evaluacion/NotaActividadPage.tsx";
import NotaFinalPage from "./app/dashboard/Admin/Evaluacion/NotaFinalPage.tsx";
import ProfesorInicio from "./app/dashboard/Profesor/Inicio.tsx";
import ProfesorLayout from "./app/dashboard/Profesor/Layout.tsx";
import TutorLicenciasPage from "./app/dashboard/Tutor/Estudiantes/Licencias/pages/LicenciasPage.tsx";





export const Routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard/superadmin",
    element: (
      <RequireAuth allowedRoles={["superadmin"]}>
        <SuperAdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <SuperAdminInicio /> },
      { path: "colegios", element: <SuperAdminColegios /> },
      { path: "unidades", element: <SuperAdminUnidades /> },
      { path: "usuarios", element: <SuperAdminUsuarios /> },
      { path: "admin", element: <SuperAdminAdmins /> },
      { path: "permisos", element: <SuperAdminPuestos /> },
      { path: "infraestructura", element: <SuperAdminInfraestructura /> },
      { path: "profesor", element: <SuperAdminProfesor /> },
      { path: "grados", element: <SuperAdminGrados /> },
      { path: "modulos", element: <SuperAdminModulos /> },
      { path: "aulas", element: <SuperAdminAulas /> },
      { path: "cursos", element: <SuperAdminCursos /> },
      { path: "paralelos", element: <SuperAdminParalelos /> },
      { path: "roles", element: <SuperAdminRoles /> },
      { path: "tipo-horario", element: <SuperAdminTipoHorario />},
    
      { path: "horario", element: <SuperAdminHorario />},
      { path: "materia", element: <SuperAdminMateria />},
      { path: "materia-curso", element: <SuperAdminMateriaCurso />},
      { path: "especialidad", element: <SuperAdminEspecialidad />},
      { path: "bitacora/:usuarioId/usuario/", element: <BitacoraUsuarioPage/>},
      { path: "clase-horario", element: <SuperadminClaseHorario /> },

      { path:"clases", element: <SuperAdminClase/>},

      { path:"asistencia", element: <AttendanceWizardLayout />,
        children: [
          { index: true, element: <AttendanceWizardPage /> },
          { path: "actions/create", element: <CreateAttendance /> },
          { path: "actions/list", element: <AttendanceList /> },
          { path: "actions/stats", element: <AttendanceStats /> },
        ]
      },
      
 
      { path: "tipo-horario", element: <SuperAdminTipoHorario /> },

      { path: "horario", element: <SuperAdminHorario /> },
      { path: "materia", element: <SuperAdminMateria /> },
      { path: "materia-curso", element: <SuperAdminMateriaCurso /> },
      { path: "especialidad", element: <SuperAdminEspecialidad /> },
      { path: "bitacora/:usuarioId/usuario/", element: <BitacoraUsuarioPage /> },
      { path: "alumnos", element: <SuperAdminEstudiantes /> },
      { path: "tutores", element: <SuperAdminTutor /> },
      { path: "clases", element: <SuperAdminClase /> },
      { path: "calendario-academico", element: <SuperAdminCalendarioAcademico /> },
      { path: "carga-horaria", element: <SuperAdminCargaHoraria /> },
      { path: "licencia", element: <SuperAdminLicencia /> },
      { path: "nota-final", element: <GestionarBoletinPage /> },
    ],
  }, {
    path: "/dashboard/admin/",
    element: (
      <RequireAuth allowedRoles={["admin"]}>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <AdminInicio /> },
      { path: "modulos", element: <AdminModulos /> },
      // ✅ Agrupadas bajo /evaluacion/
      { path: "dimension-evaluacion", element: <CrearActividad /> },
      { path: "nota-actividad", element: <NotaActividadPage /> },
      { path: "nota-final", element: <NotaFinalPage /> },
    ]
  }, {
    path: "/dashboard/profesor",
    element: (
      <RequireAuth allowedRoles={["profesor"]}>
        <ProfesorLayout />
      </RequireAuth>
    ),
    children: [
      {index: true, element: <ProfesorInicio />},
    ]
  }, {
    path: "/dashboard/tutor",
    element: (
      <RequireAuth allowedRoles={["tutor"]}>
        <TutorLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <TutorInicio />},
      { path: "licencia", element: <TutorLicenciasPage />},
    ]
  },
  {
    path: "/dashboard/tutor",
    element: (
      <RequireAuth allowedRoles={["tutor"]}>
        <TutorLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <TutorInicio /> },
      { path: "licencia", element: <GenerarLicencia /> },
      { path: "mis-estudiantes", element: <MisEstudiantes /> },
      { path: "boletin/:id", element: <BoletinDetalle /> }
    ]
  }



  // { path: "*", element: <NotFound /> }
];
