// src/app/dashboard/components/AcademicoTable.tsx
import { Pencil, Trash } from "lucide-react";
import { Grado } from "@/app/modelos/Academico";
import { UnidadEducativa } from "@/app/modelos/Institucion";

interface Props {
  unidadesEducativas: UnidadEducativa[];
  grados: Grado[];
  onEdit: (grado: Grado) => void;
  onDelete: (id: number) => void;
}

export default function GradoTable({ grados, onEdit, onDelete, unidadesEducativas }: Props) {
  return (
    <div className="overflow-x-auto border rounded shadow bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Nivel Educativo</th>
            <th className="px-4 py-2 text-left">Unidad Educativa</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {grados.map((grado, i) => (
            <tr key={grado.id} className="border-t">
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{grado.nivel_educativo}</td>
              <td className="px-4 py-2">{unidadesEducativas.find(u => u.id.toString() === grado.unidad_educativa.toString())?.nombre}</td>
              <td className="px-4 py-2 flex gap-2">
                <button onClick={() => onEdit(grado)} className="text-blue-600 hover:underline">
                  <Pencil size={16} />
                </button>
                <button onClick={() => onDelete(Number(grado.id))} className="text-red-600 hover:underline">
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
          {grados.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No hay grados registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

