import { RouteObject } from "react-router-dom";

import Home from "./app/usuarios/Home";
import Login from "./app/usuarios/Login";
import Register from "./app/usuarios/Register";

import SuperAdminLayout from "./app/dashboard/SuperAdmin/Layout";
import SuperAdminInicio from "./app/dashboard/SuperAdmin/Inicio";
import SuperAdminColegios from "./app/dashboard/SuperAdmin/Configuracion Institucional/Colegios";
import SuperAdminUnidades from "./app/dashboard/SuperAdmin/Configuracion Institucional/Unidades";
import SuperAdminUsuarios from "./app/dashboard/SuperAdmin/Gestion Usuarios/Usuarios";
import SuperAdminInfraestructura from "./app/dashboard/SuperAdmin/Infraestructura";

import SuperAdminGrados from "./app/dashboard/SuperAdmin/Gestion Academica/Grado";
import SuperAdminRoles from "./app/dashboard/SuperAdmin/Gestion Usuarios/Roles";
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
import SuperAdminCargaHoraria from "./app/dashboard/SuperAdmin/Planificacion Academica/CargaHoraria";



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
      { path: "profesor", element: <SuperAdminProfesor />},
      { path: "grados", element: <SuperAdminGrados /> },
      { path: "modulos", element: <SuperAdminModulos /> },
      { path: "aulas", element: <SuperAdminAulas /> },
      { path: "cursos", element: <SuperAdminCursos /> },
      { path: "paralelos", element: <SuperAdminParalelos />},
      { path: "roles", element: <SuperAdminRoles /> },
      { path: "tipo-horario", element: <SuperAdminTipoHorario />},
      { path: "carga-horaria", element: <SuperAdminCargaHoraria />},
      { path: "horario", element: <SuperAdminHorario />},
      { path: "materia", element: <SuperAdminMateria />},
      { path: "materia-curso", element: <SuperAdminMateriaCurso />},
      { path: "especialidad", element: <SuperAdminEspecialidad />},
      { path: "bitacora/:usuarioId/usuario/", element: <BitacoraUsuarioPage/>}
    ],
  }, {
    path: "/dashboard/admin/",
    element: (
      <RequireAuth allowedRoles={["admin"]}>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <AdminInicio />},
      { path: "modulos", element: <AdminModulos /> },
    ]
  }
  // { path: "*", element: <NotFound /> }
];
