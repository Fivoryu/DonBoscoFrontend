import { ChevronUp, ChevronDown, Pencil, Trash, CheckCircle, XCircle } from "lucide-react";
import { Modulo, Colegio } from "@/app/modelos/Institucion";
import { useMemo, useState } from "react";
import { getColegioName } from "../../utils/getColegioName";
import Table from "@/components/Table";

interface Props {
  modulos: Modulo[];
  colegios: Colegio[];
  sortKey: keyof Modulo | 'aulasOcupadas' | 'pisos';
  asc: boolean;
  onToggleSort: (k: keyof Modulo | 'aulasOcupadas' | 'pisos') => void;
  onEdit: (m: Modulo) => void;
  onDelete: (id: number) => void;
}

const cols: Array<[keyof Modulo | 'aulasOcupadas' | 'pisos', string]> = [
  ["nombre", "Nombre"],
  ["cantidadAulas", "Cantidad Aulas"],
  ["pisos", "Número de pisos"],
  ["descripcion", "Descripción"],
  ["colegioId", "Colegio"],
];

export default function ModulosTable({
  modulos,
  colegios,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return modulos;
    return modulos.filter((m) => m.nombre.toLowerCase().includes(t));
  }, [search, modulos]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        let A: string | number = "";
        let B: string | number = "";

        if (sortKey === "pisos") {
          A = (a as any).pisos ?? 0;
          B = (b as any).pisos ?? 0;
        } else if (sortKey === "aulasOcupadas") {
          A = (a as any).aulasOcupadas ?? 0;
          B = (b as any).aulasOcupadas ?? 0;
        } else {
          const aValue = a[sortKey as keyof Modulo];
          const bValue = b[sortKey as keyof Modulo];
          // If value is an object (e.g., Colegio), convert to string (e.g., id or name)
          A = typeof aValue === "object" && aValue !== null
            ? (aValue.hasOwnProperty("nombre") ? (aValue as any).nombre : JSON.stringify(aValue))
            : (aValue ?? "");
          B = typeof bValue === "object" && bValue !== null
            ? (bValue.hasOwnProperty("nombre") ? (bValue as any).nombre : JSON.stringify(bValue))
            : (bValue ?? "");
        }

        if (A === B) return 0;
        return asc ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
      }),
    [filtered, sortKey, asc]
  );

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar..."
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
                  className="px-4 py-3 text-left cursor-pointer"
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
              <td colSpan={cols.length + 1} className="p-8 text-center">
                Sin módulos
              </td>
            </tr>
          ) : (
            sorted.map((m) => (
              <tr key={m.id} className="hover:bg-blue-50">
                <td className="px-4 py-3">{m.nombre}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {m.aulasOcupadas ?? 0} / {m.cantidadAulas}
                    </span>
                    {m.aulasDisponibles! > 0 ? (
                      <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                        <CheckCircle className="w-4 h-4" />
                        {m.aulasDisponibles} disponibles
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 font-medium text-sm">
                        <XCircle className="w-4 h-4" />
                        Módulo lleno
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">{m.pisos}</td>
                <td className="px-4 py-3">{m.descripcion}</td>
                <td className="px-4 py-3">{getColegioName(m, colegios)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEdit(m)}
                    className="mr-2 text-blue-600 hover:underline"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(m.id)}
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
