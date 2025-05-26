import React, { useState, useEffect } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { Paralelo, Grado } from "@/app/modelos/Academico";
import { UnidadEducativa, Colegio } from "@/app/modelos/Institucion";
import FormModal from "@/components/FormModal";

interface Props {
  initial: Paralelo | null;
  colegios: Colegio[];
  unidades: UnidadEducativa[];
  grados: Grado[];
  onCancel: () => void;
  onSave: (p: Paralelo) => void;
}

const nivelMap: Record<string, string> = {
  INI: "Inicial",
  PRI: "Primaria",
  SEC: "Secundaria",
};
const sufijos: Record<number, string> = { 1: "ro", 2: "do", 3: "ro", 4: "to", 5: "to", 6: "to" };

export default function ParaleloFormModal({
  initial,
  colegios,
  unidades,
  grados,
  onCancel,
  onSave,
}: Props) {
  // --- Estados independientes para colegio, unidad y grado ---
  const [colegioId, setColegioId] = useState<number>(
    initial && typeof initial.grado !== "number"
      ? initial.grado.unidad_educativa.colegio?.id ?? 0
      : 0
  );
  const [unidadId, setUnidadId] = useState<number>(
    initial && typeof initial.grado !== "number"
      ? initial.grado.unidad_educativa.id
      : 0
  );
  const [gradosFiltrados, setGradosFiltrados] = useState<Grado[]>([]);
  const [form, setForm] = useState<{ letra: string; gradoId: number }>({
    letra: initial ? initial.letra : "",
    gradoId:
      initial && typeof initial.grado !== "number" ? initial.grado.id : 0,
  });

  // Cuando cambia colegio → filtro unidades y reseteo unidad+grado
  useEffect(() => {
    if (colegioId) {
      setUnidadId(0);
      setForm((f) => ({ ...f, gradoId: 0 }));
    }
  }, [colegioId]);

  // Cuando cambia unidad → filtro grados y reseteo grado
  useEffect(() => {
    if (unidadId) {
      const nuevos = grados.filter(
        (g) =>
          typeof g.unidad_educativa === "object"
            ? g.unidad_educativa.id === unidadId
            : g.unidad_educativa === unidadId
      );
      setGradosFiltrados(nuevos);
      setForm((f) => ({ ...f, gradoId: 0 }));
    } else {
      setGradosFiltrados([]);
    }
  }, [unidadId, grados]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    if (name === "colegio") {
      setColegioId(Number(value));
    } else if (name === "unidad_educativa") {
      setUnidadId(Number(value));
    } else if (name === "grado") {
      setForm((f) => ({ ...f, gradoId: Number(value) }));
    } else if (name === "letra") {
      setForm((f) => ({ ...f, letra: value.toUpperCase() }));
    }
  };

  const nombreCompleto = () => {
    const grado = grados.find((g) => g.id === form.gradoId);
    if (!grado) return "";
    const num = grado.numero;
    const suf = sufijos[num] || "";
    const nivel = nivelMap[grado.nivel_educativo] || "";
    return `${num}${suf} ${form.letra} de ${nivel}`;
  };

  const handleSubmit = async () => {
    if (!unidadId) {
      alert("Selecciona una unidad educativa.");
      return;
    }
    if (!form.gradoId) {
      alert("Selecciona un grado.");
      return;
    }
    if (!form.letra) {
      alert("Escribe la sigla (letra).");
      return;
    }

    try {
      const payload = {
        grado_id: form.gradoId,
        letra: form.letra,
      };
      let resp;
      if (initial) {
        resp = await AxiosInstance.put(
          `/academico/paralelos/editar/${initial.id}/`,
          payload
        );
      } else {
        resp = await AxiosInstance.post(
          `/academico/paralelos/crear/`,
          payload
        );
      }
      onSave({
        id: resp.data.id,
        grado: resp.data.grado,
        letra: resp.data.letra,
      });
    } catch (err: any) {
      alert("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <FormModal
      title={initial ? "Editar Paralelo" : "Nuevo Paralelo"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
    >
      {/* Colegio */}
      <div className="mb-4">
        <label className="block mb-1">Colegio</label>
        <select
          name="colegio"
          value={colegioId}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value={0} disabled>
            Seleccione un colegio
          </option>
          {colegios.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Unidad Educativa */}
      <div className="mb-4">
        <label className="block mb-1">Unidad Educativa</label>
        <select
          name="unidad_educativa"
          value={unidadId}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value={0} disabled>
            Seleccione una unidad educativa
          </option>
          {unidades
            .filter((u) => u.colegio?.id === colegioId)
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
        </select>
      </div>

      {/* Grado */}
      <div className="mb-4">
        <label className="block mb-1">Grado</label>
        <select
          name="grado"
          value={form.gradoId}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value={0} disabled>
            Seleccione un grado
          </option>
          {gradosFiltrados.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Sigla */}
      <div className="mb-4">
        <label className="block mb-1">Sigla (Letra)</label>
        <input
          name="letra"
          maxLength={1}
          value={form.letra}
          onChange={handleChange}
          className="w-full border rounded p-2 uppercase"
        />
      </div>

      {/* Nombre completo */}
      <div>
        <label className="block mb-1">Nombre Completo</label>
        <input
          type="text"
          value={nombreCompleto()}
          readOnly
          className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
        />
      </div>
    </FormModal>
  );
}
