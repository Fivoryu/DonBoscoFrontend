// src/app/modelos/Personal.ts
import { Usuario } from "./Usuarios";
import { UnidadEducativa } from "./Institucion";
import { Curso } from "./Academico";

export interface Estudiante {
  id: number;
  usuario: Usuario;
  rude: string;
  estado: boolean;
  curso?: Curso;
  unidad: UnidadEducativa;
}

export interface Tutor {
  id?: number; // igual que arriba
  usuario: Usuario;
  parentesco: "PAD"|"MAD"|"TUT"|"HER"|"OTR";
  parentesco_display: string;
}

export interface TutorEstudiante {
  id: number;
  tutor: Tutor;
  estudiante: Estudiante;
  fecha_asignacion: string;  // "YYYY-MM-DD"
  es_principal: boolean;
}
