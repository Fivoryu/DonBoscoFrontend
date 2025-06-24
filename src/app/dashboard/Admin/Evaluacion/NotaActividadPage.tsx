import { useState, useEffect } from "react";
import { createNotaActividad, getNotasActividad } from "@/app/api/evaluacionApi";
import { getActividades } from "@/app/api/actividadApi";
import { getEstudiantes } from "@/app/api/utilsApi";

interface NotaActividadForm {
  actividad: number;
  estudiante: number;
  nota: number;
}

const NotaActividadPage = () => {
  const [form, setForm] = useState<NotaActividadForm>({
    actividad: 0,
    estudiante: 0,
    nota: 0,
  });

  const [actividades, setActividades] = useState<any[]>([]);
  const [estudiantes, setEstudiantes] = useState<any[]>([]);
  const [notas, setNotas] = useState<any[]>([]);

  useEffect(() => {
    getActividades().then(res => setActividades(res.data));
    getEstudiantes().then(res => setEstudiantes(res.data));
    getNotasActividad().then(res => setNotas(res.data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "nota" ? parseFloat(value) : parseInt(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNotaActividad(form);
      alert("Nota registrada correctamente");
      setForm({ actividad: 0, estudiante: 0, nota: 0 });
      const res = await getNotasActividad();
      setNotas(res.data);
    } catch (err) {
      alert("Error al registrar nota");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Registrar Nota de Actividad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Actividad</label>
          <select
            name="actividad"
            value={form.actividad}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value={0}>Seleccionar actividad</option>
            {actividades.map((a) => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Estudiante</label>
          <select
            name="estudiante"
            value={form.estudiante}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value={0}>Seleccionar estudiante</option>
            {estudiantes.map((e) => (
              <option key={e.id} value={e.id}>{e.usuario?.nombre} {e.usuario?.apellido}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Nota</label>
          <input
            type="number"
            name="nota"
            value={form.nota}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2"
            min={0}
            step={0.1}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          Registrar Nota
        </button>
      </form>

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-2">Notas registradas</h3>
      <ul className="space-y-1">
        {notas.map((n) => (
          <li key={n.id} className="border rounded-lg p-2">
            <strong>{n.estudiante.usuario.nombre} {n.estudiante.usuario.apellido}</strong> — <em>{n.actividad.nombre}</em>: <span className="font-bold">{n.nota}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotaActividadPage;
