import React, { useState, useEffect } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import FormModal from "@/components/FormModal";
import { Modulo } from "@/app/modelos/Institucion";
import { Admin } from "@/app/modelos/Usuarios"; // importa Admin

interface Props {
  initial: Modulo | null;
  admin: Admin | null; // <-- nuevo prop opcional
  onCancel: () => void;
  onSave: (m: Modulo) => void;
}

export default function ModuloFormModal({ initial, admin, onCancel, onSave }: Props) {
  const [form, setForm] = useState<Modulo>({
    id: 0,
    nombre: "",
    cantidadAulas: 0,
    aulasOcupadas: 0,
    descripcion: "",
    colegioId: undefined,
    pisos: 0,
    ...initial,
  });

  useEffect(() => {
    if (initial) {
      setForm((f) => ({ ...f, ...initial }));
    } else if (admin?.unidad?.colegio?.id) {
      // Solo al crear, no al editar
      setForm((f) => ({
        ...f,
        colegioId: admin.unidad.colegio.id
      }));
    }
  }, [initial, admin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: (name === "cantidadAulas" || name === "pisos" || name === "colegioId")
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = {
        nombre: form.nombre,
        cantidad_aulas: form.cantidadAulas,
        descripcion: form.descripcion,
        colegio_fk: form.colegioId,
        pisos: form.pisos
      };
      let resp;
      if (form.id && form.id !== 0)
        resp = await AxiosInstance.put(`/institucion/modulos/${form.id}/editar/`, data);
      else resp = await AxiosInstance.post(`/institucion/modulos/crear/`, data);
      onSave(resp.data);
    } catch (e: any) {
      alert("Error: " + JSON.stringify(e.response?.data || e.message));
    }
  };

  return (
    <FormModal
      title={form.id && form.id !== 0 ? "Editar Módulo" : "Nuevo Módulo"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel="Guardar"
    >
      <div>
        <label className="block mb-1">Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Colegio</label>
        <input
          type="text"
          value={admin?.unidad?.colegio?.nombre || ""}
          disabled
          className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
        />
        <input
          type="hidden"
          name="colegioId"
          value={form.colegioId ?? ""}
        />
      </div>

      <div>
        <label className="block mb-1">Pisos</label>
        <input 
          type="number"
          name="pisos"
          value={form.pisos}
          onChange={handleChange}
          className="w-full border rounded p-2"
          min={1}
          required
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
          min={1}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Aulas Ocupadas</label>
        <input
          type="number"
          value={form.aulasOcupadas ?? 0}
          disabled
          className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block mb-1">Descripción</label>
        <input
          name="descripcion"
          value={form.descripcion || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
    </FormModal>
  );
}
