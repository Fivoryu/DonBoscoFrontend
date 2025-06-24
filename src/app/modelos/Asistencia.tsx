import { Clase } from "./Academico";
import { Estudiante, Tutor } from "./Estudiantes"

type TiposComportamiento = {
  "POS": "Positivo",
  "NEG": "Negativo",
  "OBS": "Observación"
}

export interface Comportamiento {
  estudiante: Estudiante;
  fecha: string;
  descripcion: string;
  tipo: keyof TiposComportamiento;
  gravedad: number;
}

type EstadosLicencia = {
  "SOL": "Solicitada",
  "APR": "Aprobada",
  "REC": "Rechazada",
  "FIN": "Finalizada"
}

export interface Licencia {
  estudiante: Estudiante;
  tutor: Tutor
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string;
  estado: keyof EstadosLicencia;
  archivo?: string | File;
}

type EstadoAsistencia = {
  "ASI": "Asistió",
  "FAL": "Faltó",
  "TAR": "Tardó",
  "JUS": "Justificó",
}

export interface Asistencia {
  estudiante: Estudiante;
  fecha: string;
  estado: keyof EstadoAsistencia;
  hora_entrada?: string;
  hora_salida?: string;
  observaciones?: string;
}

type EstadoAsistenciaClase = {
  "ASI": "Asistió",
  "FAL": "Faltó",
  "TAR": "Tardó",
  "LIC": "Con licencia",
}

export interface AsistenciaClase {
  clase: Clase;
  estudiante: Estudiante;
  fecha: string;
  hora?: string;
  estado: keyof EstadoAsistenciaClase;
  licencia?: Licencia;
}
