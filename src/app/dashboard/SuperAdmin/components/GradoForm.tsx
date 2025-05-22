// src/app/dashboard/components/AcademicoForm.tsx
import { useState } from "react";
import { Grado } from "@/app/modelos/Academico";
import { UnidadEducativa } from "@/app/modelos/Institucion";

interface Props {
  initial?: Grado;
  grados: Grado[];
  unidadesEducativas: UnidadEducativa[];
  onSave: (grado: Grado) => void;
  onCancel: () => void;
}

export default function GradoForm({ initial, onSave, onCancel, unidadesEducativas }: Props) {
  const [form, setForm] = useState<Grado>(
    initial ?? { id: 0, nivel_educativo: "", unidad_educativa: "" }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded space-y-4 bg-white shadow">

      {/* nivel educativo */}
       <div className="md:col-span-2">
          <label className="block mb-1">Nivel Educativo</label>
          <select
            value={form.nivel_educativo}
            onChange={e => setForm({ ...form, nivel_educativo: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccione un Nivel Educativo</option>
            <option value="INI">Inicial</option>
            <option value="PRI">Primaria</option>
            <option value="SEC">Secundaria</option>
          </select>
        </div>

      {/* unidad educativa */}
      <div className="md:col-span-2">
        <label className="block mb-1">Seleccione una Unidad Educativa</label>
        <select
          value={form.unidad_educativa}
          onChange={e => setForm({ ...form, unidad_educativa: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Seleccione una Unidad Educativa</option>
          {unidadesEducativas.map(u => (
            <option key={u.id} value={u.id}>
              {u.nombre}
            </option>
          ))}
        </select>
      </div>



      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Guardar
        </button>
      </div>
    </form>
  );
}
