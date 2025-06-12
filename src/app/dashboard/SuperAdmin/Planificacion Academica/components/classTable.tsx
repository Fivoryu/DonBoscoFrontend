/* src/app/dashboard/SuperAdmin/Planificacion Academica/components/classTable.tsx */

import { ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import Table from "@/components/Table";
import { Clase } from "@/app/modelos/Academico";

/* ─────────────── Tipos ─────────────── */
export type RowKey =
  | "id"
  | "colegio"
  | "unidad"
  | "curso"
  | "materia"
  | "aula";

interface Props {
  clases: Clase[];
  sortKey: RowKey;
  asc: boolean;
  onToggleSort: (k: RowKey) => void;
  onEdit: (c: Clase) => void;
  onDelete: (id: number) => void;
}

/* Row plano para ordenar más fácil */
type Row = {
  id: number;
  colegio: string;
  unidad: string;
  curso: string;
  materia: string;
  aula: string;
  claseObj: Clase;
};

/* columnas */
const COLS: Array<[keyof Row, string]> = [
  ["colegio", "Colegio"],
  ["unidad", "Unidad Educativa"],
  ["curso", "Curso"],
  ["materia", "Materia"],
  ["aula", "Aula"],
];

export default function ClaseTable({
  clases,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");

  /* 1) Clase → Row */
  const rows = useMemo<Row[]>(
    () =>
      clases.map((c) => ({
        id: c.id,
        colegio:
          c.materia_curso.curso.paralelo.grado.unidad_educativa.colegio.nombre,
        unidad: c.materia_curso.curso.paralelo.grado.unidad_educativa.nombre,
        curso: c.materia_curso.curso.nombre,
        materia: c.materia_curso.materia.nombre,
        aula: c.aula.nombre,
        claseObj: c,
      })),
    [clases]
  );

  /* 2) Filtro texto */
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) =>
      Object.values(r).some(
        (val) =>
          typeof val === "string" && val.toLowerCase().includes(term)
      )
    );
  }, [rows, search]);

  /* 3) Ordenamiento */
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const A: any = a[sortKey];
      const B: any = b[sortKey];
      if (A == null || B == null) return 0;
      const strA = String(A).toLowerCase();
      const strB = String(B).toLowerCase();
      if (strA === strB) return 0;
      return asc ? (strA > strB ? 1 : -1) : strA < strB ? 1 : -1;
    });
  }, [filtered, sortKey, asc]);

  /* 4) Render */
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar clases..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <Table>
        <thead className="bg-blue-50 text-blue-600 select-none">
          <tr>
            {COLS.map(([key, label]) => {
              const active = sortKey === key;
              return (
                <th
                  key={key}
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => onToggleSort(key as RowKey)}
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {active &&
                      (asc ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </span>
                </th>
              );
            })}
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {sorted.length === 0 ? (
            <tr>
              <td
                colSpan={COLS.length + 1}
                className="p-8 text-center text-gray-500"
              >
                Sin clases
              </td>
            </tr>
          ) : (
            sorted.map((r) => (
              <tr key={r.id} className="hover:bg-blue-50">
                <td className="px-4 py-3">{r.colegio}</td>
                <td className="px-4 py-3">{r.unidad}</td>
                <td className="px-4 py-3">{r.curso}</td>
                <td className="px-4 py-3">{r.materia}</td>
                <td className="px-4 py-3">{r.aula}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEdit(r.claseObj)}
                    className="mr-2 text-blue-600 hover:underline"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="text-red-600 hover:underline"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
