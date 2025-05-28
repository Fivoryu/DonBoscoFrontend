// src/app/dashboard/SuperAdmin/components/MateriaCursoTable.tsx
import { ChevronUp, ChevronDown, Trash, Pencil } from "lucide-react";
import Table from "@/components/Table";
import { MateriaCurso } from "@/app/modelos/Academico";
import { useMemo, useState } from "react";

interface Props {
  asignaciones: MateriaCurso[];
  sortKey: keyof SortableRow;
  asc: boolean;
  onToggleSort: (k: keyof SortableRow) => void;
  onEdit: (mc: MateriaCurso) => void;
  onDelete: (id: number) => void;
}

// definimos las claves que podemos ordenar
type SortableRow = {
  colegio: string;
  unidad: string;
  curso: string;
  materia: string;
  profesor: string;
};

const cols: Array<[keyof SortableRow, string]> = [
  ["colegio", "Colegio"],
  ["unidad", "Unidad Educativa"],
  ["curso", "Curso"],
  ["materia", "Materia"],
  ["profesor", "Profesor"]
];

export default function MateriaCursoTable({
  asignaciones,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");

  // filtrado por cualquiera de los campos de texto
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return asignaciones;
    return asignaciones.filter((a) => {
      const colegio = a.curso.paralelo?.grado?.unidad_educativa.colegio.nombre.toLowerCase() ?? "";
      const unidad = a.curso.paralelo?.grado.unidad_educativa.nombre.toLowerCase() ?? "";
      const curso   = a.curso.nombre.toLowerCase();
      const materia = a.materia.nombre.toLowerCase();
      return (
        colegio.includes(term) ||
        unidad.includes(term) ||
        curso.includes(term) ||
        materia.includes(term)
      );
    });
  }, [search, asignaciones]);

  // ordenamiento dinámico
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      // extraemos el valor según la clave
      const getValue = (row: MateriaCurso, key: keyof SortableRow) => {
        switch (key) {
          case "colegio":
            return row.curso.paralelo?.grado.unidad_educativa.colegio.nombre ?? "";
          case "unidad":
            return row.curso.paralelo?.grado.unidad_educativa.nombre ?? "";
          case "curso":
            return row.curso.nombre;
          case "materia":
            return row.materia.nombre;
          case "profesor":
            return row.profesor.usuario.nombre;
        }
      };
      const A = getValue(a, sortKey);
      const B = getValue(b, sortKey);
      if (A === B) return 0;
      return asc ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
    });
  }, [filtered, sortKey, asc]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar asignaciones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <Table>
        <thead className="bg-blue-50 text-blue-600 select-none">
          <tr>
            {cols.map(([key, label]) => {
              const active = sortKey === key;
              return (
                <th
                  key={key}
                  onClick={() => onToggleSort(key)}
                  className="px-4 py-3 whitespace-nowrap cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {active && (
                      asc
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />
                    )}
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
              <td colSpan={cols.length + 1} className="p-8 text-center text-gray-500">
                Sin asignaciones
              </td>
            </tr>
          ) : (
            sorted.map((a) => {
              const colegio = a.curso.paralelo?.grado.unidad_educativa.colegio.nombre ?? "–";
              const unidad  = a.curso.paralelo?.grado.unidad_educativa.nombre ?? "–";
              const curso   = a.curso.nombre;
              const materia = a.materia.nombre;
              const profesor = a.profesor?.usuario?.nombre ?? "-";
              return (
                <tr key={a.id} className="hover:bg-blue-50">
                  <td className="px-4 py-3">{colegio}</td>
                  <td className="px-4 py-3">{unidad}</td>
                  <td className="px-4 py-3">{curso}</td>
                  <td className="px-4 py-3">{materia}</td>
                  <td className="px-4 py-3 text-center">{profesor}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onEdit(a)}
                      className="mr-2 text-blue-600 hover:underline"
                    >
                      <Pencil className="w-4 h-4 rotate-180" />
                    </button>
                    <button
                      onClick={() => onDelete(a.id)}
                      className="text-red-600 hover:underline"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
}
