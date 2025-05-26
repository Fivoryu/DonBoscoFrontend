import React, { useState } from "react";
import { X } from "lucide-react";
import AxiosInstance from "@/components/AxiosInstance";
import { Curso, Paralelo } from "@/app/modelos/Academico";

interface Props {
  initial: Curso | null;
  paralelos: Paralelo[];
  onCancel: () => void;
  onSave: (c: Curso) => void;
}

export default function CursoFormModal({ initial, paralelos, onCancel, onSave }: Props) {
  const [form, setForm] = useState<Curso>(
    initial ?? { paraleloId: 0, nombre: "" }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setForm(f => ({ ...f, [name]: name === 'paraleloId' ? Number(value) : value }));
  };

  const handleSubmit = async () => {
    try {
      let resp;
      if (initial) {
        resp = await AxiosInstance.put(
          `/institucion/cursos/editar/${form.paraleloId}/`,
          { nombre: form.nombre }
        );
      } else {
        resp = await AxiosInstance.post(
          `/institucion/cursos/crear/`,
          { paralelo_fk: form.paraleloId, nombre: form.nombre }
        );
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
        <h2 className="text-xl font-bold mb-4">{initial ? "Editar Curso" : "Nuevo Curso"}</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Paralelo</label>
            <select
              name="paraleloId"
              value={form.paraleloId}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value={0} disabled>Selecciona un paralelo</option>
              {paralelos.map(p => (
                <option key={p.id} value={p.id}>{p.letra}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Nombre Curso</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
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