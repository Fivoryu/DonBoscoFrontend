// src/components/FeriadoManager.tsx
import  { useEffect, useState, ChangeEvent, FormEvent } from "react";
import AxiosInstance from "@/components/AxiosInstance";

export interface Feriado {
  id: number;
  tipo: { id:number; nombre:string; };
  nombre: string;
  descripcion: string | null;
  fecha: string;
}

interface FeriadoForm {
  calendario: number;
  tipo_id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
}

export function FeriadoManager({ calendarioId }: { calendarioId: number }) {
  const [feriados, setFeriados] = useState<Feriado[]>([]);
  const [tipos, setTipos] = useState<{ id:number; nombre:string }[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Feriado|null>(null);
  const [form, setForm] = useState<FeriadoForm>({
    calendario: calendarioId,
    tipo_id: 0,
    nombre: "",
    descripcion: "",
    fecha: "",
  });

  useEffect(() => {
    fetchFeriados();
    fetchTipos();
  }, []);

  function fetchTipos() {
    AxiosInstance.get("/calendario/tipos-feriado/listar/")
      .then(res => setTipos(res.data))
      .catch(console.error);
  }

  function fetchFeriados() {
    AxiosInstance.get<Feriado[]>(`/calendario/feriados/listar/?calendario=${calendarioId}`)
      .then(res => setFeriados(res.data))
      .catch(console.error);
  }

  function handleOpen(f?: Feriado) {
    if (f) {
      setEditing(f);
      setForm({
        calendario: calendarioId,
        tipo_id: f.tipo.id,
        nombre: f.nombre,
        descripcion: f.descripcion||"",
        fecha: f.fecha,
      });
    } else {
      setEditing(null);
      setForm({ calendario: calendarioId, tipo_id:0, nombre:"", descripcion:"", fecha:"" });
    }
    setOpen(true);
  }

  function handleClose() { setOpen(false); setEditing(null); }

  function handleChange(e: ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name==="tipo_id" ? Number(value) : value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { calendario, ...body } = form;
    const req = editing
      ? AxiosInstance.put(`/calendario/feriados/${editing.id}/editar/`, body)
      : AxiosInstance.post("/calendario/feriados/crear/", { calendario, ...body });

    req.then(() => { fetchFeriados(); handleClose(); }).catch(console.error);
  }

  function handleDelete(id:number) {
    if (!confirm("Eliminar feriado?")) return;
    AxiosInstance.delete(`/calendario/feriados/${id}/eliminar/`)
      .then(fetchFeriados).catch(console.error);
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex justify-between items-center mb-2">
        <h5 className="font-semibold">Feriados</h5>
        <button onClick={() => handleOpen()} className="text-sm text-blue-600">+ Nuevo</button>
      </div>
      <table className="w-full text-sm mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-1">Tipo</th><th className="p-1">Nombre</th><th className="p-1">Fecha</th><th className="p-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {feriados.map(f => (
            <tr key={f.id} className="border-b">
              <td className="p-1">{f.tipo.nombre}</td>
              <td className="p-1">{f.nombre}</td>
              <td className="p-1">{f.fecha}</td>
              <td className="p-1 space-x-2">
                <button onClick={() => handleOpen(f)} className="text-blue-600">Editar</button>
                <button onClick={() => handleDelete(f.id)} className="text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
          {!feriados.length && (<tr><td colSpan={4} className="p-2 text-center text-gray-500">Sin feriados</td></tr>)}
        </tbody>
      </table>

      {open && (
        <div className="space-y-2 mb-4">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label>Tipo de feriado</label>
              <select
                name="tipo_id"
                value={form.tipo_id}
                onChange={handleChange}
                className="border p-1"
                required
              >
                <option value={0}>-- elige --</option>
                {tipos.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="border p-1 w-full"
                required
              />
            </div>
            <div>
              <label>Descripción</label>
              <input
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </div>
            <div>
              <label>Fecha</label>
              <input
                name="fecha"
                type="date"
                value={form.fecha}
                onChange={handleChange}
                className="border p-1"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handleClose} className="px-2 py-1 bg-gray-200">Cancelar</button>
              <button type="submit" className="px-2 py-1 bg-blue-600 text-white">{editing ? "Actualizar" : "Crear"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
