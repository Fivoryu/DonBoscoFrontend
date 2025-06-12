// src/app/dashboard/SuperAdmin/Calendario Academico/CaledarioAcademico.tsx
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { UnidadEducativa } from "../../../modelos/Institucion";
import { PeriodoManager } from "./PeriodoManager";
import { FeriadoManager } from "./FeriadoManager";

interface Calendario {
  id: number;
  unidad_educativa: number;
  unidad_educativa_nombre: string;
  año: number;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
  periodos: any[];
  feriados: any[];
}

interface CalendarioForm {
  unidad_educativa: number | "";
  año: string | number;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export default function CalendarioAcademico() {
  const [unidades, setUnidades] = useState<UnidadEducativa[]>([]);
  const [calendarios, setCalendarios] = useState<Calendario[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Calendario | null>(null);
  const [form, setForm] = useState<CalendarioForm>({
    unidad_educativa: "",
    año: "",
    fecha_inicio: "",
    fecha_fin: "",
    activo: false,
  });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchCalendarios();
    AxiosInstance.get<UnidadEducativa[]>("/institucion/unidades-educativas/listar/")
      .then(res => setUnidades(res.data))
      .catch(console.error);
  }, []);

  function fetchCalendarios() {
    AxiosInstance.get<Calendario[]>("/calendario/calendarios/listar/")
      .then(res => setCalendarios(res.data))
      .catch(console.error);
  }

  function handleOpen(cal?: Calendario) {
    if (cal) {
      setEditing(cal);
      setForm({
        unidad_educativa: cal.unidad_educativa,
        año: cal.año,
        fecha_inicio: cal.fecha_inicio,
        fecha_fin: cal.fecha_fin,
        activo: cal.activo,
      });
    } else {
      setEditing(null);
      setForm({ unidad_educativa: "", año: "", fecha_inicio: "", fecha_fin: "", activo: false });
    }
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditing(null);
    setForm({ unidad_educativa: "", año: "", fecha_inicio: "", fecha_fin: "", activo: false });
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) {
    const target = e.target;
    const name = target.name;
    let value: string | boolean = target instanceof HTMLInputElement && target.type === "checkbox"
      ? target.checked
      : target.value;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      unidad_educativa: Number(form.unidad_educativa),
      año: Number(form.año),
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin,
      activo: form.activo,
    };
    const req = editing
      ? AxiosInstance.put(`/calendario/calendarios/${editing.id}/editar/`, payload)
      : AxiosInstance.post("/calendario/calendarios/crear/", payload);

    req.then(() => {
      fetchCalendarios();
      handleClose();
    }).catch(console.error);
  }

  function handleDelete(id: number) {
    if (!confirm("¿Eliminar este calendario?")) return;
    AxiosInstance.delete(`/calendario/calendarios/${id}/eliminar/`)
      .then(fetchCalendarios)
      .catch(console.error);
  }

  const toggleExpand = (id: number) =>
    setExpandedId(expandedId === id ? null : id);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Calendario Académico</h2>
      <button onClick={() => handleOpen(undefined)}>+ Nuevo Calendario</button>

      <table className="min-w-full text-sm bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4">Año</th>
            <th className="py-2 px-4">Unidad Educativa</th>
            <th className="py-2 px-4">Inicio</th>
            <th className="py-2 px-4">Fin</th>
            <th className="py-2 px-4">Activo</th>
            <th className="py-2 px-4">#P</th>
            <th className="py-2 px-4">#F</th>
            <th className="py-2 px-4">Det.</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {calendarios.map(c => (
            <React.Fragment key={c.id}>
              <tr className="border-b">
                <td className="px-4 py-2">{c.año}</td>
                <td className="px-4 py-2">{c.unidad_educativa_nombre}</td>
                <td className="px-4 py-2">{c.fecha_inicio}</td>
                <td className="px-4 py-2">{c.fecha_fin}</td>
                <td className="px-4 py-2">{c.activo ? "Sí" : "No"}</td>
                <td className="px-4 py-2">{c.periodos.length}</td>
                <td className="px-4 py-2">{c.feriados.length}</td>
                <td className="px-4 py-2">
                  <button onClick={() => toggleExpand(c.id)} className="text-blue-600">
                    {expandedId === c.id ? "▼" : "▶"}
                  </button>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => handleOpen(c)} className="text-blue-600 hover:underline">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                </td>
              </tr>
              {expandedId === c.id && (
                <tr>
                  <td colSpan={9} className="bg-gray-50 p-4">
                    <PeriodoManager calendarioId={c.id} />
                    <FeriadoManager calendarioId={c.id} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {calendarios.length === 0 && (
            <tr>
              <td colSpan={9} className="py-4 text-center text-gray-400">
                Sin registros
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">
              {editing ? "Editar Calendario" : "Nuevo Calendario"}
            </h3>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1">Unidad Educativa</label>
                <select
                  name="unidad_educativa"
                  value={form.unidad_educativa}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">-- Selecciona unidad --</option>
                  {unidades.map(u => (
                    <option key={u.id} value={u.id}>{u.nombre}</option>
                  ))}
                </select>
              </div>
              <input
                name="año"
                value={form.año}
                onChange={handleChange}
                placeholder="Año"
                type="number"
                className="border rounded p-2"
                required
              />
              <input
                name="fecha_inicio"
                value={form.fecha_inicio}
                onChange={handleChange}
                type="date"
                className="border rounded p-2"
                required
              />
              <input
                name="fecha_fin"
                value={form.fecha_fin}
                onChange={handleChange}
                type="date"
                className="border rounded p-2"
                required
              />
              <label className="flex gap-2 items-center mt-2">
                <input
                  name="activo"
                  type="checkbox"
                  checked={form.activo}
                  onChange={handleChange}
                />
                Activo
              </label>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-1 rounded"
                  onClick={handleClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  {editing ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
