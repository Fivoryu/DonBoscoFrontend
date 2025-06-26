import AxiosInstance from "@/components/AxiosInstance";
import { Asistencia, Licencia } from "@/app/modelos/Asistencia";
import { Estudiante } from "@/app/modelos/Estudiantes";
import { Clase, Curso, Grado, Paralelo, MateriaCurso } from "@/app/modelos/Academico";
import { Colegio, UnidadEducativa } from "@/app/modelos/Institucion";

// Obtener colegios
export async function getColegios(): Promise<Colegio[]> {
  const res = await AxiosInstance.get("/institucion/colegios/");
  return res.data;
}

// Obtener unidades educativas después de seleccionar un colegio
export async function getUnidadesByColegio(colegioId: number): Promise<UnidadEducativa[]> {
  const res = await AxiosInstance.get(`/institucion/unidades-educativas/?colegio=${colegioId}`);
  return res.data;
}

// Obtener grados después de seleccionar una unidad educativa
export async function getGradosByUnidad(unidadId: number): Promise<Grado[]> {
  const res = await AxiosInstance.get(`/academico/grados/?unidad_educativa=${unidadId}`);
  return res.data;
}

// Obtener paralelos después de seleccionar un grado
export async function getParalelosByGrado(gradoId: number): Promise<Paralelo[]> {
  const res = await AxiosInstance.get(`/academico/paralelos/?grado=${gradoId}`);
  return res.data;
}

// Obtener cursos después de seleccionar un paralelo
export async function getCursosByParalelo(paraleloId: number): Promise<Curso[]> {
  const res = await AxiosInstance.get(`/academico/cursos/?paralelo=${paraleloId}`);
  return res.data;
}

// Obtener directamente cursos al seleccionar unidad educativa
export async function getCursosByUnidad(unidadId: number): Promise<Curso[]> {
  const res = await AxiosInstance.get(`/academico/cursos/?unidad_educativa=${unidadId}`);
  return res.data;
}

// Obtener un listado de estudiantes por curso
export async function getEstudiantesByCurso(cursoId: number): Promise<Estudiante[]> {
  const res = await AxiosInstance.get(`/estudiantes/estudiantes/?curso=${cursoId}`);
  return res.data;
}

// Obtener materia curso que incluye el curso y la materia
export async function getMateriasCursoByCurso(cursoId: number): Promise<MateriaCurso[]> {
  const res = await AxiosInstance.get(`/academico/materias-curso/?curso_id=${cursoId}`);
  return res.data;
}

// Obtener licencia de estudiantes
export async function getLicenciasByEstudiante(estudianteId: number): Promise<Licencia[]> {
  const res = await AxiosInstance.get(`/asistencia/licencias/?estudiante=${estudianteId}`);
  return res.data;
}

// Obtener asistencia general de estudiantes
export async function getAsistenciaGeneralByEstudiante(estudianteId: number): Promise<Asistencia[]> {
  const res = await AxiosInstance.get(`/asistencia/asistencias-generales/?estudiante=${estudianteId}`);
  return res.data;
}

// Obtener clases por materia_curso
export async function getClasesByMateriaCurso(materiaCursoId: number): Promise<Clase[]> {
  const res = await AxiosInstance.get(`/academico/clases/?materia_curso=${materiaCursoId}`);
  return res.data;
}

// Obtener asistencia por clase y estudiante
export async function getAsistenciaByClaseAndEstudiante(claseId: number, estudianteId: number): Promise<Asistencia[]> {
  const res = await AxiosInstance.get(`/asistencia/asistencias-clases/?clase=${claseId}&estudiante=${estudianteId}`);
  return res.data;
}

// Obtener asistencia general de todos los estudiantes de un curso en una fecha
export async function getAsistenciaGeneralByCursoAndFecha(cursoId: number, fecha: string): Promise<Asistencia[]> {
  const res = await AxiosInstance.get(`/asistencia/asistencias-generales/?curso=${cursoId}&fecha=${fecha}`);
  return res.data;
}

// Obtener la asistencia por clase todos los estudiatnes de un curso en una fecha
export async function getAsistenciaByClaseAndFecha(cursoId: number, fecha: string): Promise<Asistencia[]> {
  const res = await AxiosInstance.get(`/asistencia/asistencias-clases/?curso=${cursoId}&fecha=${fecha}`);
  return res.data;
}

// Crear asistencia general para un curso
export async function crearAsistenciaGeneral(data: any[]): Promise<unknown> {
  const res = await AxiosInstance.post("/asistencia/asistencias-generales/", data);
  return res.data;
}

// Crear asistencia por clase para un curso
export async function crearAsistenciaClase(data: { claseId: number; fecha: string; asistencias: any[]; }): Promise<unknown> {
  const res = await AxiosInstance.post("/asistencia/asistencias-clases/", data);
  return res.data;
}



