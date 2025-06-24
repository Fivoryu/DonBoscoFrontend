import AxiosInstance from "@/components/AxiosInstance";
import { Estudiante, TutorEstudiante } from "@/app/modelos/Estudiantes";

// Obtener todos los estudiantes asignados a un tutor (por id de usuario)
export async function getEstudiantesByTutor(tutorUsuarioId: number): Promise<Estudiante[]> {
  const res = await AxiosInstance.get(`/estudiantes/relaciones/?tutor__usuario=${tutorUsuarioId}`);
  // Suponiendo que la relación tiene un campo 'estudiante' con los datos completos
  return res.data.map((rel: TutorEstudiante) => rel.estudiante);
}

// Obtener el detalle de un estudiante asignado
export async function getEstudiante(estudianteId: number): Promise<Estudiante> {
  const res = await AxiosInstance.get(`/estudiantes/estudiantes/${estudianteId}/`);
  return res.data;
}

// Listar todas las relaciones tutor-estudiante (opcional, para administración)
export async function getRelacionesTutorEstudiante(): Promise<TutorEstudiante[]> {
  const res = await AxiosInstance.get(`/estudiantes/relaciones/`);
  return res.data;
}
