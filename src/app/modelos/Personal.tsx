// src/app/modelos/Personal.ts

import { Materia, Grado } from "@/app/modelos/Academico";
import { Usuario } from "@/app/modelos/Usuarios";

export interface Especialidad {
  id: number;
  nombre: string;
  materia: Materia;
  grado: Grado;
}

export interface Profesor {
  /** la PK es el mismo usuario.id */
  usuario: Usuario;
  estado: boolean;
}

export interface ProfesorEspecialidad {
  id: number;
  profesor: Profesor;
  especialidad: Especialidad;
  fecha_asignacion: string; // ISO date, e.g. "2025-05-27"
}
