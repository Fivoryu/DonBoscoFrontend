import React, { useState, useEffect } from "react";
import FormModal from "@/components/FormModal";
import { Grado } from "@/app/modelos/Academico";
import { UnidadEducativa, Colegio } from "@/app/modelos/Institucion";

interface Props {
  initial: Grado | null;
  unidades: UnidadEducativa[];
  colegios: Colegio[];
  onCancel: () => void;
  onSave: (grado: Grado) => void;
}


const sufijos: Record<number, string> = { 1: "ro", 2: "do", 3: "ro", 4: "to", 5: "to", 6: "to" };

function generarNombreGrado(nivel: string, numero: number): string {
  const niveles: Record<string, string> = {
    INI: "Inicial",
    PRI: "Primaria",
    SEC: "Secundaria",
  };
  const suf = sufijos[numero] || "°";
  const nombreNivel = niveles[nivel] ?? nivel;
  return `${numero}${suf} de ${nombreNivel}`;
}


export default function GradoFormModal({ initial, unidades, colegios, onCancel, onSave }: Props) {
  const [form, setForm] = useState<Grado>(
    initial ?? { id: 0, nivel_educativo: "PRI", unidad_educativa: undefined as unknown as UnidadEducativa, numero: 1, nombre: "" }
  );

  const [colegioId, setColegioId] = useState<number | null>(null);
  const [unidadesFiltradas, setUnidadesFiltradas] = useState<UnidadEducativa[]>([]);

  // Cuando cambia el colegio, actualiza unidades y unidad seleccionada si no pertenece
  const handleColegioChange = (id: number) => {
    setColegioId(id);
    const nuevasUnidades = unidades.filter((u) => u.colegio?.id === id);
    setUnidadesFiltradas(nuevasUnidades);

    if (!nuevasUnidades.some((u) => u.id === Number(form.unidad_educativa))) {
      setForm((f) => ({ ...f, unidad_educativa: null as unknown as UnidadEducativa }));
    }
  };

  // Cuando cambia la unidad educativa, actualiza colegio, nivel y unidad
  const handleUnidadChange = (id: number) => {
    const unidad = unidades.find(u => u.id === id);
    if (unidad) {
      setForm(f => ({
        ...f,
        unidad_educativa: unidad,
        nivel_educativo: unidad.nivel || f.nivel_educativo, // actualiza nivel educativo
      }));

      // También si manejas colegioId separado, actualízalo aquí
      setColegioId(unidad.colegio?.id ?? null);
    }
  };

  // Maneja cambios de nivel y número de grado y unidad educativa desde selects
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    if (name === "unidad_educativa") {
      handleUnidadChange(Number(value));
    } else if (name === "colegio") {
      handleColegioChange(Number(value));
    } else {
      setForm((f) => ({
        ...f,
        [name]: name === "numero" ? Number(value) : value,
      }));
    }
  };

  // Genera nombre automáticamente cuando cambia nivel o número
  useEffect(() => {
    const nombre = generarNombreGrado(form.nivel_educativo, form.numero);
    setForm((f) => ({ ...f, nombre }));
  }, [form.nivel_educativo, form.numero]);

  // Inicializa unidades filtradas y colegio al cargar o cambiar unidad educativa
  useEffect(() => {
    if (initial) {
      const unidad = unidades.find((u) => u.id === Number(initial.unidad_educativa));
      if (unidad && unidad.colegio) {
        setColegioId(unidad.colegio.id);
        setUnidadesFiltradas(unidades.filter((u) => u.colegio?.id === unidad.colegio?.id));
      }
    } else {
      setUnidadesFiltradas([]);
      setColegioId(null);
    }
  }, [initial, unidades]);

  const handleSubmit = () => {
    if (!form.unidad_educativa) {
      alert("Seleccione una unidad educativa.");
      return;
    }
    if (!form.nivel_educativo) {
      alert("Seleccione un nivel educativo.");
      return;
    }
    if (!form.numero) {
      alert("Seleccione un número de grado.");
      return;
    }

    const nivelMap: Record<string, string> = {
      Inicial: 'INI',
      Primaria: 'PRI',
      Secundaria: 'SEC',
    };

    // Busca el nombre largo del nivel según la unidad educativa seleccionada
    const unidad = unidades.find(u => u.id === form.unidad_educativa.id);
    const displayNivel = unidad?.nivel; 

    if (!displayNivel) {
      alert("No se pudo determinar el nivel educativo.");
      return;
    }

    const nivelCorto = nivelMap[displayNivel] || form.nivel_educativo;

    // Prepara el objeto a enviar con el nivel corto correcto
    const payload = {
    unidad_educativa: form.unidad_educativa.id,  // <-- sólo el PK
    nivel_educativo: nivelCorto,                 // <-- 'PRI', 'INI' o 'SEC'
    numero: form.numero,
  };

    onSave(payload as any);
  };
  
  return (
    <FormModal 
      title={form.id ? "Editar Grado" : "Nuevo Grado"} 
      onCancel={onCancel} 
      onSubmit={handleSubmit}
      submitLabel="Guardar"
    >
      <div className="grid grap-4">
        <div>
          <label className="block mb-1">Colegio</label>
          <select value={colegioId ?? ""} onChange={handleChange} name="colegio" className="w-full border rounded p-2">
            <option value="" disabled>
              Seleccione colegio
            </option>
            {colegios.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Unidad Educativa</label>
          <select
            name="unidad_educativa"
            value={Number(form.unidad_educativa)}
            onChange={e => handleUnidadChange(Number(e.target.value))}
            className="w-full border rounded p-2"
          >
            <option value={0} disabled>Seleccione unidad</option>
            {unidadesFiltradas.map(u => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Nivel Educativo</label>
          <input
            type="text"
            value={
              form.unidad_educativa && typeof form.unidad_educativa === "object"
                ? form.unidad_educativa.nivel || ""
                : ""
            }
            readOnly
            className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block mb-1">Número de Grado</label>
          <select
            name="numero"
            value={form.numero}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n === 1 ? "1ro" : n === 2 ? "2do" : n === 3 ? "3ro" : `${n}to`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Nombre completo</label>
          <input
            type="text"
            value={form.nombre}
            readOnly
            className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>
    </FormModal>
  );
}