import { useEffect, useState } from "react";
import { Licencia } from "@/app/modelos/Asistencia";
import { Estudiante } from "@/app/modelos/Estudiantes";

interface LicenciaFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void; // Cambia a any para permitir FormData
  initialData?: Partial<Licencia>;
  estudiantes?: Estudiante[];
  tutorId?: number; // Nuevo prop para el id del tutor
}

export default function LicenciaFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  estudiantes = [],
  tutorId,
}: LicenciaFormModalProps) {
  const [form, setForm] = useState<Partial<Licencia>>(initialData || {});

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm(f => ({ ...f, archivo: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepara el payload
    const payload: any = {
      estudiante: form.estudiante?.id,
      tutor: tutorId,
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin,
      motivo: form.motivo,
      // Puedes agregar estado por defecto si lo requiere el backend
      // estado: form.estado || "SOL",
    };
    // Si hay archivo, usa FormData
    if (form.archivo) {
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => fd.append(k, v as any));
      fd.append("archivo", form.archivo as File);
      onSubmit(fd);
    } else {
      onSubmit(payload);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{initialData ? "Editar licencia" : "Nueva licencia"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Estudiante</label>
            <select
              name="estudiante"
              value={form.estudiante?.id || ""}
              onChange={e => {
                const est = estudiantes.find(est => est.id === Number(e.target.value));
                setForm(f => ({ ...f, estudiante: est }));
              }}
              required
              className="w-full border rounded px-3 py-2"
              disabled={!!initialData}
            >
              <option value="">Seleccione...</option>
              {estudiantes.map(est => (
                <option key={est.id} value={est.id}>
                  {est.usuario.nombre} {est.usuario.apellido}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Fecha inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              value={form.fecha_inicio || ""}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Fecha fin</label>
            <input
              type="date"
              name="fecha_fin"
              value={form.fecha_fin || ""}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Motivo</label>
            <textarea
              name="motivo"
              value={form.motivo || ""}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Archivo (opcional)</label>
            <input type="file" name="archivo" onChange={handleFile} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {initialData ? "Guardar cambios" : "Crear licencia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
