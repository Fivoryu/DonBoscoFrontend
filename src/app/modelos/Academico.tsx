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
  unidadEducativaId: number;
  nivelEducativo: NivelEducativo;
}

/**
 * Paralelo: subdivisión de un Grado
 */
export interface Paralelo {
  id: number;
  gradoId: number;
  letra: string;
  capacidadMaxima: number;
}

/**
 * Curso: asignado a un Paralelo (OneToOne)
 */
export interface Curso {
  paraleloId: number;
  nombre: string;
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
  cursoParaleloId: number;
  materiaId: number;
}
