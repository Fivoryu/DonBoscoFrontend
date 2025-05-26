import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import PerfilModal from "./Gestion Usuarios/Perfil"; // Asegúrate de tener este componente
import AxiosInstance from "@/components/AxiosInstance";

// const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL_LOCAL as string;
import { Usuario } from "@/app/modelos/Usuarios"; // Asegúrate de que esta ruta sea correcta
import SuperAdminSB from "../Sidebar/SuperAdminSB";



function isFile(x: unknown): x is File {
  return x instanceof File;
}

const SuperAdminLayout: React.FC = (): JSX.Element => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [showPerfil, setShowPerfil] = useState<boolean>(false);

  // Carga el perfil del usuario
  const fetchPerfil = async (): Promise<void> => {
    try {
      const response = await AxiosInstance.get<Usuario>("/user/auth/usuarios/perfil/");
      setUser(response.data);
    } catch (error) {
      console.error("Error al obtener perfil:", error);
    }
  };

  // Cierra la sesión
  

  useEffect(() => {
    fetchPerfil(); // al montar
  }, []);

  // Re-fetch cuando se muestre/oculte el modal (opcional)
  useEffect(() => {
    if (showPerfil) {
      fetchPerfil();
    }
  }, [showPerfil]);

  return (
    <>
      <div className="min-h-screen flex bg-blue-50 text-gray-800">
        
        {/* Sidebar */}
        <SuperAdminSB />
        {/* Contenido principal */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white shadow px-6 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-blue-600">
              Panel Super Admin
            </h1>
            <button
              onClick={() => setShowPerfil(true)}
              className="hidden sm:block ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              MI PERFIL
            </button>
          </header>
          <main className="p-6 flex-1">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Modal de perfil */}
      {showPerfil && user && (
      <PerfilModal
        user={{
          nombre:           user.nombre,
          apellido:         user.apellido,
          email:            user.email,
          fecha_nacimiento: user.fecha_nacimiento ?? "",
          username:         user.username,
          // casteo a `any` para que TS acepte el instanceof:
          foto: isFile(user.foto)
            ? user.foto
            : (user.foto ?? null),
        }}
        onClose={() => setShowPerfil(false)}
        onSave={(data: Usuario) => {
          console.log("Guardar perfil:", data);
          // API de actualización...
        }}
      />
    )}
    </>
  );
};

export default SuperAdminLayout;
