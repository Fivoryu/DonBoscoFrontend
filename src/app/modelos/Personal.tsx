// src/app/modelos/Personal.ts

import { Materia, Grado } from "@/app/modelos/Academico";
import { Usuario } from "@/app/modelos/Usuarios";
import { UnidadEducativa } from "./Institucion";

export interface Especialidad {
  id: number;
  nombre: string;
  materia: Materia;
  grado?: Grado;
}

export interface Profesor {
  usuario: Usuario;
  estado: boolean;
  unidad: UnidadEducativa
}

export interface ProfesorEspecialidad {
  id: number;
  profesor: Profesor;
  especialidad: Especialidad;
  fecha_asignacion: string; // ISO date, e.g. "2025-05-27"
}

import { Periodo } from "./Calendario";

export interface CargaHoraria {
  id: number;
  profesor: Profesor;
  especialidad: Especialidad;
  profesor_especialidad?: ProfesorEspecialidad;
  horas: number;
  periodo: Periodo;
}