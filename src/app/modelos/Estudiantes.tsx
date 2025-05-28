// src/app/modelos/Personal.ts
import { Usuario } from "./Usuarios";
import { Curso } from "./Academico";

export interface Estudiante {
  usuario: Usuario;
  rude: string;
  estado: boolean;
  curso?: Curso;
}

export interface Tutor {
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
