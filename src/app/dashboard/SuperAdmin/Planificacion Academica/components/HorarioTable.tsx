import { ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";
import { Horario } from "@/app/modelos/Calendario";
import { useMemo, useState } from "react";
import Table from "@/components/Table";

interface Props {
  Horarios: Horario[];
  sortKey: keyof Horario;
  asc: boolean;
  onToggleSort: (k: keyof Horario | string) => void;
  onEdit: (h: Horario) => void;
  onDelete: (id: number) => void;
}

const colsH: Array<[keyof Horario, string]> =[
  ["tipo_turno_display", "Turno"],
  ["hora_inicio", "Hora de Inicio"],
  ["hora_fin", "Hora Fin"],
  ["dia_display", "Dia"],
]

export default function HorarioTable({
  Horarios,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete
} : Props) {
  const [search, setSearch] = useState("");
  
    const filtered = useMemo(() => {
      const term = search.trim().toLowerCase();
      if (!term) return Horarios;
      return Horarios.filter((t) => {
        if (t.tipo_turno_display?.toLowerCase().includes(term)) return true;
        if (t.hora_inicio?.toLowerCase().includes(term)) return true;
        if (t.hora_fin?.toLowerCase().includes(term)) return true;
        if (t.dia_display?.toLowerCase().includes(term)) return true;

        return false;
      })
    }, [search, Horarios]);
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
          placeholder="Buscar Horarios..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <Table>
        <thead className="bg-blue-50 text-blue-600 select-none">
          <tr>
            {colsH.map(([key, label]) => {
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
              <td colSpan={colsH.length + 1} className="p-8 text-center text-gray-500">Sin Horarios</td>
            </tr>
          ): (
            sorted.map(h => {
              return (
                <tr key={h.id} className="hover:bg-blue-50">
                  <td className="px-4 py-3">{h.tipo_turno_display}</td>
                  <td className="px-4 py-3">
                    {h.hora_inicio
                      .slice(0,5)
                      .replace(/^0/, '')
                    }
                  </td>
                  <td className="px-4 py-3">
                    {h.hora_fin
                      .slice(0,5)
                      .replace(/^0/, '')
                    }
                  </td>
                  <td className="px-4 py-3">{h.dia_display}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onEdit(h)} className="mr-2 text-blue-600 hover:underline">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(h.id)} className="text-red-600 hover:underline">
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