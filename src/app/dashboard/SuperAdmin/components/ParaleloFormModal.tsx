import React, { useState } from "react";
import { X } from "lucide-react";
import AxiosInstance from "@/components/AxiosInstance";
import { Paralelo, Grado } from "@/app/modelos/Academico";

interface Props {
  initial: Paralelo | null;
  grados: Grado[];
  onCancel: () => void;
  onSave: (p: Paralelo) => void;
}

export default function ParaleloFormModal({ initial, grados, onCancel, onSave }: Props) {
  const [form, setForm] = useState<Paralelo>(
    initial ?? { id: 0, gradoId: 0, letra: "", capacidadMaxima: 0 }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setForm(f => ({
      ...f,
      [name]: name === 'gradoId' || name === 'capacidadMaxima' ? Number(value) : value
    }));
  };

  const handleSubmit = async () => {
    try {
      let resp;
      if (initial) {
        resp = await AxiosInstance.put(
          `/institucion/paralelos/editar/${form.id}/`,
          { grado_fk: form.gradoId, letra: form.letra, capacidad_maxima: form.capacidadMaxima }
        );
      } else {
        resp = await AxiosInstance.post(
          `/institucion/paralelos/crear/`,
          { grado_fk: form.gradoId, letra: form.letra, capacidad_maxima: form.capacidadMaxima }
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
        <h2 className="text-xl font-bold mb-4">{initial ? "Editar Paralelo" : "Nuevo Paralelo"}</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Grado</label>
            <select
              name="gradoId"
              value={form.gradoId}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value={0} disabled>Selecciona un grado</option>
              {grados.map(g => (
                <option key={g.id} value={g.id}>{g.nivelEducativo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Letra</label>
            <input
              name="letra"
              value={form.letra}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Capacidad Máxima</label>
            <input
              type="number"
              name="capacidadMaxima"
              value={form.capacidadMaxima}
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
