import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Pencil, Trash } from "lucide-react";
import Table from "@/components/Table";
import { Estudiante } from "@/app/modelos/Estudiantes";

export interface Row {
  id: number;
  nombreCompleto: string;
  ci: string;
  email: string;
  sexo: string;
  rude: string;
  curso: string;
  unidad: string;
}

interface Props {
  estudiantes: Estudiante[];
  sortKey: keyof Row;
  asc: boolean;
  onToggleSort: (k: keyof Row) => void;
  onEdit: (est: Estudiante) => void;
  onDelete: (id: number) => void;
}

const cols: Array<[keyof Row, string]> = [
  ["nombreCompleto", "Nombre"],
  ["ci", "CI"],
  ["email", "Email"],
  ["sexo", "Sexo"],
  ["rude", "RUDE"],
  ["curso", "Curso"],
  ["unidad", "Unidad Educativa"]
];

export default function EstudianteTable({
  estudiantes,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete
}: Props) {
  const [search, setSearch] = useState("");

  const rows = useMemo<Row[]>(() =>
    estudiantes.map(e => ({
      id: e.id!,
      nombreCompleto: `${e.usuario?.nombre} ${e.usuario?.apellido}`,
      ci: e.usuario?.ci || "–",
      email: e.usuario?.email || "–",
      sexo: e.usuario?.sexo || "–",
      rude: e.rude,
      curso: e.curso?.nombre || "–",
      unidad: e.unidad?.nombre || "–"
    })),
    [estudiantes]
  );

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(r =>
      r.nombreCompleto.toLowerCase().includes(t) ||
      r.ci.toLowerCase().includes(t) ||
      r.email.toLowerCase().includes(t) ||
      r.rude.toLowerCase().includes(t) ||
      r.curso.toLowerCase().includes(t) ||
      r.unidad.toLowerCase().includes(t)
    );
  }, [search, rows]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const A = a[sortKey] ?? "";
      const B = b[sortKey] ?? "";
      if (A === B) return 0;
      if (typeof A === "string" && typeof B === "string") {
        return asc ? A.localeCompare(B) : B.localeCompare(A);
      }
      return asc ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
    });
  }, [filtered, sortKey, asc]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar estudiantes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <Table>
        <thead className="bg-green-50 text-green-600 select-none">
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
                Sin estudiantes registrados
              </td>
            </tr>
          ) : (
            sorted.map(r => (
              <tr key={r.id} className="hover:bg-green-50">
                <td className="px-4 py-3">{r.nombreCompleto}</td>
                <td className="px-4 py-3">{r.ci}</td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">{r.sexo}</td>
                <td className="px-4 py-3">{r.rude}</td>
                <td className="px-4 py-3">{r.curso}</td>
                <td className="px-4 py-3">{r.unidad}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => onEdit(estudiantes.find(e => e.id === r.id)!)} className="text-blue-600 hover:underline">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(r.id)} className="text-red-600 hover:underline">
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
