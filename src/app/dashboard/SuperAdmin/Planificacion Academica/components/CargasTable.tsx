import { ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import Table from "@/components/Table";
import { CargaHoraria } from "@/app/modelos/Personal";

interface Props {
  cargas: CargaHoraria[];
  sortKey: keyof CargaHoraria;
  asc: boolean;
  onToggleSort: (k: keyof CargaHoraria | string) => void;
  onEdit: (c: CargaHoraria) => void;
  onDelete: (id: number) => void;
}

const cols: Array<[keyof CargaHoraria | string, string]> = [
  ["profesor", "Profesor"],
  ["especialidad", "Especialidad"],
  ["horas", "Horas"],
  ["periodo", "Periodo"],
];

export default function CargasTable({
  cargas,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return cargas;
    return cargas.filter((c) => {
      const prof = c.profesor?.usuario?.nombre + " " + c.profesor?.usuario?.apellido;
      const esp = c.especialidad?.nombre;
      const periodo = c.periodo?.nombre;
      if (prof?.toLowerCase().includes(term)) return true;
      if (esp?.toLowerCase().includes(term)) return true;
      if (periodo?.toLowerCase().includes(term)) return true;
      if (String(c.horas).includes(term)) return true;
      return false;
    });
  }, [search, cargas]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA: any = (a as any)[sortKey];
      let valB: any = (b as any)[sortKey];
      // Custom sort for profesor and especialidad and periodo
      if (sortKey === "profesor") {
        valA = a.profesor?.usuario?.nombre + " " + a.profesor?.usuario?.apellido;
        valB = b.profesor?.usuario?.nombre + " " + b.profesor?.usuario?.apellido;
      }
      if (sortKey === "especialidad") {
        valA = a.especialidad?.nombre;
        valB = b.especialidad?.nombre;
      }
      if (sortKey === "periodo") {
        valA = a.periodo?.nombre;
        valB = b.periodo?.nombre;
      }
      if (valA == null && valB == null) return 0;
      if (valA == null) return asc ? -1 : 1;
      if (valB == null) return asc ? 1 : -1;
      if (typeof valA === "number" && typeof valB === "number") {
        return asc ? valA - valB : valB - valA;
      }
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA === strB) return 0;
      return asc ? (strA > strB ? 1 : -1) : (strA < strB ? 1 : -1);
    });
  }, [filtered, sortKey, asc]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar cargas horarias..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <Table>
        <thead className="bg-blue-50 text-blue-600 select-none">
          <tr>
            {cols.map(([key, label]) => {
              const isActive = sortKey === key;
              return (
                <th
                  key={key}
                  onClick={() => onToggleSort(key)}
                  className="px-4 py-3 text-left cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {isActive && (asc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
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
              <td colSpan={cols.length + 1} className="p-8 text-center text-gray-500">Sin cargas horarias</td>
            </tr>
          ) : (
            sorted.map(c => (
              <tr key={c.id} className="hover:bg-blue-50">
                <td className="px-4 py-3">
                  {c.profesor
                    ? `${c.profesor.usuario.nombre} ${c.profesor.usuario.apellido}`
                    : "-"}
                </td>
                <td className="px-4 py-3">
                  {c.especialidad?.nombre ?? "-"}
                </td>
                <td className="px-4 py-3">{c.horas}</td>
                <td className="px-4 py-3">{c.periodo?.nombre ?? "-"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onEdit(c)} className="mr-2 text-blue-600 hover:underline">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(c.id)} className="text-red-600 hover:underline">
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
