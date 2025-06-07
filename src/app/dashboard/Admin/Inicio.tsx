import { useEffect, useState } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { useAuth } from "@/app/contexts/AuthContext";
import { Admin } from "@/app/modelos/Usuarios";

export default function AdminInicio() {
  const { user } = useAuth();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [cantidades, setCantidades] = useState<{
    admins: number;
    profesores: number;
    tutores: number;
    alumnos: number;
    total: number;
  }>({ admins: 0, profesores: 0, tutores: 0, alumnos: 0, total: 0 });

  useEffect(() => {
    // Obtener datos del admin (incluye unidad)
    if (user?.id) {
      AxiosInstance.get<Admin>(`/user/auth/admins/${user.id}/`)
        .then(res => setAdmin(res.data))
        .catch(() => setAdmin(null));
    }
  }, [user]);

  useEffect(() => {
    // Obtener cantidades de usuarios por unidad
    if (admin?.unidad?.id) {
      AxiosInstance.get(`/institucion/unidades-educativas/${admin.unidad.id}/usuarios-cantidad/`)
        .then(res => setCantidades(res.data))
        .catch(() => setCantidades({ admins: 0, profesores: 0, tutores: 0, alumnos: 0, total: 0 }));
    }
  }, [admin]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Unidad Educativa: {admin?.unidad?.nombre ?? "Cargando..."}
        </h2>
      </div>
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <span className="text-sm text-gray-500">Administradores</span>
          <span className="text-3xl font-bold text-blue-600 mt-2">{cantidades.admins}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <span className="text-sm text-gray-500">Profesores</span>
          <span className="text-3xl font-bold text-blue-600 mt-2">{cantidades.profesores}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <span className="text-sm text-gray-500">Tutores</span>
          <span className="text-3xl font-bold text-blue-600 mt-2">{cantidades.tutores}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <span className="text-sm text-gray-500">Alumnos</span>
          <span className="text-3xl font-bold text-blue-600 mt-2">{cantidades.alumnos}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <span className="text-sm text-gray-500">Total Usuarios</span>
          <span className="text-3xl font-bold text-blue-600 mt-2">{cantidades.total}</span>
        </div>
      </section>
    </div>
  );
}
