import React, { useState } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { Paralelo, Grado } from "@/app/modelos/Academico";
import FormModal from "@/components/FormModal";

interface Props {
  initial: Paralelo | null;
  grados: Grado[];
  paralelos: Paralelo[];
  onCancel: () => void;
  onSave: (p: Paralelo) => void;
}

export default function ParaleloFormModal({ initial, grados, paralelos, onCancel, onSave }: Props) {
  const [form, setForm] = useState<Paralelo>(
    initial ?? (grados.length > 0 ? { id: 0, grado: grados[0], letra: "" } : { id: 0, grado: 0, letra: "" })
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setForm(f => ({
      ...f,
      [name]: name === "grado" ? 
        (value === "" ? null : grados.find(g => g.id === Number(value)) ?? null)
        : value
    }));
  };

  const handleSubmit = async () => {
    if (!form.grado || typeof form.grado === "number") {
      alert("Debes seleccionar un grado válido.");
      return;
    }

    const gradoId = form.grado.id;

    const existe = paralelos.some(p =>
      (typeof p.grado === "object" ? p.grado.id : p.grado) === gradoId &&
      p.letra.toLowerCase() === form.letra.toLowerCase() &&
      p.id !== form.id
    );

    if (existe) {
      alert(`El paralelo "${form.letra}" ya existe para ese grado.`);
      return;
    }

    try {
      const payload = {
        grado: gradoId,
        letra: form.letra,
      };

      let resp;
      if (initial) {
        resp = await AxiosInstance.put(`/academico/paralelos/editar/${form.id}/`, payload);
      } else {
        resp = await AxiosInstance.post(`/academico/paralelos/crear/`, payload);
      }

      const saved: Paralelo = {
        id: resp.data.id,
        grado: resp.data.grado,
        letra: resp.data.letra,
      };

      onSave(saved);
    } catch (err: any) {
      alert("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <FormModal
      title={initial ? "Editar Paralelo" : "Nuevo Paralelo"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label className="block mb-1">Grado</label>
        <select
          name="grado"
          value={typeof form.grado === "object" && form.grado !== null ? form.grado.id : ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Selecciona un grado</option>
          {grados.map(g => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
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
          autoFocus
        />
      </div>
    </FormModal>
  );
}
