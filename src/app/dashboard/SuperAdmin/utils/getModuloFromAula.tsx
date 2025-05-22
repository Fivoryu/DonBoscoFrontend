import { Aula, Modulo } from "@/app/modelos/Institucion";

export function getModuloFromAula(aula: Aula, modulos: Modulo[]): Modulo | null {
  return modulos.find(modulo => modulo.id === aula.moduloId) || null;
}