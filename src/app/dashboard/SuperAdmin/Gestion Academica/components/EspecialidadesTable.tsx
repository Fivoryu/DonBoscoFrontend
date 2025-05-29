// src/app/dashboard/SuperAdmin/GestionAcademico/components/EspecialidadesTable.tsx
import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Pencil, Trash } from "lucide-react";
import Table from "@/components/Table";
import { Especialidad } from "@/app/modelos/Personal";

interface Props {
  especialidades: Especialidad[];
  sortKey: keyof Row;
  asc: boolean;
  onToggleSort: (key: keyof Row) => void;
  onEdit: (especialidad: Especialidad) => void;
  onDelete: (id: number) => void;
}

export type Row = {
  colegio: string;
  unidadEducativa: string;
  nombre: string;
  id: number;
};

const cols: Array<[keyof Row, string]> = [
  ["colegio", "Colegio"],
  ["unidadEducativa", "Unidad Educativa"],
  ["nombre", "Especialidad"],
];

export default function EspecialidadesTable({
  especialidades,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");

  // Construye filas a partir del array de especialidades
  const rows = useMemo<Row[]>(
    () =>
      especialidades.map(e => ({
        id: e.id,
        colegio:         e.grado?.unidad_educativa?.colegio?.nombre ?? "",
        unidadEducativa: e.grado?.unidad_educativa?.nombre ?? "",
        nombre:          e.nombre,
      })),
    [especialidades]
  );

  // Filtrar por búsqueda
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r =>
      r.colegio.toLowerCase().includes(q) ||
      r.unidadEducativa.toLowerCase().includes(q) ||
      r.nombre.toLowerCase().includes(q)
    );
  }, [search, rows]);

  // Ordenar
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const A = a[sortKey];
      const B = b[sortKey];
      if (A === B) return 0;
      if (typeof A === "string" && typeof B === "string") {
        return asc ? A.localeCompare(B) : B.localeCompare(A);
      }
      return 0;
    });
  }, [filtered, sortKey, asc]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar especialidades..."
          value={search}
          onChange={e => setSearch(e.target.value)}
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
                    {active && (asc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
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
                Sin especialidades
              </td>
            </tr>
          ) : (
            sorted.map(r => {
              // Encuentra el objeto original para pasar a onEdit
              const item = especialidades.find(e => e.id === r.id)!;
              return (
                <tr key={r.id} className="hover:bg-green-50">
                  <td className="px-4 py-3 whitespace-nowrap">{r.colegio}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.unidadEducativa}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.nombre}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onEdit(item)}
                      className="mr-2 text-blue-600 hover:underline"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
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
