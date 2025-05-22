import React, { useState } from "react";
import { X } from "lucide-react";
import AxiosInstance from "@/components/AxiosInstance";
import { Modulo } from "@/app/modelos/Institucion";

interface Props { initial: Modulo|null; onCancel:()=>void; onSave:(m:Modulo)=>void; }
export default function ModuloFormModal({initial,onCancel,onSave}:Props){
  const [form,setForm]=useState<Modulo>(initial??{id:0,nombre:'',cantidadAulas:0});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === 'cantidadAulas' ? Number(value) : value
    }));
  };
  const handleSubmit = async () => {
    try {
      const data = {
        nombre: form.nombre,
        cantidadAulas: form.cantidadAulas,
        descripcion: form.descripcion,
        colegioId: form.colegioId,
      };
      let resp;
      if (form.id)
        resp = await AxiosInstance.put(
          `/user/auth/modulos/editar-modulo/${form.id}/`,
          data
        );
      else
        resp = await AxiosInstance.post(
          `/user/auth/modulos/crear-modulo/`,
          data
        );
      onSave(resp.data);
    } catch (e: any) {
      alert("Error: " + JSON.stringify(e.response?.data || e.message));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white max-w-md w-full p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">
          {form.id ? "Editar Módulo" : "Nuevo Módulo"}
        </h2>
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
            <label className="block mb-1"># Aulas</label>
            <input
              type="number"
              name="cantidadAulas"
              value={form.cantidadAulas}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}