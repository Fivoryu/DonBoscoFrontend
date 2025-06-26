import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as asistenciaApi from "../services/asistencia.api";
import AxiosInstance from "@/components/AxiosInstance";
import { Asistencia, Licencia } from "@/app/modelos/Asistencia";
import { Estudiante } from "@/app/modelos/Estudiantes";
import { Clase, Curso } from "@/app/modelos/Academico";
import { Colegio, UnidadEducativa } from "@/app/modelos/Institucion";

// Obtener lista de colegios

export function useColegios() {
  return useQuery<Colegio[], Error>({
    queryKey: ["colegios"],
    queryFn: asistenciaApi.getColegios,
  });
}

// Obtener unidades educativas por colegio
export function useUnidadesByColegio(colegioId: number) {
  return useQuery<UnidadEducativa[], Error>({
    queryKey: ["unidades", colegioId],
    queryFn: () => asistenciaApi.getUnidadesByColegio(colegioId),
    enabled: !!colegioId,
  });
}

// Obtener cursos por unidad educativa
export function useCursosByUnidad(unidadId: number) {
  return useQuery<Curso[], Error>({
    queryKey: ["cursos", unidadId],
    queryFn: () => asistenciaApi.getCursosByUnidad(unidadId),
    enabled: !!unidadId,
  });
}

// Obtener estudiantes de un curso
export function useEstudiantesByCurso(cursoId: number) {
  return useQuery<Estudiante[], Error>({
    queryKey: ["estudiantes-curso", cursoId],
    queryFn: () => asistenciaApi.getEstudiantesByCurso(cursoId),
    enabled: !!cursoId,
  });
}

// Obtener la asistencia general de un estudiante
export function useAsistenciaEstudiante(estudianteId: number) {
  return useQuery<Asistencia[], Error>({
    queryKey: ["asistencia-estudiante", estudianteId],
    queryFn: () => asistenciaApi.getAsistenciaGeneralByEstudiante(estudianteId),
    enabled: !!estudianteId,
  });
}

// Obtener clases de una materia curso
export function useClasesByMateriaCurso(materiaCursoId: number) {
  return useQuery<Clase[], Error>({
    queryKey: ["clases-materia-curso", materiaCursoId],
    queryFn: () => asistenciaApi.getClasesByMateriaCurso(materiaCursoId),
    enabled: !!materiaCursoId,
  });
}

// Obtener asistencia por clase y estudiante 
export function useAsistenciaByClaseAndEstudiante(claseId: number, estudianteId: number) {
  return useQuery<Asistencia[], Error>({
    queryKey: ["asistencia-clase-estudiante", claseId, estudianteId],
    queryFn: () => asistenciaApi.getAsistenciaByClaseAndEstudiante(claseId, estudianteId),
    enabled: !!claseId && !!estudianteId,
  });
}

// Obtener asistencia general de todos los estudiantes de un curso en una fecha
export function useAsistenciaGeneralByCursoAndFecha(cursoId: number, fecha: string) {
  return useQuery<Asistencia[], Error>({
    queryKey: ["asistencia-general-curso", cursoId, fecha],
    queryFn: () => asistenciaApi.getAsistenciaGeneralByCursoAndFecha(cursoId, fecha),
    enabled: !!cursoId && !!fecha,
  });
}

// Obtener la asistencia por clase todos los estudiatnes de un curso en una fecha
export function useAsistenciaByClaseAndFecha(cursoId: number, fecha: string) {
  return useQuery<Asistencia[], Error>({
    queryKey: ["asistencia-clase-fecha", cursoId, fecha],
    queryFn: () => asistenciaApi.getAsistenciaByClaseAndFecha(cursoId, fecha),
    enabled: !!cursoId && !!fecha,
  });
}
export async function crearAsistenciaGeneral(data: any[]) {
  const response = await AxiosInstance.post("/asistencia/asistencias-generales/", data);
  return response.data;
}
// Crear una nueva asistencia general para el curso en la fecha seleccionada
export function useCrearAsistenciaGeneral() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any[]) =>
      asistenciaApi.crearAsistenciaGeneral(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asistencia-general-curso"] });
    },
  });
}

// Mutación para crear una nueva asistencia por clase
export function useCrearAsistenciaClase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { claseId: number; fecha: string; asistencias: any[] }) =>
      asistenciaApi.crearAsistenciaClase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asistencia-clase-fecha"] });
    },
  });
}

// Hook para calcular el porcentaje de asistencia de los estudiantes de un curso en un rango de fechas
export function usePorcentajeAsistenciaByCurso(asistencias: any[], estudiantes: any[], rangoFechas?: string[]) {
  // asistencias: lista de asistencias generales del curso
  // estudiantes: lista de estudiantes del curso
  // rangoFechas: opcional, restringe el cálculo a ciertas fechas
  return {
    porcentaje: (() => {
      if (!asistencias || !estudiantes || estudiantes.length === 0) return 0;
      let total = 0;
      let presentes = 0;
      estudiantes.forEach(est => {
        const asistenciasEst = asistencias.filter(a => a.estudiante.id === est.id && (!rangoFechas || rangoFechas.includes(a.fecha)));
        total += asistenciasEst.length;
        presentes += asistenciasEst.filter(a => a.estado === "ASI").length;
      });
      return total > 0 ? (presentes / total) * 100 : 0;
    })(),
  };
}

// Hook de estado para controlar el tipo de asistencia seleccionada
import { useState } from "react";
export function useTipoAsistencia(defaultTipo: "general" | "clase" = "general") {
  const [tipo, setTipo] = useState<"general" | "clase">(defaultTipo);
  return { tipo, setTipo };
}

// Obtener licencias de un estudiante
export function useLicenciasByEstudiante(estudianteId: number) {
  return useQuery<Licencia[], Error>({
    queryKey: ["licencias-estudiante", estudianteId],
    queryFn: () => asistenciaApi.getLicenciasByEstudiante(estudianteId),
    enabled: !!estudianteId,
  });
}
