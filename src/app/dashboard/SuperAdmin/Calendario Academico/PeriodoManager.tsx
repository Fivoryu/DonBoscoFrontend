// src/components/PeriodoManager.tsx
import  { useEffect, useState, ChangeEvent, FormEvent } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { Pencil, Trash } from "lucide-react";
export interface Periodo {
  id: number;
  tipo_division: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  calendario: number;          // <— Agregado
}

interface PeriodoForm {
  tipo_division: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

export function PeriodoManager({ calendarioId }: { calendarioId: number }) {
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Periodo | null>(null);
  const [form, setForm] = useState<PeriodoForm>({
    tipo_division: "SEM",
    nombre: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "PLA",
  });

  useEffect(() => {
    fetchPeriodos();
  }, []);

function fetchPeriodos() {
  AxiosInstance
    .get<Periodo[]>("/calendario/periodos/listar/")
    .then(res => {
      const sóloEste = res.data.filter(p => p.calendario === calendarioId);
      setPeriodos(sóloEste);
    })
    .catch(console.error);
}

  function handleOpen(p?: Periodo) {
    if (p) {
      setEditing(p);
      setForm({
        tipo_division: p.tipo_division,
        nombre: p.nombre,
        fecha_inicio: p.fecha_inicio,
        fecha_fin: p.fecha_fin,
        estado: p.estado,
      });
    } else {
      setEditing(null);
      setForm({ tipo_division: "SEM", nombre: "", fecha_inicio: "", fecha_fin: "", estado: "PLA" });
    }
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditing(null);
  }

  function handleChange(e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = { ...form, calendario: calendarioId };
    const req = editing
      ? AxiosInstance.put(`/calendario/periodos/${editing.id}/editar/`, payload)
      : AxiosInstance.post("/calendario/periodos/crear/", payload);

    req.then(() => {
      fetchPeriodos();
      handleClose();
    }).catch(console.error);
  }

  function handleDelete(id: number) {
    if (!confirm("Eliminar periodo?")) return;
    AxiosInstance
      .delete(`/calendario/periodos/${id}/eliminar/`)
      .then(fetchPeriodos)
      .catch(console.error);
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold mb-4 text-blue-600">Periodos</h3>
        <button onClick={() => handleOpen()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition-colors">+ Nuevo Periodo</button>
      </div>
      <table className="w-full text-sm mb-4 table-fixed">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Tipo</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Inicio</th>
            <th className="px-4 py-2 text-left">Fin</th>
            <th className="px-4 py-2 text-left">Estado</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {periodos.map(p => (
            <tr key={p.id} className="border-b">
              <td className="px-4 py-2 text-left">{p.tipo_division}</td>
              <td className="px-4 py-2 text-left">{p.nombre}</td>
              <td className="px-4 py-2 text-left">{p.fecha_inicio}</td>
              <td className="px-4 py-2 text-left">{p.fecha_fin}</td>
              <td className="px-4 py-2 text-left">{p.estado}</td>

              <td className="px-4 py-2 flex items-center gap-2">
                <button
                  onClick={() => handleOpen(p)}
                  className="px-4 py-2 text-left hover:bg-blue-100 rounded"
                  title="Editar"
                >
                  <Pencil className="h-5 w-5 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-4 py-2 text-left hover:bg-red-100 rounded"
                  title="Eliminar"
                >
                  <Trash className="h-5 w-5 text-red-600" />
                </button>
              </td>
            </tr>
          ))}
          {!periodos.length && (
            <tr><td colSpan={6} className="p-2 text-center text-gray-500">Sin periodos</td></tr>
          )}
        </tbody>
      </table>

      {open && (
        <div className="space-y-2 mb-4">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label>Tipo</label>
              <select name="tipo_division" value={form.tipo_division} onChange={handleChange} className="border p-1">
                <option value="SEM">Semestre</option>
                <option value="TRI">Trimestre</option>
                <option value="BIM">Bimestre</option>
                <option value="CUA">Cuatrimestre</option>
                <option value="OTR">Otro</option>
              </select>
            </div>
            <div>
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} className="border p-1 w-full" />
            </div>
            <div className="flex gap-2">
              <div>
                <label>Inicio</label>
                <input name="fecha_inicio" type="date" value={form.fecha_inicio} onChange={handleChange} className="border p-1" />
              </div>
              <div>
                <label>Fin</label>
                <input name="fecha_fin" type="date" value={form.fecha_fin} onChange={handleChange} className="border p-1" />
              </div>
            </div>
            <div>
              <label>Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} className="border p-1">
                <option value="PLA">Planificado</option>
                <option value="CUR">En Curso</option>
                <option value="FIN">Finalizado</option>
                <option value="CAN">Cancelado</option>
              </select>
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
