// src/app/dashboard/SuperAdminLayout.tsx

import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AxiosInstance from "@/components/AxiosInstance";
import PerfilModal from "./Gestion Usuarios/Perfil";
import { Usuario } from "@/app/modelos/Usuarios";
import SuperAdminSB from "../Sidebar/SuperAdminSB";
import clsx from "clsx";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  SIDEBAR_SECTIONS_SUPERADMIN,
  SIDEBAR_SECTIONS_ADMIN,
  SIDEBAR_SECTIONS_PROFESOR,
} from "../Sidebar/SidebarConfig";

function isFile(x: unknown): x is File {
  return x instanceof File;
}

const SuperAdminLayout: React.FC = () => {
  // 1) Estado para controlar si el sidebar está abierto
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // 2) Estados para el perfil y el modal
  const [user, setUser] = useState<Usuario | null>(null);
  const [showPerfil, setShowPerfil] = useState<boolean>(false);

  // Carga el perfil al montar
  const fetchPerfil = async () => {
    try {
      const resp = await AxiosInstance.get<Usuario>("/user/auth/usuarios/perfil/");
      setUser(resp.data);
    } catch (error) {
      console.error("Error obteniendo perfil:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  // Volver a cargar perfil si se abre el modal (opcional)
  useEffect(() => {
    if (showPerfil) {
      fetchPerfil();
    }
  }, [showPerfil]);

  const { user: authUser } = useAuth();

  // Elige la config según el rol
  let sidebarSections = SIDEBAR_SECTIONS_SUPERADMIN;
  if (authUser) {
    const rol = authUser.rol.nombre.toLowerCase();
    if (rol === "admin") sidebarSections = SIDEBAR_SECTIONS_ADMIN;
    else if (rol === "profesor") sidebarSections = SIDEBAR_SECTIONS_PROFESOR;
  }

  return (
    <>
      <div
        className={clsx(
          "min-h-screen flex bg-blue-50 text-gray-800",
          sidebarOpen ? "md:pl-64" : "md:pl-16"
        )}
      >
        {/* Sidebar: le pasamos el estado y la función para alternarlo */}
        <SuperAdminSB
          openSide={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
          sections={sidebarSections} // <-- pasa la config correcta
        />

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* HEADER */}
          <header className="bg-white shadow flex items-center justify-between px-6 py-3">
            {/* Botón hamburguesa en mobile (< md) */}
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="md:hidden p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {sidebarOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Título centrado en mobile, alineado a la izquierda en desktop */}
            <h1 className="flex-1 text-center md:text-left text-xl font-semibold text-blue-600">
              Panel Super Admin
            </h1>

            {/* Botón “Mi Perfil”: oculto en xs, visible en sm+ */}
            <button
              onClick={() => setShowPerfil(true)}
              className="hidden sm:inline-block ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              MI PERFIL
            </button>
          </header>

          {/* MAIN (Outlet de rutas) */}
          <main className="p-6 flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Modal de Perfil */}
      {showPerfil && user && (
        <PerfilModal
          user={{
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            fecha_nacimiento: user.fecha_nacimiento ?? "",
            username: user.username,
            foto: isFile(user.foto) ? user.foto : user.foto ?? null,
          }}
          onClose={() => setShowPerfil(false)}
          onSave={(data: Usuario) => {
            console.log("Guardar perfil:", data);
            // Aquí llamarías a tu API para actualizar el perfil
          }}
        />
      )}
    </>
  );
};

export default SuperAdminLayout;
