// src/app/dashboard/SuperAdmin/Calendario Académico/TipoFeriadoManager.tsx
import  { useEffect, useState, ChangeEvent, FormEvent } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { Pencil, Trash } from "lucide-react";
export interface TipoFeriado {
  id: number;
  nombre: string;
  descripcion: string | null;
  es_nacional: boolean;
}

interface TipoFeriadoForm {
  nombre: string;
  descripcion: string;
  es_nacional: boolean;
}

export function TipoFeriadoManager({ calendarioId }: { calendarioId: number }) {
  const [tipos, setTipos] = useState<TipoFeriado[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TipoFeriado | null>(null);
  const [form, setForm] = useState<TipoFeriadoForm>({
    nombre: "",
    descripcion: "",
    es_nacional: false,
  });

  useEffect(() => {
    fetchTipos();
  }, []);

  function fetchTipos() {
    AxiosInstance
      .get<TipoFeriado[]>(`/calendario/tipos-feriado/listar/?calendario=${calendarioId}`)
      .then(res => setTipos(res.data))
      .catch(console.error);
  }

  function handleOpen(tipo?: TipoFeriado) {
    if (tipo) {
      setEditing(tipo);
      setForm({
        nombre: tipo.nombre,
        descripcion: tipo.descripcion || "",
        es_nacional: tipo.es_nacional,
      });
    } else {
      setEditing(null);
      setForm({ nombre: "", descripcion: "", es_nacional: false });
    }
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditing(null);
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const target = e.target as HTMLInputElement;  // forzamos a HTMLInputElement
    const name = target.name;
    const valueOrChecked =
      target.type === "checkbox"
        ? target.checked
        : (e.target as HTMLInputElement | HTMLTextAreaElement).value;

    setForm(prev => ({
      ...prev,
      [name]: valueOrChecked,
    }));
  }


  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = { ...form, calendario: calendarioId };
    const req = editing
      ? AxiosInstance.put(`/calendario/tipos-feriado/${editing.id}/editar/`, payload)
      : AxiosInstance.post("/calendario/tipos-feriado/crear/", payload);

    req.then(() => {
      fetchTipos();
      handleClose();
    }).catch(console.error);
  }

  function handleDelete(id: number) {
    if (!confirm("¿Eliminar este tipo de feriado?")) return;

    AxiosInstance.delete(`/calendario/tipos-feriado/${id}/eliminar/`)
      .then(fetchTipos)
      .catch(console.error);
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold mb-4 text-blue-600">Tipos de Feriado</h3>
        <button onClick={() => handleOpen()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition-colors">+ Nuevo Tipo de Feriado

        </button>
      </div>
      <table className="w-full text-sm mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Nacional</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tipos.map(t => (
            <tr key={t.id} className="border-b">
              <td className="p-1">{t.nombre}</td>
              <td className="p-1">{t.es_nacional ? "Sí" : "No"}</td>

              <td className="px-4 py-2 flex items-center gap-2">
                <button
                  onClick={() => handleOpen(t)}
                  className="p-1 hover:bg-blue-100 rounded"
                  title="Editar"
                >
                  <Pencil className="h-5 w-5 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1 hover:bg-red-100 rounded"
                  title="Eliminar"
                >
                  <Trash className="h-5 w-5 text-red-600" />
                </button>
              </td>
            </tr>
          ))}
          {!tipos.length && (
            <tr>
              <td colSpan={3} className="p-2 text-center text-gray-500">Sin tipos</td>
            </tr>
          )}
        </tbody>
      </table>

      {open && (
        <div className="space-y-2 mb-4">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="block">Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="border p-1 w-full"
                required
              />
            </div>
            <div>
              <label className="block">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                name="es_nacional"
                type="checkbox"
                checked={form.es_nacional}
                onChange={handleChange}
              />
              Nacional
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={handleClose} className="px-2 py-1 bg-gray-200">Cancelar</button>
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
