import { ChevronUp, ChevronDown, Pencil, Trash } from "lucide-react";
import { Paralelo, Grado } from "@/app/modelos/Academico";
import { useMemo, useState } from "react";
import Table from "@/components/Table";

interface Props {
  paralelos: Paralelo[];
  grados: Grado[];
  sortKey: keyof Paralelo | "colegio" | "unidad" | "grado_nombre" | "nombre_combinado";
  asc: boolean;
  onToggleSort: (k: keyof Paralelo | string) => void;
  onEdit: (p: Paralelo) => void;
  onDelete: (id: number) => void;
}

const colsP: Array<[string, string]> = [
  ["colegio", "Colegio"],
  ["unidad", "Unidad Educativa"],
  ["grado_nombre", "Grado"],
  ["letra", "Paralelo"],
  ["nombre_combinado", "Nombre"],
];

const nivelMap: Record<string, string> = {
  INI: "Inicial",
  PRI: "Primaria",
  SEC: "Secundaria",
};

const sufijos: Record<number, string> = { 1: "ro", 2: "do", 3: "ro", 4: "to", 5: "to", 6: "to" };

export default function ParalelosTable({ paralelos, grados, sortKey, asc, onToggleSort, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return paralelos;
    return paralelos.filter((p) => {
      const grado = grados.find((g) =>
        typeof p.grado === "object" && p.grado !== null ? g.id === p.grado.id : g.id === p.grado
      );
      const colegio = grado?.unidad_educativa?.colegio?.nombre ?? "";
      const unidad = grado?.unidad_educativa?.nombre ?? "";
      const gradoNombre = grado?.nombre ?? "";
      const nombreCombinado = `${grado?.numero ?? ""}${sufijos[grado?.numero ?? 0] ?? ""} ${p.letra} de ${nivelMap[grado?.nivel_educativo ?? ""] ?? ""}`;

      return (
        p.letra.toLowerCase().includes(t) ||
        gradoNombre.toLowerCase().includes(t) ||
        colegio.toLowerCase().includes(t) ||
        unidad.toLowerCase().includes(t) ||
        nombreCombinado.toLowerCase().includes(t)
      );
    });
  }, [search, paralelos, grados]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const getValue = (p: Paralelo, key: string) => {
        const grado = grados.find((g) =>
          typeof p.grado === "object" && p.grado !== null ? g.id === p.grado.id : g.id === p.grado
        );
        switch (key) {
          case "colegio":
            return grado?.unidad_educativa?.colegio?.nombre?.toLowerCase() ?? "";
          case "unidad":
            return grado?.unidad_educativa?.nombre?.toLowerCase() ?? "";
          case "grado_nombre":
            return grado?.nombre?.toLowerCase() ?? "";
          case "nombre_combinado":
            return `${grado?.numero ?? ""}${sufijos[grado?.numero ?? 0] ?? ""} ${p.letra} de ${nivelMap[grado?.nivel_educativo ?? ""] ?? ""}`.toLowerCase();
          case "letra":
            return p.letra.toLowerCase();
          default:
            return "";
        }
      };

      const A = getValue(a, sortKey);
      const B = getValue(b, sortKey);
      if (A === B) return 0;
      return asc ? (A > B ? 1 : -1) : A < B ? 1 : -1;
    });
  }, [filtered, sortKey, asc, grados]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar paralelo, grado, colegio, unidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <Table>
        <thead className="bg-blue-50 text-blue-600 select-none">
          <tr>
            {colsP.map(([key, label]) => {
              const active = sortKey === key;
              return (
                <th
                  key={key}
                  onClick={() => onToggleSort(key)}
                  className="px-4 py-3 text-center cursor-pointer"
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
              <td colSpan={colsP.length + 1} className="p-8 text-center">
                Sin paralelos
              </td>
            </tr>
          ) : (
            sorted.map((p) => {
              const grado = grados.find((g) =>
                typeof p.grado === "object" && p.grado !== null ? g.id === p.grado.id : g.id === p.grado
              );
              const colegioNombre = grado?.unidad_educativa?.colegio?.nombre ?? "-";
              const unidadNombre = grado?.unidad_educativa?.nombre ?? "-";
              const gradoNombre = grado?.nombre ?? "-";
              const paraleloLetra = p.letra;
              const nombreCombinado = `${grado?.numero ?? "-"}${sufijos[grado?.numero ?? 0] ?? ""} ${paraleloLetra} de ${
                nivelMap[grado?.nivel_educativo ?? ""] ?? ""
              }`;

              return (
                <tr key={p.id} className="hover:bg-blue-50">
                  <td className="px-4 py-3 text-center align-middle">{colegioNombre}</td>
                  <td className="px-4 py-3 text-center align-middle">{unidadNombre}</td>
                  <td className="px-4 py-3 text-center align-middle">{gradoNombre}</td>
                  <td className="px-4 py-3 text-center align-middle">{paraleloLetra}</td>
                  <td className="px-4 py-3 text-center align-middle">{nombreCombinado}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onEdit(p)} className="mr-2 text-blue-600 hover:underline">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(p.id)} className="text-red-600 hover:underline">
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
