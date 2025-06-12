// src/components/FeriadoManager.tsx
import  { useEffect, useState, ChangeEvent, FormEvent } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { Pencil, Trash } from "lucide-react";
export interface Feriado {
  id: number;
  tipo: { id: number; nombre: string };
  nombre: string;
  descripcion: string | null;
  fecha: string;
  calendario: number;  
}

interface FeriadoForm {
  calendario: number;
  tipo: number;        // <-- antes era tipo_id
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
    tipo: 0,
    nombre: "",
    descripcion: "",
    fecha: "",
  });

  useEffect(() => {
    fetchFeriados();
    fetchTipos();
  }, []);

  function fetchTipos() {
  AxiosInstance.get<{ id: number; nombre: string }[]>(
    `/calendario/tipos-feriado/listar/?calendario=${calendarioId}`
  )
  .then(res => setTipos(res.data))
  .catch(console.error);
}


  function fetchFeriados() {
   AxiosInstance
     // 2) Traemos todos y luego los filtramos en el cliente
     .get<Feriado[]>("/calendario/feriados/listar/")
     .then(res => {
       // Sólo nos quedamos con los del calendario actual:
       const sóloEste = res.data.filter(f => f.calendario === calendarioId);
       setFeriados(sóloEste);
     })
     .catch(console.error);
}

  function handleOpen(f?: Feriado) {
    if (f) {
      setEditing(f);
      setForm({
        calendario: calendarioId,
        tipo:       f.tipo.id,      // <-- mapeamos a f.tipo.id
        nombre:     f.nombre,
        descripcion: f.descripcion || "",
        fecha:      f.fecha,
      });
    } else {
      setEditing(null);
      setForm({ calendario: calendarioId, tipo:0, nombre:"", descripcion:"", fecha:"" });
    }
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditing(null);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === "tipo" ? Number(value) : value
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { calendario, tipo, nombre, descripcion, fecha } = form;
    const payload = { calendario, tipo, nombre, descripcion, fecha };

    const req = editing
      ? AxiosInstance.put(`/calendario/feriados/${editing.id}/editar/`, payload)
      : AxiosInstance.post("/calendario/feriados/crear/", payload);

    req
      .then(() => { fetchFeriados(); handleClose(); })
      .catch(console.error);
  }

  function handleDelete(id:number) {
    if (!confirm("Eliminar feriado?")) return;
    AxiosInstance.delete(`/calendario/feriados/${id}/eliminar/`)
      .then(fetchFeriados)
      .catch(console.error);
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex justify-between items-center mb-2">
         <h3 className="text-2xl font-bold mb-4 text-blue-600">Feriados</h3>
        <button onClick={() => handleOpen()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition-colors">+ Nuevo Feriado</button>
      </div>
      <table className="w-full text-sm mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Tipo</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Fecha</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {feriados.map(f => (
            <tr key={f.id} className="border-b">
              <td className="p-1">{f.tipo.nombre}</td>
              <td className="p-1">{f.nombre}</td>
              <td className="p-1">{f.fecha}</td>
              
              <td className="px-4 py-2 flex items-center gap-2">
                <button
                  onClick={() => handleOpen(f)}
                  className="p-1 hover:bg-blue-100 rounded"
                  title="Editar"
                >
                  <Pencil className="h-5 w-5 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="p-1 hover:bg-red-100 rounded"
                  title="Eliminar"
                >
                  <Trash className="h-5 w-5 text-red-600" />
                </button>
              </td>
            </tr>
          ))}
          {!feriados.length && (
            <tr>
              <td colSpan={4} className="p-2 text-center text-gray-500">Sin feriados</td>
            </tr>
          )}
        </tbody>
      </table>

      {open && (
        <div className="space-y-2 mb-4">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label>Tipo de feriado</label>
              <select
                name="tipo"                       // <-- cambió a "tipo"
                value={form.tipo}
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
              <button type="button" onClick={handleClose} className="px-2 py-1 bg-gray-200">
                Cancelar
              </button>
              <button type="submit" className="px-2 py-1 bg-blue-600 text-white">
                {editing ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
