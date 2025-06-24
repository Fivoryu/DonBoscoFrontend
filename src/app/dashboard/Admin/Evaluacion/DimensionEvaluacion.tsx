import { useState, useEffect } from "react";
import { createActividad } from "@/app/api/evaluacionApi";
import { getMateriasCurso, getProfesores, getDimensiones } from "@/app/api/utilsApi";

const CrearActividad = () => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    fecha_entrega: "",
    nota_maxima: 100,
    es_recuperacion: false,
    activa: true,
    materia_curso: "",
    profesor: "",
    dimension: "",
  });

  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [dimensiones, setDimensiones] = useState([]);

  useEffect(() => {
    getMateriasCurso().then(res => setMaterias(res.data));
    getProfesores().then(res => setProfesores(res.data));
    getDimensiones().then(res => setDimensiones(res.data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" || type === "radio"
        ? (e.target as HTMLInputElement).checked
        : value;

    setForm(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createActividad(form);
      alert("Actividad creada correctamente");
    } catch (err) {
      alert("Error al crear actividad");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Actividad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Fecha de Entrega</label>
            <input
              type="date"
              name="fecha_entrega"
              value={form.fecha_entrega}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Nota Máxima</label>
          <input
            type="number"
            name="nota_maxima"
            value={form.nota_maxima}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="es_recuperacion"
              checked={form.es_recuperacion}
              onChange={handleChange}
              className="mr-2"
            />
            Recuperación
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="activa"
              checked={form.activa}
              onChange={handleChange}
              className="mr-2"
            />
            Activa
          </label>
        </div>

        <div>
          <label className="block font-medium">Materia</label>
          <select
            name="materia_curso"
            value={form.materia_curso}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccionar materia</option>
            {materias.map((m: any) => (
              <option key={m.id} value={m.id}>
                {m.materia?.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Profesor</label>
          <select
            name="profesor"
            value={form.profesor}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccionar profesor</option>
            {profesores.map((p: any) => (
              <option key={p.usuario.id} value={p.usuario.id}>
                {p.usuario.nombre} {p.usuario.apellido}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Dimensión</label>
          <select
            name="dimension"
            value={form.dimension}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccionar dimensión</option>
            {dimensiones.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default CrearActividad;
