export interface NotaFinalMateria {
  id: number
  nota_final: string
  estado: "APR" | "REP" | "INC"
  fecha_calculo: string
  materia_curso: MateriaCurso
  periodo: Periodo
  estudiante: Estudiante
}

export interface MateriaCurso {
  id: number
  materia: {
    id: number
    nombre: string
  }
  curso: {
    id: number
    nombre: string
  }
}

export interface Periodo {
  id: number
  nombre: string
  tipo_division: string
  estado: string
  fecha_inicio: string
  fecha_fin: string
}

export interface Estudiante {
  id: number
  usuario: {
    nombre: string
    apellido: string
  }
  rude: string
}
