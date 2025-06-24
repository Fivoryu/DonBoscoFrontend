import { useQuery } from "@tanstack/react-query";
import * as estudiantesApi from "../services/estudiantes.api";
import { Estudiante } from "@/app/modelos/Estudiantes";
import { Asistencia } from "@/app/modelos/Asistencia";
import AxiosInstance from "@/components/AxiosInstance";

// Hook para obtener los estudiantes asignados a un tutor
export function useEstudiantesByTutor(tutorUsuarioId: number) {
  return useQuery<Estudiante[], Error>({
    queryKey: ["estudiantes-tutor", tutorUsuarioId],
    queryFn: () => estudiantesApi.getEstudiantesByTutor(tutorUsuarioId),
    enabled: !!tutorUsuarioId,
  });
}

// Hook para obtener el detalle de un estudiante
export function useEstudiante(estudianteId: number) {
  return useQuery<Estudiante, Error>({
    queryKey: ["estudiante", estudianteId],
    queryFn: () => estudiantesApi.getEstudiante(estudianteId),
    enabled: !!estudianteId,
  });
}

// Hook para obtener la asistencia de un estudiante
export function useAsistenciaEstudiante(estudianteId: number) {
  return useQuery<Asistencia[], Error>({
    queryKey: ["asistencia-estudiante", estudianteId],
    queryFn: async () => {
      const res = await AxiosInstance.get(`/asistencia/asistenciageneral/?estudiante=${estudianteId}`);
      return res.data;
    },
    enabled: !!estudianteId,
  });
}

// Hook para obtener información de colegio, unidad educativa y curso del estudiante
export function useInfoAcademicaEstudiante(estudiante: Estudiante | undefined) {
  return {
    colegio: estudiante?.unidad?.colegio,
    unidad: estudiante?.unidad,
    curso: estudiante?.curso,
  };
}
