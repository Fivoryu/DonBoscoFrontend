

/** Colegio */
export interface Colegio {
  id: number;
  nombre: string;
  logo?: string | null;
  direccion?: string;
  telefono?: string;
  email?: string | null;
  sitio_web?: string | null;
  superAdminFk?: number | null;
}

/** Módulo dentro de un Colegio */
export interface Modulo {
  id: number;
  nombre: string;
  pisos: number;
  cantidadAulas: number;
  aulasOcupadas?: number;
  aulasDisponibles?: number;    // ← nuevo
  descripcion?: string | null;
  colegioId?: number | null;
  colegio?: Colegio;
}

/** Tipos disponibles para Aula */
export type TipoAula =
  | 'AUL'
  | 'LAB'
  | 'TAL'
  | 'AUD'
  | 'COM'
  | 'GIM'
  | 'BIB';

/** Aula perteneciente a un Módulo */
export interface Aula {
  id: number;
  moduloId?: number | null;
  nombre: string;
  capacidad: number;
  estado: boolean;
  tipo: TipoAula;
  equipamiento?: string | null;
  piso?: number;
}

/** Turnos permitidos para UnidadEducativa */
import { Turno } from "./Calendario";

/** Unidad Educativa */
export interface UnidadEducativa {
  id: number;
  codigo_sie: string;
  turno: Turno;
  nombre: string;
  direccion?: string | null;
  telefono?: string | null;
  nivel?: string | null;
  colegio: Colegio;
}
