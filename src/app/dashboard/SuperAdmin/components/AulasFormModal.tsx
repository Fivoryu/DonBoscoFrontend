import React, { useState, useEffect } from "react";
import FormModal from "@/components/FormModal";
import AxiosInstance from "@/components/AxiosInstance";
import { Aula, Modulo, TipoAula } from "@/app/modelos/Institucion";

interface Props {
  initial: Aula | null;
  modulos: Modulo[];
  onCancel: () => void;
  onSave: (updated: Aula) => void;
}

const defaultAula: Aula = {
  id: 0,
  moduloId: undefined,
  nombre: "",
  capacidad: 0,
  estado: true,
  tipo: "AUL",
  piso: 1,
  equipamiento: "",
};

export default function AulaFormModal({ initial, modulos, onCancel, onSave }: Props) {
  const [form, setForm] = useState<Aula>(initial ? { ...initial } : { ...defaultAula });

  useEffect(() => {
    setForm(initial ? { ...initial } : { ...defaultAula });
  }, [initial]);

  // Módulo seleccionado y datos asociados
  const selectedModulo = modulos.find(m => m.id === form.moduloId);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setForm(prev => ({
      ...prev,
      [name]:
        name === "capacidad" || name === "piso" || name === "moduloId"
          ? Number(value)
          : name === "estado"
          ? value === "true"
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        modulo: form.moduloId,
        nombre: form.nombre,
        capacidad: form.capacidad,
        estado: form.estado,
        tipo: form.tipo as TipoAula,
        piso: form.piso,
        equipamiento: form.equipamiento,
      };

      let resp;
      if (form.id) {
        resp = await AxiosInstance.put(
          `/institucion/aulas/${form.id}/editar/`,
          payload
        );
      } else {
        resp = await AxiosInstance.post(
          `/institucion/aulas/crear/`,
          payload
        );
      }

      // Mapear respuesta: extraer móduloId de raw.modulo.id
      const raw = resp.data;
      const mapped: Aula = {
        id: raw.id,
        moduloId: raw.modulo?.id ?? raw.moduloId ?? undefined,
        nombre: raw.nombre,
        capacidad: raw.capacidad,
        estado: raw.estado,
        tipo: raw.tipo,
        piso: raw.piso,
        equipamiento: raw.equipamiento,
      };

      onSave(mapped);
    } catch (e: any) {
      alert("Error: " + JSON.stringify(e.response?.data || e.message));
    }
  };

  return (
    <FormModal
      title={form.id ? "Editar Aula" : "Nueva Aula"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel="Guardar"
    >
      {/* Selector de Módulo */}
      <div>
        <label className="block mb-1">Módulo</label>
        <select
          name="moduloId"
          value={form.moduloId ?? ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        >
          <option value="" disabled>
            Seleccione un módulo
          </option>
          {modulos.map(m => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Información dinámica */}
      {selectedModulo && (
        <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
          <div>
            <strong>Colegio:</strong> {selectedModulo.colegio?.nombre}
          </div>
          <div>
            <strong>Aulas disponibles:</strong> {selectedModulo.aulasDisponibles ?? 0}
          </div>
        </div>
      )}

      {/* Nombre */}
      <div>
        <label className="block mb-1">Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Capacidad */}
      <div>
        <label className="block mb-1">Capacidad</label>
        <input
          type="number"
          name="capacidad"
          value={form.capacidad}
          onChange={handleChange}
          className="w-full border rounded p-2"
          min={1}
          required
        />
      </div>

      {/* Estado */}
      <div>
        <label className="block mb-1">Estado</label>
        <select
          name="estado"
          value={String(form.estado)}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>

      {/* Tipo de Aula */}
      <div>
        <label className="block mb-1">Tipo</label>
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="AUL">Aula Regular</option>
          <option value="LAB">Laboratorio</option>
          <option value="TAL">Taller</option>
          <option value="AUD">Auditorio</option>
          <option value="COM">Sala de Computación</option>
          <option value="GIM">Gimnasio</option>
          <option value="BIB">Biblioteca</option>
        </select>
      </div>

      {/* Piso */}
      {selectedModulo && (
        <div>
          <label className="block mb-1">Piso</label>
          <select
            name="piso"
            value={form.piso}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            {Array.from({ length: selectedModulo.pisos }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>
                {n}° piso
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Equipamiento */}
      <div>
        <label className="block mb-1">Equipamiento</label>
        <textarea
          name="equipamiento"
          value={form.equipamiento ?? ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Pizarra blanca, 25 sillas, 25 mesas..."
        />
      </div>
    </FormModal>
  );
}
