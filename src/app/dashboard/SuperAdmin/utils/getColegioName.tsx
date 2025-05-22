import { Modulo, Colegio } from "@/app/modelos/Institucion";

export function getColegioName(modulo: Modulo, colegios: Colegio[]): string {
  const colegio = colegios.find(c => c.id === modulo.colegioId);
  return colegio?.nombre ?? "–";
}