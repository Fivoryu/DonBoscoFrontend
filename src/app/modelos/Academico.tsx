import { UnidadEducativa } from "./Institucion";

/**
 * Clase: relación entre Curso y Aula
 */
export interface Clase {
  id: number;
  cursoId: number;
  aulaId: number;
}

/**
 * Grado: nivel educativo dentro de una Unidad Educativa
 */
export type NivelEducativo = 'INI' | 'PRI' | 'SEC';

export interface Grado {
  id: number;
  nivel_educativo: string;
  numero: number;
  unidad_educativa: UnidadEducativa;
  nombre: string;
}

/**
 * Paralelo: subdivisión de un Grado
 */
export interface Paralelo {
  id: number;
  grado: Grado;
  gradoId?: number;
  letra: string;
}

/**
 * Curso: asignado a un Paralelo (OneToOne)
 */
import { Profesor } from "./Personal";

export interface Curso {
  id: number;
  paraleloId: number;
  nombre: string;
  paralelo: Paralelo;
  tutor: Profesor;
}

/**
 * Materia: asignatura disponible
 */
export interface Materia {
  id: number;
  nombre: string;
}

/**
 * Asociacion MateriaCurso: Materias asignadas a un Curso
 */
export interface MateriaCurso {
  id: number;
  nombre_completo: string;
  curso_id: number;
  curso: Curso;
  materia: Materia;
  materia_id: number;
  profesor: Profesor;
}

import { Aula } from "./Institucion";
export interface Clase {
  id: number;

  // Nest-read-only (GET) ────────────────────────────────────────
  materia_curso: MateriaCurso; // Solo presente en respuestas GET
  aula: Aula;                  // idem

  // Write-only (POST | PUT) ─────────────────────────────────────
  materia_curso_id?: number;   // Para envíos al backend
  aula_id?: number;
}