import { useState, useEffect } from "react";
import FormModal from "@/components/FormModal";
import AxiosInstance from "@/components/AxiosInstance";
import { Materia } from "@/app/modelos/Academico";

interface Props {
  initial: Materia | null;
  onCancel: () => void;
  onSave: (m: Materia) => void;
}

export default function MateriaFormModal({ initial, onCancel, onSave }: Props) {
  const [form, setForm] = useState<{ id: number; nombre: string }>({
    id: initial?.id ?? 0,
    nombre: initial?.nombre ?? "",
  });

  useEffect(() => {
    if (initial) {
      setForm({ id: initial.id, nombre: initial.nombre });
    } else {
      setForm({ id: 0, nombre: "" });
    }
  }, [initial]);

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      alert("El nombre de la materia es obligatorio.");
      return;
    }
    try {
      let resp;
      if (form.id) {
        resp = await AxiosInstance.put(
          `/academico/materias/${form.id}/editar/`,
          { nombre: form.nombre }
        );
      } else {
        resp = await AxiosInstance.post(
          `/academico/materias/crear/`,
          { nombre: form.nombre }
        );
      }
      onSave(resp.data);
    } catch (err: any) {
      alert("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <FormModal
      title={form.id ? "Editar Materia" : "Nueva Materia"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel="Guardar"
    >
      <div>
        <label className="block mb-1">Nombre de la Materia</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          className="w-full border rounded p-2"
          placeholder="Ej. Matemática"
          autoFocus
        />
      </div>
    </FormModal>
  );
}
