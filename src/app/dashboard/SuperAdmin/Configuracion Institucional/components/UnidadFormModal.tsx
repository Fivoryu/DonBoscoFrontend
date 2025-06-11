// src/app/dashboard/components/UnidadFormModal.tsx
import React, { useState, useEffect, useMemo } from "react";
import FormModal from "@/components/FormModal";
import AxiosInstance from "@/components/AxiosInstance";
import { UnidadEducativa, Colegio } from "@/app/modelos/Institucion";
import { Turno } from "@/app/modelos/Calendario";

interface Props {
  initial: UnidadEducativa | null;
  colegios: Colegio[];
  onCancel: () => void;
  onSave: (u: UnidadEducativa) => void;
}

export default function UnidadFormModal({
  initial,
  colegios,
  onCancel,
  onSave,
}: Props) {
  const [form, setForm] = useState({
    id:        initial?.id ?? 0,
    colegioId: initial?.colegio.id ?? colegios[0]?.id ?? 0,
    nombre:    initial?.nombre ?? "",
    codigoSie: initial?.codigo_sie ?? "",
    turno:     initial?.turno as Turno ?? "MAÑANA",
    nivel:     initial?.nivel ?? "Inicial",
    direccion: initial?.direccion ?? "",
    telefono:  initial?.telefono ?? "",
  });

  // reset when initial changes
  useEffect(() => {
    if (initial) {
      setForm({
        id:        initial.id,
        colegioId: initial.colegio.id,
        nombre:    initial.nombre ?? "",
        codigoSie: initial.codigo_sie,
        turno:     initial.turno ?? "Mañana",
        nivel:     initial.nivel ?? "Inicial",
        direccion: initial.direccion ?? "",
        telefono:  initial.telefono ?? "",
      });
    }
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    setForm(f => ({
      ...f,
      [name]:
        name === "colegioId"
          ? Number(value)
          : value,
    }));
  };

  // derive a display string for selected colegio
  const colegioNombre = useMemo(() => {
    return colegios.find(c => c.id === form.colegioId)?.nombre ?? "";
  }, [form.colegioId, colegios]);

  const handleSubmit = async () => {
    // validations
    if (!form.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    if (!form.codigoSie.trim()) {
      alert("El código SIE es obligatorio");
      return;
    }
    try {
      const payload = {
        nombre:       form.nombre,
        codigo_sie:   form.codigoSie,
        turno:        form.turno,
        nivel:        form.nivel,
        direccion:    form.direccion || null,
        telefono:     form.telefono || null,
        colegio:      form.colegioId,
      };
      let resp;
      if (form.id) {
        resp = await AxiosInstance.put(
          `/institucion/unidades-educativas/${form.id}/editar/`,
          payload
        );
      } else {
        resp = await AxiosInstance.post(
          `/institucion/unidades-educativas/crear/`,
          payload
        );
      }
      onSave(resp.data);
    } catch (err: any) {
      alert("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <FormModal
      title={form.id ? "Editar Unidad Educativa" : "Nueva Unidad Educativa"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel="Guardar"
    >
      {/* Colegio */}
      <div>
        <label className="block mb-1">Colegio</label>
        <select
          name="colegioId"
          value={form.colegioId}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          {colegios.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Código SIE */}
      <div>
        <label className="block mb-1">Código SIE</label>
        <input
          name="codigoSie"
          value={form.codigoSie}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Ej. 12345"
        />
      </div>

      {/* Nombre */}
      <div>
        <label className="block mb-1">Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Ej. Don Bosco Central A"
        />
      </div>

      {/* Turno */}
      <div>
        <label className="block mb-1">Turno</label>
        <select
          name="turno"
          value={form.turno}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="MAÑANA">Mañana</option>
          <option value="TARDE">Tarde</option>
          <option value="NOCHE">Noche</option>
          <option value="COMPLETO">Jornada Completa</option>
        </select>
      </div>

      {/* Nivel */}
      <div>
        <label className="block mb-1">Nivel</label>
        <select
          name="nivel"
          value={form.nivel}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="Inicial">Inicial</option>
          <option value="Primaria">Primaria</option>
          <option value="Secundaria">Secundaria</option>
        </select>
      </div>

      {/* Dirección */}
      <div>
        <label className="block mb-1">Dirección</label>
        <input
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Opcional"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block mb-1">Teléfono</label>
        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Opcional"
        />
      </div>

      {/* Info colegio seleccionado */}
      <div className="text-sm text-gray-600">
        <strong>Colegio seleccionado:</strong> {colegioNombre}
      </div>
    </FormModal>
  );
}
