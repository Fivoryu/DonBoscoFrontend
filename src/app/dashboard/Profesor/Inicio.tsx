import { useEffect, useState } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { useAuth } from "@/app/contexts/AuthContext";
import { Profesor } from "@/app/modelos/Personal";

interface Clase {
  id: number;
  materia_curso: {
    materia: { nombre: string };
    curso: { nombre: string };
  };
  aula: { nombre: string };
}

export default function ProfesorInicio() {
  const { user } = useAuth();
  const [profesor, setProfesor] = useState<Profesor | null>(null);
  const [cursoTutor, setCursoTutor] = useState<string | null>(null);
  const [clases, setClases] = useState<Clase[]>([]);

  useEffect(() => {
    // Obtener datos del profesor (incluye usuario)
    if (user?.id) {
      AxiosInstance.get<Profesor>(`/personal/profesores/${user.id}/`)
        .then(res => {
          setProfesor(res.data);
          // Buscar curso a cargo (tutor)
          AxiosInstance.get(`/academico/cursos/?tutor=${user.id}`)
            .then(resp => {
              if (resp.data.length > 0) setCursoTutor(resp.data[0].nombre);
              else setCursoTutor(null);
            });
        })
        .catch(() => setProfesor(null));
    }
  }, [user]);

  useEffect(() => {
    // Obtener clases que enseña el profesor
    if (user?.id) {
      AxiosInstance.get(`/academico/clases/?materia_curso__profesor=${user.id}`)
        .then(res => setClases(res.data))
        .catch(() => setClases([]));
    }
  }, [user]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Bienvenido: {profesor?.usuario?.nombre ?? "Cargando..."}
        </h2>
      </div>
      {cursoTutor && (
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Curso a cargo:</span>{" "}
          <span className="text-blue-700">{cursoTutor}</span>
        </div>
      )}
      {clases.length > 0 && (
        <section className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-700">Clases que enseña</h3>
          <div className="bg-white rounded-xl shadow p-4">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-1 px-2">Materia</th>
                  <th className="text-left py-1 px-2">Curso</th>
                  <th className="text-left py-1 px-2">Aula</th>
                </tr>
              </thead>
              <tbody>
                {clases.map(clase => (
                  <tr key={clase.id}>
                    <td className="py-1 px-2">{clase.materia_curso.materia.nombre}</td>
                    <td className="py-1 px-2">{clase.materia_curso.curso.nombre}</td>
                    <td className="py-1 px-2">{clase.aula.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}