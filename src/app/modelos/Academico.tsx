export interface Grado {
  id: number;
  nivel_educativo: string // Inicial, Primaria, Secundaria
  unidad_educativa: string; // ID de la Unidad Educativa
}
//'INI' | 'PRI' | 'SEC';
export interface Paralelo {
  id: number;
  grado: number; // ID del grado
  letra: string; // Ej: "A", "B"
  capacidad_maxima: number;
}

export interface Curso {
  paralelo: number; // ID de paralelo (clave primaria en el modelo Curso)
  nombre: string;   // Ej: "3°B"
}

export interface Materia {
  id: number;
  nombre: string;
}

export interface MateriaCurso {
  id?: number;
  curso: number;    // ID del curso
  materia: number;  // ID de la materia
}
