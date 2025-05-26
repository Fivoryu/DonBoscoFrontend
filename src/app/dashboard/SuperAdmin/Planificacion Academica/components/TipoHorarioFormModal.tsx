import { useState, useEffect } from "react";
import FormModal from "@/components/FormModal";
import AxiosInstance from "@/components/AxiosInstance";
import { TipoHorario, Turno, TURNOS } from "@/app/modelos/Calendario";

interface Props {
  initial: TipoHorario | null;
  onCancel: () => void;
  onSave: (th: TipoHorario) => void;
}



export default function TipoHorarioFormModal({ initial, onCancel, onSave }: Props) {
  // Estado local del formulario
  const [form, setForm] = useState<{
    id: number;
    nombre: string;
    descripcion: string;
    turno: Turno;
  }>(
    initial
      ? {
          id: initial?.id,
          nombre: initial.nombre,
          descripcion: initial.descripcion ?? "",
          turno: initial.turno as Turno,
        }
      : { id: 0, nombre: "", descripcion: "", turno: "Mañana" }
  );

  // Si cambian `initial`, reseteamos
  useEffect(() => {
    if (initial) {
      setForm({
        id: initial.id,
        nombre: initial.nombre,
        descripcion: initial.descripcion ?? "",
        turno: initial.turno as Turno,
      });
    } else {
      setForm({ id: 0, nombre: "", descripcion: "", turno: "Mañana" });
    }
  }, [initial]);

  // Control de inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setForm(f => ({
      ...f,
      [name]:
        name === "turno"
          ? (value as Turno)
          : value,
    }));
  };

  // Envía al backend
  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion || null,
        turno: form.turno,
      };
      let resp;
      if (form.id) {
        resp = await AxiosInstance.put(
          `/calendario/tipos-horario/editar/${form.id}/`,
          payload
        );
      } else {
        resp = await AxiosInstance.post(
          `/calendario/tipos-horario/crear/`,
          payload
        );
      }
      onSave(resp.data);
    } catch (err: any) {
      alert("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <FormModal
      title={form.id ? "Editar Tipo de Horario" : "Nuevo Tipo de Horario"}
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
          placeholder="Ej. Mañana, Tarde ..."
        />
      </div>

      <div>
        <label className="block mb-1">Descripción</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Opcional"
        />
      </div>

      <div>
        <label className="block mb-1">Turno</label>
        <select
          name="turno"
          value={form.turno}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          {TURNOS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </FormModal>
  );
}