// src/app/helpers/estudiantesHelpers.ts
import axiosInstance from "@/components/AxiosInstance";// Asegúrate de que esta ruta sea correcta
import { Estudiante } from "../modelos/Estudiantes";
import { Curso } from "../modelos/Academico";
import { UnidadEducativa } from "../modelos/Institucion";

// Listar estudiantes
export const getEstudiantes = async (): Promise<Estudiante[]> => {
  const res = await axiosInstance.get("/estudiantes/estudiantes/listar/");
  console.log("Estudiantes obtenidos:", res.data);
  return res.data;
};

// Crear estudiante
export const crearEstudiante = async (data: any): Promise<Estudiante> => {
  const res = await axiosInstance.post("/estudiantes/estudiantes/crear/", data);
  return res.data;
};

// Editar estudiante
export const editarEstudiante = async (
  id: number,
  data: any
): Promise<Estudiante> => {
  const res = await axiosInstance.put(`/estudiantes/estudiantes/${id}/editar/`, data);
  return res.data;
};

// Eliminar estudiante
export const eliminarEstudiante = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/estudiantes/estudiantes/${id}/eliminar/`);
};

// Listar cursos
export const getCursos = async (): Promise<Curso[]> => {
  const res = await axiosInstance.get("/academico/cursos/");
  return res.data;
};

// Listar unidades educativas (puedes cambiar la ruta si es distinta)
export const getUnidadesEducativas = async (): Promise<UnidadEducativa[]> => {
  const res = await axiosInstance.get("/institucion/unidades-educativas/");
  return res.data;
};
