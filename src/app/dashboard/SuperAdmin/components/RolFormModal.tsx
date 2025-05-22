import React, { useState } from "react";
import { X } from "lucide-react";
import AxiosInstance from "@/components/AxiosInstance";
import { Rol } from "@/app/modelos/Usuarios";

interface Props {
  initial: Rol | null;
  onCancel: () => void;
  onSave: (updated: Rol) => void;
}

export default function RolFormModal({ initial, onCancel, onSave }: Props) {
  const [form, setForm] = useState<Rol>(
    initial ?? new Rol({ id: 0, nombre: "", descripcion: null })
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      let resp;
      if (form.id) {
        resp = await AxiosInstance.put(
          `/user/auth/roles/editar-rol/${form.id}/`,
          { nombre: form.nombre, descripcion: form.descripcion }
        );
      } else {
        resp = await AxiosInstance.post(
          `/user/auth/roles/crear-rol/`,
          { nombre: form.nombre, descripcion: form.descripcion }
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
        <h2 className="text-xl font-bold mb-4">{form.id ? "Editar Rol" : "Nuevo Rol"}</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion || ''}
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
