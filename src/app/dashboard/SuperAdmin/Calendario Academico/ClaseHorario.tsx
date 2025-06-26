// src/app/dashboard/SuperAdmin/ClaseHorario/ClaseHorario.tsx
import  { useEffect, useState, FormEvent, ChangeEvent } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { Pencil, Trash } from "lucide-react";

interface ClaseHorario {
  id: number;
  clase: number;
  horario: number;
  fecha_inicio: string;
  fecha_fin: string | null;
}

export default function SuperadminClaseHorario() {
  const [claseHorarios, setClaseHorarios] = useState<ClaseHorario[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ClaseHorario | null>(null);
  const [form, setForm] = useState({
    clase: "",
    horario: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  useEffect(() => {
    fetchClaseHorarios();
  }, []);

  function fetchClaseHorarios() {
    AxiosInstance.get<ClaseHorario[]>("/calendario/clase-horarios/listar/")
      .then(res => setClaseHorarios(res.data))
      .catch(console.error);
  }

  function handleOpen(ch?: ClaseHorario) {
    if (ch) {
      setEditing(ch);
      setForm({
        clase: String(ch.clase),
        horario: String(ch.horario),
        fecha_inicio: ch.fecha_inicio,
        fecha_fin: ch.fecha_fin || "",
      });
    } else {
      setEditing(null);
      setForm({ clase: "", horario: "", fecha_inicio: "", fecha_fin: "" });
    }
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditing(null);
    setForm({ clase: "", horario: "", fecha_inicio: "", fecha_fin: "" });
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      clase: Number(form.clase),
      horario: Number(form.horario),
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin || undefined,
    };
    const request = editing
      ? AxiosInstance.put(`/calendario/clase-horarios/${editing.id}/editar/`, payload)
      : AxiosInstance.post(`/calendario/clase-horarios/crear/`, payload);

    request
      .then(() => {
        fetchClaseHorarios();
        handleClose();
      })
      .catch(console.error);
  }

  function handleDelete(id: number) {
    if (!confirm("¿Eliminar este Horario de Clase?")) return;
    AxiosInstance.delete(`/calendario/clase-horarios/${id}/eliminar/`)
      .then(fetchClaseHorarios)
      .catch(console.error);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Horarios de Clases
      </h2>
      <button
        onClick={() => handleOpen(undefined)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded mb-4 transition-colors duration-200"
      >
        + Nuevo Horario de Clase
      </button>

      <table className="w-full table-auto divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-50">
          <tr>
            {['ID', 'Clase', 'Horario', 'Inicio', 'Fin', 'Acciones'].map(col => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {claseHorarios.map(ch => (
            <tr key={ch.id}>
              <td className="px-4 py-2 whitespace-nowrap">{ch.id}</td>
              <td className="px-4 py-2 whitespace-nowrap">{ch.clase}</td>
              <td className="px-4 py-2 whitespace-nowrap">{ch.horario}</td>
              <td className="px-4 py-2 whitespace-nowrap">{ch.fecha_inicio}</td>
              <td className="px-4 py-2 whitespace-nowrap">{ch.fecha_fin}</td>
              <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                <button onClick={() => handleOpen(ch)}>
                  <Pencil className="w-4 h-4 text-green-600" />
                </button>
                <button onClick={() => handleDelete(ch.id)}>
                  <Trash className="w-4 h-4 text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editing ? 'Editar Horario de Clase' : 'Nuevo Horario de Clase'}
            </h3>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1">Clase (ID)</label>
                <input
                  name="clase"
                  type="number"
                  value={form.clase}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1">Horario (ID)</label>
                <input
                  name="horario"
                  type="number"
                  value={form.horario}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1">Fecha Inicio</label>
                <input
                  name="fecha_inicio"
                  type="date"
                  value={form.fecha_inicio}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1">Fecha Fin</label>
                <input
                  name="fecha_fin"
                  type="date"
                  value={form.fecha_fin}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>
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
                  {editing ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
