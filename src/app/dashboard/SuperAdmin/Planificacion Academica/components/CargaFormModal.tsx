import { useState, useEffect } from "react";
import FormModal from "@/components/FormModal";
import { CargaHoraria, Especialidad, Profesor } from "@/app/modelos/Personal";
import { UnidadEducativa, Colegio } from "@/app/modelos/Institucion";
import { CalendarioAcademico, Periodo } from "@/app/modelos/Calendario";

interface Props {
  initial: CargaHoraria | null;
  colegios: Colegio[];
  unidades: UnidadEducativa[];
  calendarios: CalendarioAcademico[];
  periodos: Periodo[];
  profesores: Profesor[];
  especialidades: Especialidad[];
  profesorEspecialidades: Record<number, Especialidad[]>;
  onCancel: () => void;
  onSave: (form: {
    colegio: number | "";
    unidad: number | "";
    calendario: number | "";
    periodo: number | "";
    profesor: number | "";
    especialidad: number | "";
    horas: number;
  }) => void;
}

export default function CargaFormModal({
  initial,
  colegios,
  unidades,
  calendarios,
  periodos,
  profesores,
  profesorEspecialidades,
  onCancel,
  onSave,
}: Props) {
  const [form, setForm] = useState({
    colegio: "",
    unidad: "",
    calendario: "",
    periodo: "",
    profesor: "",
    especialidad: "",
    horas: initial?.horas ?? 0,
  });

  // Si initial existe, setea los valores iniciales
  useEffect(() => {
    if (initial) {
      setForm({
        colegio: initial.profesor?.unidad?.colegio?.id !== undefined ? String(initial.profesor?.unidad?.colegio?.id) : "",
        unidad: initial.profesor?.unidad?.id !== undefined ? String(initial.profesor?.unidad?.id) : "",
        calendario: "",
        periodo: initial.periodo?.id !== undefined ? String(initial.periodo.id) : "",
        profesor: initial.profesor?.usuario?.id !== undefined ? String(initial.profesor.usuario.id) : "",
        especialidad: initial.especialidad?.id !== undefined ? String(initial.especialidad.id) : "",
        horas: initial.horas ?? 0,
      });
    }
  }, [initial]);

  // Limpiar selects dependientes al cambiar valores padres
  useEffect(() => {
    setForm(f => ({
      ...f,
      unidad: "",
      calendario: "",
      periodo: "",
      profesor: "",
      especialidad: "",
    }));
  }, [form.colegio]);

  useEffect(() => {
    setForm(f => ({
      ...f,
      calendario: "",
      periodo: "",
      profesor: "",
      especialidad: "",
    }));
  }, [form.unidad]);

  useEffect(() => {
    setForm(f => ({
      ...f,
      periodo: "",
    }));
  }, [form.calendario]);

  useEffect(() => {
    setForm(f => ({
      ...f,
      especialidad: "",
    }));
  }, [form.profesor]);

  // Filtrados dependientes
  const unidadesFiltradas = unidades.filter(u => u.colegio.id === Number(form.colegio));
  const calendariosFiltrados = calendarios.filter(c => c.unidad_educativa.id === Number(form.unidad));
  const periodosFiltrados = periodos.filter(p => p.calendario.id === Number(form.calendario));
  const profesoresFiltrados = profesores.filter(p => p.unidad.id === Number(form.unidad));
  const especialidadesProfesor = form.profesor ? (profesorEspecialidades[Number(form.profesor)] ?? []) : [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...form,
      colegio: form.colegio === "" ? "" : Number(form.colegio),
      unidad: form.unidad === "" ? "" : Number(form.unidad),
      calendario: form.calendario === "" ? "" : Number(form.calendario),
      periodo: form.periodo === "" ? "" : Number(form.periodo),
      profesor: form.profesor === "" ? "" : Number(form.profesor),
      especialidad: form.especialidad === "" ? "" : Number(form.especialidad),
      horas: Number(form.horas),
    });
  };

  return (
    <FormModal
      title={initial ? "Editar Carga Horaria" : "Nueva Carga Horaria"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel="Guardar"
    >
      <div className="grid gap-4">
        {/* Colegio */}
        <div>
          <label className="block mb-1">Colegio</label>
          <select
            name="colegio"
            value={form.colegio}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Seleccione un colegio</option>
            {colegios.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
        {/* Unidad Educativa */}
        <div>
          <label className="block mb-1">Unidad Educativa</label>
          <select
            name="unidad"
            value={form.unidad}
            onChange={handleChange}
            className="w-full border rounded p-2"
            disabled={!form.colegio}
          >
            <option value="">Seleccione una unidad</option>
            {unidadesFiltradas.map(u => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </div>
        {/* Calendario Académico */}
        <div>
          <label className="block mb-1">Calendario Académico</label>
          <select
            name="calendario"
            value={form.calendario}
            onChange={handleChange}
            className="w-full border rounded p-2"
            disabled={!form.unidad}
          >
            <option value="">Seleccione un calendario</option>
            {calendariosFiltrados.map(c => (
              <option key={c.id} value={c.id}>{c.año}</option>
            ))}
          </select>
        </div>
        {/* Periodo */}
        <div>
          <label className="block mb-1">Periodo</label>
          <select
            name="periodo"
            value={form.periodo}
            onChange={handleChange}
            className="w-full border rounded p-2"
            disabled={!form.calendario}
          >
            <option value="">Seleccione un periodo</option>
            {periodosFiltrados.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        {/* Profesor */}
        <div>
          <label className="block mb-1">Profesor</label>
          <select
            name="profesor"
            value={form.profesor}
            onChange={handleChange}
            className="w-full border rounded p-2"
            disabled={!form.unidad}
          >
            <option value="">Seleccione un profesor</option>
            {profesoresFiltrados.map(p => (
              <option key={p.usuario.id} value={p.usuario.id}>
                {p.usuario.nombre} {p.usuario.apellido}
              </option>
            ))}
          </select>
        </div>
        {/* Especialidad */}
        <div>
          <label className="block mb-1">Especialidad</label>
          <select
            name="especialidad"
            value={form.especialidad}
            onChange={handleChange}
            className="w-full border rounded p-2"
            disabled={!form.profesor || especialidadesProfesor.length === 0}
          >
            <option value="">
              {form.profesor && especialidadesProfesor.length === 0
                ? "Este profesor no tiene especialidad, asígnele una"
                : "Seleccione una especialidad"}
            </option>
            {especialidadesProfesor.map(e => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>
        {/* Horas */}
        <div>
          <label className="block mb-1">Horas</label>
          <input
            type="number"
            name="horas"
            value={form.horas}
            onChange={handleChange}
            min={1}
            className="w-full border rounded p-2"
          />
        </div>
      </div>
    </FormModal>
  );
}
