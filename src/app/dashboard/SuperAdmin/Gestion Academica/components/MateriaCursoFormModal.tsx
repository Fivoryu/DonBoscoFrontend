// src/app/dashboard/SuperAdmin/components/MateriaCursoFormModal.tsx
import React, { useState, useEffect } from "react";
import FormModal from "@/components/FormModal";
import AxiosInstance from "@/components/AxiosInstance";
import { Colegio, UnidadEducativa } from "@/app/modelos/Institucion";
import { Curso, Materia, MateriaCurso } from "@/app/modelos/Academico";
import { Profesor } from "@/app/modelos/Personal";

interface Props {
  initial: MateriaCurso | null;
  colegios: Colegio[];
  unidades: UnidadEducativa[];
  cursos: Curso[];
  materias: Materia[];
  profesores: Profesor[];
  onCancel: () => void;
  onSave: (mc: MateriaCurso) => void;
}

export default function MateriaCursoFormModal({
  initial,
  colegios,
  unidades,
  cursos,
  materias,
  profesores,
  onCancel,
  onSave,
}: Props) {
  const [form, setForm] = useState({
    id:          initial?.id ?? 0,
    colegioId:   initial
                  ? (initial.curso.paralelo!.grado.unidad_educativa as any).colegio.id
                  : colegios[0]?.id       ?? 0,
    unidadId:    initial
                  ? (initial.curso.paralelo!.grado.unidad_educativa as any).id
                  : unidades[0]?.id       ?? 0,
    curso_id:    initial
                  ? initial.curso.paralelo!.id
                  : cursos[0]?.id ?? 0,
    materia_id:  initial
                  ? initial.materia.id
                  : materias[0]?.id       ?? 0,
    profesor_id: initial
                  ? initial.profesor?.usuario.id ?? 0
                  : profesores[0]?.usuario.id ?? 0,
  });

  // filtrar cascada
  const unidadesFiltradas = unidades.filter(
    u => u.colegio.id === form.colegioId
  );
  const cursosFiltrados = cursos.filter(
    c => unidadesFiltradas.some(
      u => u.id === (c.paralelo!.grado.unidad_educativa as any).id
    )
  );

  useEffect(() => {
    if (
      !initial &&                      // estamos creando, no editando
      cursosFiltrados.length > 0 &&    // ya hay cursos
      form.curso_id === 0              // y seguimos con 0
    ) {
      setForm(f => ({
        ...f,
        curso_id: cursosFiltrados[0].id,
      }));
    }
  }, [cursosFiltrados, form.curso_id, initial]);

  useEffect(() => {
    if (!initial && materias.length && form.materia_id === 0) {
      setForm(f => ({ ...f, materia_id: materias[0].id }));
    }
  }, [materias, form.materia_id, initial]);

  useEffect(() => {
    if (!initial && profesores.length && form.profesor_id === 0) {
      setForm(f => ({ ...f, profesor_id: profesores[0].usuario.id }));
    }
  }, [profesores, form.profesor_id, initial]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setForm(f => ({
      ...f,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async () => {
    const payload: any = {
      curso:   form.curso_id,
      materia: form.materia_id,
    };
    // solo incluye profesor si existe
    if (form.profesor_id) payload.profesor = form.profesor_id;

    try {
      const url = form.id
        ? `/academico/materias-curso/${form.id}/editar-asignacion/`
        : `/academico/materias-curso/crear-asignacion/`;
      const resp = form.id
        ? await AxiosInstance.put(url, payload)
        : await AxiosInstance.post(url, payload);
      onSave(resp.data);
    } catch (err: any) {
      alert("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  

  return (
    <FormModal
      title={form.id ? "Editar Asignación" : "Nueva Asignación"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel="Guardar"
    >
      <div>
        <label className="block mb-1">Colegio</label>
        <select
          name="colegioId"
          value={form.colegioId}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          {colegios.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Unidad Educativa</label>
        <select
          name="unidadId"
          value={form.unidadId}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          {unidadesFiltradas.map(u => (
            <option key={u.id} value={u.id}>{u.nombre}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Curso</label>
        <select
          name="curso_id"
          value={form.curso_id}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          {cursosFiltrados.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Materia</label>
        <select
          name="materia_id"
          value={form.materia_id}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          {materias.map(m => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Profesor</label>
        <select
          name="profesor_id"
          value={form.profesor_id}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          {profesores.map(p => (
            <option key={p.usuario.id} value={p.usuario.id}>{p.usuario.nombre}</option>
          ))}
        </select>
      </div>
    </FormModal>
  );
}
