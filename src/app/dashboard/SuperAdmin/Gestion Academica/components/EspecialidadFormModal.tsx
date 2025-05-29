import { useState, useEffect } from "react";
import FormModal from "@/components/FormModal";
import AxiosInstance from "@/components/AxiosInstance";
import { Especialidad } from "@/app/modelos/Personal";
import { Materia, Grado } from "@/app/modelos/Academico";
import { Colegio, UnidadEducativa } from "@/app/modelos/Institucion";

interface Props {
  initial: Especialidad | null;
  colegios: Colegio[];
  unidades: UnidadEducativa[];
  grados: Grado[];
  materias: Materia[];
  onCancel: () => void;
  onSave: (e: Especialidad) => void;
}

export default function EspecialidadFormModal({
  initial,
  colegios,
  unidades,
  grados,
  materias,
  onCancel,
  onSave,
}: Props) {
  const [selectedColegioId, setSelectedColegioId] = useState<number>(
    initial?.grado?.unidad_educativa?.colegio?.id ?? 0
  );
  const [selectedUnidadId, setSelectedUnidadId] = useState<number>(
    initial?.grado?.unidad_educativa.id ?? 0
  );
  const [selectedGradoId, setSelectedGradoId] = useState<number>(
    initial?.grado?.id ?? 0
  );
  const [selectedMateriaId, setSelectedMateriaId] = useState<number>(
    initial?.materia.id ?? 0
  );

  const [filteredUnidades, setFilteredUnidades] = useState<UnidadEducativa[]>([]);
  const [filteredGrados, setFilteredGrados] = useState<Grado[]>([]);
  const [nombre, setNombre] = useState<string>(initial?.nombre ?? "");

  // Filtrar unidades cuando cambie colegio
  useEffect(() => {
    if (selectedColegioId) {
      const fu = unidades.filter(
        u => u.colegio.id === selectedColegioId
      );
      setFilteredUnidades(fu);
      if (!fu.some(u => u.id === selectedUnidadId)) {
        setSelectedUnidadId(0);
      }
    } else {
      setFilteredUnidades([]);
      setSelectedUnidadId(0);
    }
  }, [selectedColegioId, unidades, selectedUnidadId]);

  // Sincronizar colegio y filtrar grados cuando cambie unidad
  useEffect(() => {
    if (selectedUnidadId) {
      const ue = unidades.find(u => u.id === selectedUnidadId);
      if (ue && ue.colegio.id !== selectedColegioId) {
        setSelectedColegioId(ue.colegio.id);
      }
      const fg = grados.filter(
        g => g.unidad_educativa.id === selectedUnidadId
      );
      setFilteredGrados(fg);
      if (!fg.some(g => g.id === selectedGradoId)) {
        setSelectedGradoId(0);
      }
    } else {
      setFilteredGrados([]);
      setSelectedGradoId(0);
    }
  }, [selectedUnidadId, unidades, grados, selectedColegioId, selectedGradoId]);

  // Actualizar nombre automático al cambiar materia o grado
  useEffect(() => {
    const mat = materias.find(m => m.id === selectedMateriaId);
    const grad = grados.find(g => g.id === selectedGradoId);
    let newName = "";
    if (mat && grad) {
      newName = `${mat.nombre} de ${grad.nombre}`;
    } else if (mat) {
      newName = mat.nombre;
    } else if (grad) {
      newName = grad.nombre;
    }
    setNombre(newName);
  }, [selectedMateriaId, selectedGradoId, materias, grados]);

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      alert("Debe indicar un nombre de especialidad");
      return;
    }
    try {
      let resp;
      const payload = {
        nombre,
        materia: selectedMateriaId,
        grado: selectedGradoId,
      };
      if (initial?.id) {
        // Editar existente
        resp = await AxiosInstance.put(
          `/personal/especialidades/${initial.id}/editar/`,
          payload
        );
      } else {
        // Crear nueva especialidad
        resp = await AxiosInstance.post(
          `/personal/especialidades/crear/`,
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
      title={initial?.id ? "Editar Especialidad" : "Nueva Especialidad"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel="Guardar"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Colegio</label>
          <select
            className="w-full border rounded p-2"
            value={selectedColegioId}
            onChange={e => setSelectedColegioId(Number(e.target.value))}
          >
            <option value={0}>— Selecciona —</option>
            {colegios.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Unidad Educativa</label>
          <select
            className="w-full border rounded p-2"
            value={selectedUnidadId}
            onChange={e => setSelectedUnidadId(Number(e.target.value))}
          >
            <option value={0}>— Selecciona —</option>
            {filteredUnidades.map(u => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Grado</label>
          <select
            className="w-full border rounded p-2"
            value={selectedGradoId}
            onChange={e => setSelectedGradoId(Number(e.target.value))}
          >
            <option value={0}>— Selecciona —</option>
            {filteredGrados.map(g => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Materia</label>
          <select
            className="w-full border rounded p-2"
            value={selectedMateriaId}
            onChange={e => setSelectedMateriaId(Number(e.target.value))}
          >
            <option value={0}>— Selecciona —</option>
            {materias.map(m => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block mb-1">Nombre de Especialidad</label>
          <input
            type="text"
            value={nombre}
            readOnly
            className="w-full border rounded p-2 bg-gray-100"
          />
        </div>
      </div>
    </FormModal>
  );
}
