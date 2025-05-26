import { ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";
import { TipoHorario } from "@/app/modelos/Calendario";
import { useMemo, useState } from "react";
import Table from "@/components/Table";

interface Props {
  tiposHorario: TipoHorario[];
  sortKey: keyof TipoHorario;
  asc: boolean;
  onToggleSort: (k: keyof TipoHorario | string) => void;
  onEdit: (t: TipoHorario) => void;
  onDelete: (id: number) => void;
}

const colsT: Array<[keyof TipoHorario, string]> = [
  ["nombre", "Nombre"],
  ["descripcion", "Descripcion"],
  ["turno", "Turno"]
]

export default function TipoHorarioTable({
  tiposHorario,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return tiposHorario;
    return tiposHorario.filter((t) => {
      if (t.nombre.toLowerCase().includes(term)) return true;
      if (t.descripcion?.toLowerCase().includes(term)) return true;
      if (t.turno_display?.toLowerCase().includes(term)) return true;

      return false;
    })
  }, [search, tiposHorario]);

  const sorted = useMemo(() => {
    return [... filtered].sort((a, b) => {
      let valA: any = (a as any)[sortKey];
      let valB: any = (b as any)[sortKey];
      if (valA == null && valB == null) return 0;
      if (valA == null) return asc ? -1 : 1;
      if (valB == null) return asc ? 1 : -1;

      if (typeof valA === "number" && typeof valB === "number") {
        return asc ? valA -valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA === strB) return 0;
      return asc ? (strA > strB ? 1 : -1) : (strA < strB ? 1 : -1);
    })
  }, [filtered, sortKey, asc]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <div className="mb-4">
        <input 
          type="text"
          placeholder="Buscar tipos de horario..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <Table>
        <thead className="bg-blue-50 text-blue-600 select-none">
          <tr>
            {colsT.map(([key, label]) => {
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
              <td colSpan={colsT.length + 1} className="p-8 text-center text-gray-500">Sin Tipo de Horarios</td>
            </tr>
          ): (
            sorted.map(t => {
              const turnoDisplay = t.turno_display || "-";
              return (
                <tr key={t.id} className="hover:bg-blue-50">
                  <td className="px-4 py-3">{t.nombre}</td>
                  <td className="px-4 py-3">{t.descripcion}</td>
                  <td className="px-4 py-3">{turnoDisplay}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onEdit(t)} className="mr-2 text-blue-600 hover:underline">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(t.id)} className="text-red-600 hover:underline">
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
  )
}

