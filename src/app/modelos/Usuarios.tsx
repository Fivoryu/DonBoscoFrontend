// Usuarios.tsx
// Clases TypeScript que representan los modelos Django definidos en el backend.

import { UnidadEducativa } from "./Institucion";

export class Rol {
  id: number;
  nombre: string;
  descripcion?: string | null;

  constructor(data: {
    id: number;
    nombre: string;
    descripcion?: string | null;
  }) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.descripcion = data.descripcion ?? null;
  }
}

export class Usuario {
  id: number;
  ci: string;
  foto?: string | null;
  nombre: string;
  apellido: string;
  sexo: string;
  email: string;
  fecha_nacimiento?: string | null;
  username: string;
  estado: boolean;
  rol: Rol;
  telefono?: string | null;
  password?: string | null;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  puesto?: Puesto; // <-- agrega esta línea

  constructor(data: {
    id: number;
    ci: string;
    foto?: string | null;
    nombre: string;
    apellido: string;
    sexo: string;
    email: string;
    fecha_nacimiento?: string | null;
    username: string;
    estado: boolean;
    rol: Rol;
    telefono?: string | null;
    password?: string | null;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    puesto?: Puesto; // <-- agrega esta línea
  }) {
    this.id = data.id;
    this.ci = data.ci;
    this.foto = data.foto ?? null;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.sexo = data.sexo;
    this.email = data.email;
    this.fecha_nacimiento = data.fecha_nacimiento ?? null;
    this.username = data.username;
    this.estado = data.estado;
    this.rol = data.rol;
    this.telefono = data.telefono ?? null;
    this.password = data.password ?? null;
    this.is_staff = data.is_staff;
    this.is_active = data.is_active;
    this.date_joined = data.date_joined;
    this.puesto = data.puesto; // <-- agrega esta línea
  }
}

export class Notificacion {
  id: number;
  usuarioId: number;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  tipo: string;

  constructor(data: {
    id: number;
    usuarioId: number;
    titulo: string;
    mensaje: string;
    fecha: string;
    leida: boolean;
    tipo: string;
  }) {
    this.id = data.id;
    this.usuarioId = data.usuarioId;
    this.titulo = data.titulo;
    this.mensaje = data.mensaje;
    this.fecha = data.fecha;
    this.leida = data.leida;
    this.tipo = data.tipo;
  }
}

export class SuperAdmin {
  usuarioId: number;
  usuario: Usuario;

  constructor(data: { usuarioId: number; usuario: Usuario }) {
    this.usuarioId = data.usuarioId;
    this.usuario = data.usuario;
  }
}

export type Puesto = {
  id: number;
  nombre: string;
  descripcion?: string | null;
};

export type Accion = {
  id: number;
  nombre: string;
};

export type PermisoRol = {
  id: number;
  rol: Rol;
  rol_nombre: string;
  modelo: ModeloPermitido;
  modelo_nombre: string;
  accion: Accion;
  accion_nombre: string;
}

export type ModeloPermitido = {
  id: number;
  nombre: string;
};

export type PermisoPuesto = {
  id: number;
  puesto: Puesto;
  modelo: ModeloPermitido;
  accion: Accion;
};


export interface Admin {
  usuarioId: number;
  usuario: Usuario;
  puesto?: Puesto;
  unidad: UnidadEducativa;
  estado: boolean;
}

export type AccionBitacora = 'crear' | 'editar' | 'eliminar' | 'listar' | 'otro';

export interface Bitacora {
  id: number;
  usuario: Usuario;
  hora_entrada: string;
  hora_salida?: string | null;
  ip?: string | null;
  tabla_afectada?: string | null;
  accion: AccionBitacora;
  descripcion?: string | null;
  fecha: string;
}
