import { useState, useEffect, useMemo } from "react";
import FormModal from "@/components/FormModal";
import AxiosInstance from "@/components/AxiosInstance";
import { TipoHorario, DIAS_SEMANA, Horario } from "@/app/modelos/Calendario";

interface Props {
  initial: Horario | null;
  tipos: TipoHorario[];
  onCancel: () => void;
  onSave: (h: Horario) => void;
}

// Rangos típicos en Bolivia
const RANGOS_TURNO: Record<string, { min: string; max: string }> = {
  MAÑANA: { min: "07:30", max: "13:00" },
  TARDE:  { min: "13:00", max: "19:00" },
  NOCHE:  { min: "19:00", max: "23:59" },
};

export default function HorarioFormModal({ initial, tipos, onCancel, onSave }: Props) {
  const [form, setForm] = useState({
    id:           initial?.id ?? 0,
    tipoId:       initial?.tipo.id ?? tipos[0]?.id ?? 0,
    hora_inicio:  initial?.hora_inicio ?? "08:00",
    hora_fin:     initial?.hora_fin ?? "09:00",
    dia:          initial?.dia ?? "LUN",
  });

  // Si cambia initial, reseteamos
  useEffect(() => {
    if (initial) {
      setForm({
        id:           initial.id,
        tipoId:       initial.tipo.id,
        hora_inicio:  initial.hora_inicio,
        hora_fin:     initial.hora_fin,
        dia:          initial.dia,
      });
    }
  }, [initial]);

  // Computa el nombre automáticamente
  const nombreAuto = useMemo(() => {
    if (!form.dia || !form.hora_inicio || !form.hora_fin) return "";
    return `${form.dia} ${form.hora_inicio}-${form.hora_fin}`;
  }, [form.dia, form.hora_inicio, form.hora_fin]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    const { tipoId, hora_inicio, hora_fin } = form;
    const tipo = tipos.find(t => t.id === tipoId);
    if (!tipo) {
      alert("Seleccione un tipo de horario válido.");
      return;
    }
    // validar orden de horas
    if (hora_inicio >= hora_fin) {
      alert("La hora de inicio debe ser anterior a la de fin.");
      return;
    }
    // validar rango según turno
    const rango = RANGOS_TURNO[tipo.turno];
    if (!rango) {
      alert("Turno no reconocido para validación de horarios.");
      return;
    }
    if (hora_inicio < rango.min || hora_inicio > rango.max) {
      alert(`La hora de inicio debe estar entre ${rango.min} y ${rango.max} para el turno ${tipo.turno_display}.`);
      return;
    }
    if (hora_fin < rango.min || hora_fin > rango.max) {
      alert(`La hora de fin debe estar entre ${rango.min} y ${rango.max} para el turno ${tipo.turno_display}.`);
      return;
    }

    try {
      const payload = {
        // enviamos nombreAuto en caso de querer guardarlo en backend
        nombre:       nombreAuto,
        tipo:         tipoId,
        hora_inicio:  hora_inicio,
        hora_fin:     hora_fin,
        dia:          form.dia,
      };
      let resp;
      if (form.id) {
        resp = await AxiosInstance.put(`/calendario/horarios/editar/${form.id}/`, payload);
      } else {
        resp = await AxiosInstance.post(`/calendario/horarios/crear/`, payload);
      }
      onSave(resp.data);
    } catch (err: any) {
      alert("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <FormModal
      title={form.id ? "Editar Horario" : "Nuevo Horario"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel="Guardar"
    >
      {/* Nombre automático (solo lectura) */}
      <div>
        <label className="block mb-1">Nombre</label>
        <input
          type="text"
          value={nombreAuto}
          readOnly
          className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block mb-1">Descripción</label>
        <textarea
          name="descripcion"
          onChange={handleChange}
          className="w-full border rounded p-2"
          rows={2}
          placeholder="Opcional"
        />
      </div>

      {/* Tipo de Horario */}
      <div>
        <label className="block mb-1">Tipo de Horario</label>
        <select
          name="tipoId"
          value={form.tipoId}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          {tipos.map(t => (
            <option key={t.id} value={t.id}>
              {t.nombre} ({t.turno_display})
            </option>
          ))}
        </select>
      </div>

      {/* Horas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Hora de Inicio</label>
          <input
            type="time"
            name="hora_inicio"
            value={form.hora_inicio}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Hora de Fin</label>
          <input
            type="time"
            name="hora_fin"
            value={form.hora_fin}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      {/* Día de la semana */}
      <div>
        <label className="block mb-1">Día de la semana</label>
        <select
          name="dia"
          value={form.dia}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="" disabled>
            Seleccione un día
          </option>
          {DIAS_SEMANA.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </FormModal>
  );
}