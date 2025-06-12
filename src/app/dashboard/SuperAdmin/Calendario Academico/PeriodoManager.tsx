// src/components/PeriodoManager.tsx
import  { useEffect, useState, ChangeEvent, FormEvent } from "react";
import AxiosInstance from "@/components/AxiosInstance";

export interface Periodo {
  id: number;
  tipo_division: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
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
      .get<Periodo[]>(`/calendario/periodos/listar/?calendario=${calendarioId}`)
      .then(res => setPeriodos(res.data))
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
        <h5 className="font-semibold">Periodos</h5>
        <button onClick={() => handleOpen()} className="text-sm text-blue-600">+ Nuevo</button>
      </div>
      <table className="w-full text-sm mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-1">Tipo</th><th className="p-1">Nombre</th><th className="p-1">Inicio</th><th className="p-1">Fin</th><th className="p-1">Estado</th><th className="p-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {periodos.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-1">{p.tipo_division}</td>
              <td className="p-1">{p.nombre}</td>
              <td className="p-1">{p.fecha_inicio}</td>
              <td className="p-1">{p.fecha_fin}</td>
              <td className="p-1">{p.estado}</td>
              <td className="p-1 space-x-2">
                <button onClick={() => handleOpen(p)} className="text-blue-600">Editar</button>
                <button onClick={() => handleDelete(p.id)} className="text-red-600">Eliminar</button>
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
