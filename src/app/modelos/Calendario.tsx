import { UnidadEducativa } from "./Institucion";

export interface Periodo {
  id: number;
  calendario: CalendarioAcademico;
  tipo_division: string;
  tipo_division_display: string;
  nombre: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  estado: boolean;
  estado_display: string;
}

export interface Feriado {
  id: number;
  calendario: CalendarioAcademico;
  tipo: TipoFeriado;
  tipo_nombre: string
  tipo_es_nacional: boolean;
  nombre: string;
  descripcion: string;
  fecha: Date;
}

export interface CalendarioAcademico {
  id: number;
  año: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  unidad_educativa: UnidadEducativa;
  unidad_educativa_nombre: string;
  activo: boolean;
  periodos: Periodo[];
  feriados: Feriado[];
}

export interface TipoFeriado {
  id: number;
  nombre: string;
  descripcion: string;
  es_nacional: boolean;
}

export const TURNOS = [
  { value: "MAÑANA", label: "Mañana" },
  { value: "TARDE",  label: "Tarde"  },
  { value: "NOCHE",  label: "Noche"  },
];

export type Turno = 'Mañana' | 'Tarde' | 'Noche';

export interface TipoHorario {
  id: number;
  nombre: string;
  descripcion: string;
  turno: Turno;
  turno_display: string;
}

export type DiaSemana = 'LUN' | 'MAR' | 'MIE' | 'JUE' | 'VIE' | 'SAB' | 'DOM';

export const DIAS_SEMANA: { value: DiaSemana; label: string } [] = [
  { value: 'LUN', label: 'Lunes' },
  { value: 'MAR', label: 'Martes' },
  { value: 'MIE', label: 'Miércoles' },
  { value: 'JUE', label: 'Jueves' },
  { value: 'VIE', label: 'Viernes' },
  { value: 'SAB', label: 'Sábado' },
  { value: 'DOM', label: 'Domingo' },
]

export interface Horario {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: TipoHorario;
  tipo_nombre: string;
  tipo_turno_display: string;
  hora_inicio: string;
  hora_fin: string;
  dia: DiaSemana;
  dia_display: string;
}

import { Clase } from "./Academico";

export interface ClaseHorario {
  id: number;
  clase: Clase;
  horario: Horario;
  fecha_inicio: Date;
  fecha_fin: Date;
}




