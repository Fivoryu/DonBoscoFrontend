import React, { useState } from "react";
import { X } from "lucide-react";
import AxiosInstance from "@/components/AxiosInstance";
import { Aula } from "@/app/modelos/Institucion";

interface Props {
  initial: Aula | null;
  onCancel: () => void;
  onSave: (updated: Aula) => void;
}

export default function AulaFormModal({ initial, onCancel, onSave }: Props) {
  const [form, setForm] = useState<Aula>(
    initial ?? { id: 0, nombre: "", capacidad: 0, tipo: "AUL", estado: true }
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setForm(f => ({ ...f, [name]: name === 'capacidad' ? Number(value) : value }));
  };
  const handleSubmit = async () => {
    try {
      const data = { nombre: form.nombre, capacidad: form.capacidad, tipo: form.tipo, estado: form.estado };
      let resp;
      if (form.id) resp = await AxiosInstance.put(`/institucion/aulas/editar/${form.id}/`, data);
      else resp = await AxiosInstance.post(`/institucion/aulas/crear/`, data);
      onSave(resp.data);
    } catch (e: any) {
      alert("Error: " + JSON.stringify(e.response?.data || e.message));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white max-w-md w-full p-6 rounded-xl shadow-lg relative">
        <button onClick={onCancel} className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">{form.id ? "Editar Aula" : "Nueva Aula"}</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block mb-1">Capacidad</label>
            <input type="number" name="capacidad" value={form.capacidad} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block mb-1">Tipo</label>
            <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full border rounded p-2">
              <option value="AUL">AUL</option><option value="LAB">LAB</option><option value="TAL">TAL</option>
              <option value="AUD">AUD</option><option value="COM">COM</option><option value="GIM">GIM</option>
              <option value="BIB">BIB</option>
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