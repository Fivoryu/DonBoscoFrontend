import React, { useState } from "react";
import { X } from "lucide-react";
import AxiosInstance from "@/components/AxiosInstance";
import { Grado } from "@/app/modelos/Academico";
import { UnidadEducativa } from "@/app/modelos/Institucion";

interface Props {
  initial: Grado | null;
  unidades: UnidadEducativa[];
  onCancel: () => void;
  onSave: (g: Grado) => void;
}

export default function GradoFormModal({ initial, unidades, onCancel, onSave }: Props) {
  const [form, setForm] = useState<Grado>(
    initial ?? { id: 0, nivelEducativo: 'INI', unidadEducativaId: 0 }
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setForm(f => ({ ...f, [name]: name === 'unidadEducativaId' ? Number(value) : value }));
  };

  const handleSubmit = async () => {
    try {
      let resp;
      const payload = { nivel_educativo: form.nivelEducativo, unidad_educativa: form.unidadEducativaId };
      if (form.id) {
        resp = await AxiosInstance.put(`/academico/editar-grado/${form.id}/`, payload);
      } else {
        resp = await AxiosInstance.post(`/academico/crear-grado/`, payload);
      }
      onSave(resp.data);
    } catch (err: any) {
      alert("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
        <button onClick={onCancel} className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">{form.id ? "Editar Grado" : "Nuevo Grado"}</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Nivel Educativo</label>
            <select name="nivelEducativo" value={form.nivelEducativo} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Seleccione un nivel</option>
              <option value="INI">Inicial</option>
              <option value="PRI">Primaria</option>
              <option value="SEC">Secundaria</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Unidad Educativa</label>
            <select name="unidadEducativaId" value={form.unidadEducativaId} onChange={handleChange} className="w-full border rounded p-2">
              <option value={0} disabled>Seleccione unidad</option>
              {unidades.map(u => (
                <option key={u.id} value={u.id}>{u.nombre}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
}
