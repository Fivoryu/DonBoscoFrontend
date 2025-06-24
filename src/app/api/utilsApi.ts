import api from "./axiosInstance";

// Materias por curso
export const getMateriasCurso = () => api.get("/materias-curso/");

// Profesores
export const getProfesores = () => api.get("/profesores/");

// Dimensiones de evaluación
export const getDimensiones = () => api.get("/dimensiones/");


export const getEstudiantes = () => api.get("/estudiantes/listar/");
