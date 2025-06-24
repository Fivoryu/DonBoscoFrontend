import { useEffect, useState } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { useAuth } from "@/app/contexts/AuthContext";
import { Estudiante, TutorEstudiante } from "@/app/modelos/Estudiantes";

export default function TutorInicio() {
  const { user } = useAuth();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);

  useEffect(() => {
    if (user?.id) {
      AxiosInstance.get<TutorEstudiante[]>("/estudiantes/relaciones/")
        .then(res => {
          // Filtrar relaciones por tutor actual
          const lista = res.data
            .filter(rel => rel.tutor.usuario.id === user.id)
            .map(rel => rel.estudiante);
          setEstudiantes(lista);
        })
        .catch(() => setEstudiantes([]));
    }
  }, [user]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Bienvenido: {user?.nombre ?? "Cargando..."}
        </h2>
      </div>
      <section className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-blue-700">Estudiantes asignados</h3>
        {estudiantes.length === 0 ? (
          <div className="text-gray-500">No tiene estudiantes asignados.</div>
        ) : (
          <div className="bg-white rounded-xl shadow p-4">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-1 px-2">CI</th>
                  <th className="text-left py-1 px-2">Nombre</th>
                  <th className="text-left py-1 px-2">Apellido</th>
                  <th className="text-left py-1 px-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map(est => (
                  <tr key={est.id}>
                    <td className="py-1 px-2">{est.usuario.ci}</td>
                    <td className="py-1 px-2">{est.usuario.nombre}</td>
                    <td className="py-1 px-2">{est.usuario.apellido}</td>
                    <td className="py-1 px-2">{est.usuario.email ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
