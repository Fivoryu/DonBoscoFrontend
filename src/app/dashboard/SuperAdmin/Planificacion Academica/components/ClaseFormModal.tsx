import { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import Axios from "@/components/AxiosInstance";

import {
  Colegio,
  UnidadEducativa,
  Aula,
} from "@/app/modelos/Institucion";
import {
  MateriaCurso,
  Clase,
} from "@/app/modelos/Academico";

interface Props {
  initial: Clase | null;
  onCancel: () => void;
  onSave: (c: Clase) => void;
}

/* ─────── Helpers de carga ───────────────────────────────────────── */

const fetchColegios       = () => Axios.get<Colegio[]>("/institucion/colegios/").then(r => r.data);
const fetchUnidades       = (colId:number) => Axios.get<UnidadEducativa[]>(`/institucion/unidades-educativas/?colegio_id=${colId}`).then(r=>r.data);
const fetchMateriasCurso  = (uniId:number) => Axios.get<MateriaCurso[]>(`/academico/materias-curso/listar-unidad-educativa/?unidad_educativa_id=${uniId}`).then(r=>r.data);
const fetchAulas          = (uniId:number) => Axios.get<Aula[]>(`/institucion/aulas/?unidad_id=${uniId}`).then(r=>r.data);

/* ─────── Componente ────────────────────────────────────────────── */

export default function ClaseFormModal({ initial, onCancel, onSave }: Props) {
  /* estado del formulario */
  const [form, setForm] = useState({
    id: initial?.id ?? 0,
    materia_curso_id: initial?.materia_curso_id ?? 0,
    aula_id: initial?.aula_id ?? 0,
    colegio_id: 0,            // cascada
    unidad_id: 0,
  });

  /* combos dependientes */
  const [colegios, setColegios]   = useState<Colegio[]>([]);
  const [unidades, setUnidades]   = useState<UnidadEducativa[]>([]);
  const [materiasC, setMateriasC] = useState<MateriaCurso[]>([]);
  const [aulas, setAulas]         = useState<Aula[]>([]);

  /* carga inicial */
  useEffect(()=>{ fetchColegios().then(setColegios); },[]);

  /* cascada colegio→unidades */
  useEffect(()=>{
    if(form.colegio_id){
      fetchUnidades(form.colegio_id).then(setUnidades);
    } else { setUnidades([]); }
  },[form.colegio_id]);

  /* cascada unidad→materiasCurso & aulas */
  useEffect(()=>{
    if(form.unidad_id){
      fetchMateriasCurso(form.unidad_id).then(setMateriasC);
      fetchAulas(form.unidad_id).then(setAulas);
    } else { setMateriasC([]); setAulas([]); }
  },[form.unidad_id]);

  /* handle changes */
  const handleChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setForm(f => ({ ...f, [name]: +value }));
  };

  /* submit */
  const handleSubmit = async () => {
    const payload = {
      materia_curso_id: form.materia_curso_id,
      aula_id: form.aula_id,
    };
    try {
      const resp = form.id
        ? await Axios.put<Clase>(`/academico/clases/${form.id}/editar/`, payload)
        : await Axios.post<Clase>("/academico/clases/crear/", payload);
      onSave(resp.data);
    } catch (err:any) {
      alert("Error: "+JSON.stringify(err.response?.data || err.message));
    }
  };

  /* render */
  return (
    <FormModal
      title={form.id ? "Editar Clase" : "Nueva Clase"}
      submitLabel="Guardar"
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      {/* Colegio */}
      <div>
        <label className="block mb-1">Colegio</label>
        <select name="colegio_id" value={form.colegio_id} onChange={handleChange} className="w-full border rounded p-2">
          <option value={0}>Seleccione…</option>
          {colegios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </div>

      {/* Unidad Educativa */}
      <div>
        <label className="block mb-1">Unidad Educativa</label>
        <select name="unidad_id" value={form.unidad_id} onChange={handleChange} className="w-full border rounded p-2">
          <option value={0}>Seleccione…</option>
          {unidades.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
        </select>
      </div>

      {/* Materia-Curso */}
      <div>
        <label className="block mb-1">Materia / Curso</label>
        <select name="materia_curso_id" value={form.materia_curso_id} onChange={handleChange} className="w-full border rounded p-2">
          <option value={0}>Seleccione…</option>
          {materiasC.map(mc => (
            <option key={mc.id} value={mc.id}>
              {mc.materia.nombre} — {mc.curso.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Aula */}
      <div>
        <label className="block mb-1">Aula</label>
        <select name="aula_id" value={form.aula_id} onChange={handleChange} className="w-full border rounded p-2">
          <option value={0}>Seleccione…</option>
          {aulas.map(a => <option key={a.id} value={a.id}>{a.nombre} (cap. {a.capacidad})</option>)}
        </select>
      </div>
    </FormModal>
  );
}
