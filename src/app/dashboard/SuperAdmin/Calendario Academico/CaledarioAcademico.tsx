// src/app/dashboard/SuperAdmin/Calendario Academico/CaledarioAcademico.tsx
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { UnidadEducativa } from "../../../modelos/Institucion";
import { PeriodoManager } from "./PeriodoManager";
import { FeriadoManager } from "./FeriadoManager";
import { TipoFeriadoManager } from "./TipoFeriadoManager";
import { Pencil, Trash } from "lucide-react";

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

    const añoNum = Number(form.año);
    const inicio = new Date(form.fecha_inicio);
    const fin = new Date(form.fecha_fin);

    // Extraer el año de las fechas
    const añoInicio = inicio.getFullYear();
    const añoFin = fin.getFullYear();

    if (añoInicio !== añoNum || añoFin !== añoNum) {
      alert(
        `El año debe coincidir con el año de las fechas:\n` +
        `· Año ingresado: ${añoNum}\n` +
        `· Fecha inicio: ${form.fecha_inicio} (año ${añoInicio})\n` +
        `· Fecha fin:    ${form.fecha_fin} (año ${añoFin})`
      );
      return;
    }

    // Si pasa la validación, armar payload y enviar
    const payload = {
      unidad_educativa: Number(form.unidad_educativa),
      año: añoNum,
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin,
      activo: form.activo,
    };
    console.log("Payload:", payload);
    const req = editing
      ? AxiosInstance.put(`/calendario/calendarios/${editing!.id}/editar/`, payload)
      : AxiosInstance.post("/calendario/calendarios/crear/", payload);

    req
      .then(() => {
        fetchCalendarios();
        handleClose();
      })
      .catch(console.error);
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
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Calendario Académico
      </h2>

      <button
        onClick={() => handleOpen(undefined)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition-colors"
      >
        + Nuevo Calendario
      </button>

      <table className="w-full table-auto divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-50 sticky top-0">
          <tr>
            {["Año", "Unidad", "Inicio", "Fin", "Activo", "#P", "#F", "Det.", "Acciones"].map(col => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {calendarios.map(c => (
            <React.Fragment key={c.id}>
              <tr className="odd:bg-gray-50 hover:bg-gray-100 transition">
                <td className="px-4 py-2 text-sm">{c.año}</td>
                <td className="px-4 py-2 text-sm">{c.unidad_educativa_nombre}</td>
                <td className="px-4 py-2 text-sm">{c.fecha_inicio}</td>
                <td className="px-4 py-2 text-sm">{c.fecha_fin}</td>
                <td className="px-4 py-2 text-sm">
                  <span className={c.activo ? "text-green-600 font-semibold" : "text-gray-500"}>
                    {c.activo ? "Sí" : "No"}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">{c.periodos.length}</td>
                <td className="px-4 py-2 text-sm">{c.feriados.length}</td>
                <td className="px-4 py-2 text-sm">
                  <button
                    onClick={() => toggleExpand(c.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {expandedId === c.id ? "▼" : "▶"}
                  </button>
                </td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <button
                    onClick={() => handleOpen(c)}
                    className="p-1 hover:bg-blue-100 rounded"
                    title="Editar"
                  >
                    <Pencil className="h-5 w-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1 hover:bg-red-100 rounded"
                    title="Eliminar"
                  >
                    <Trash className="h-5 w-5 text-red-600" />
                  </button>
                </td>
              </tr>

              {expandedId === c.id && (
                <tr>
                  <td colSpan={9} className="bg-gray-50 p-4">
                    <PeriodoManager calendarioId={c.id} />
                    <TipoFeriadoManager calendarioId={c.id} />
                    <FeriadoManager calendarioId={c.id} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}

          {calendarios.length === 0 && (
            <tr>
              <td colSpan={9} className="py-6 text-center text-gray-400">
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
                  onInvalid={(e) =>
                    (e.currentTarget as HTMLSelectElement).setCustomValidity(
                      "Por favor, elige una unidad educativa"
                    )
                  }
                  onInput={(e) =>
                    (e.currentTarget as HTMLSelectElement).setCustomValidity("")
                  }
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
                min={2000}                // ← aquí indicamos el valor mínimo
                step={1}
                value={form.año}
                onChange={handleChange}
                onInvalid={(e) =>
                  // Cuando falla la validación, mete aquí tu texto en español
                  (e.currentTarget as HTMLInputElement).setCustomValidity(
                    "Por favor, completa un año '2000' o superior"
                  )
                }
                onInput={(e) =>
                  // Al empezar a escribir, limpia el mensaje para permitir
                  // nueva validación en caso de fallar de nuevo
                  (e.currentTarget as HTMLInputElement).setCustomValidity("")
                }
                placeholder="Año"
                type="number"
                className="border rounded p-2"
                required
              />
              <input
                name="fecha_inicio"
                value={form.fecha_inicio}
                onChange={handleChange}
                onInvalid={(e) =>
                  (e.currentTarget as HTMLInputElement).setCustomValidity(
                    "Por favor, selecciona la fecha de inicio"
                  )
                }
                onInput={(e) =>
                  (e.currentTarget as HTMLInputElement).setCustomValidity("")
                }
                type="date"
                className="border rounded p-2"
                required
              />
              <input
                name="fecha_fin"
                value={form.fecha_fin}
                onChange={handleChange}
                onInvalid={(e) =>
                  (e.currentTarget as HTMLInputElement).setCustomValidity(
                    "Por favor, selecciona la fecha de inicio"
                  )
                }
                onInput={(e) =>
                  (e.currentTarget as HTMLInputElement).setCustomValidity("")
                }
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition-colors duration-200"
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
