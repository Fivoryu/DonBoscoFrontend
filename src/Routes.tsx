import { RouteObject } from "react-router-dom";

import Home from "./app/usuarios/Home";
import Login from "./app/usuarios/Login";
import Register from "./app/usuarios/Register";

import SuperAdminLayout from "./app/dashboard/SuperAdmin/Layout";
import SuperAdminInicio from "./app/dashboard/SuperAdmin/Inicio";
import SuperAdminColegios from "./app/dashboard/SuperAdmin/Colegios";
import SuperAdminUnidades from "./app/dashboard/SuperAdmin/Unidades";
import SuperAdminUsuarios from "./app/dashboard/SuperAdmin/Usuarios";
import SuperAdminInfraestructura from "./app/dashboard/SuperAdmin/Infraestructura";

import SuperAdminGrados from "./app/dashboard/SuperAdmin/Grado";
import RequireAuth from "./app/routes/RequireAuth";

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
      <RequireAuth requireRole="superadmin">
        <SuperAdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <SuperAdminInicio /> },
      { path: "colegios", element: <SuperAdminColegios /> },
      { path: "unidades", element: <SuperAdminUnidades /> },
      { path: "usuarios", element: <SuperAdminUsuarios /> },
      { path: "infraestructura", element: <SuperAdminInfraestructura /> },
      { path: "grados", element: <SuperAdminGrados /> },
    ],
  },
  // { path: "*", element: <NotFound /> }
];
