import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AxiosInstance from "@/components/AxiosInstance";
import GradoForm from "./components/GradoForm";
import { Grado } from "@/app/modelos/Academico";
import {UnidadEducativa } from "@/app/modelos/Institucion";
import GradoTable from "./components/GradoTable";
import { AxiosResponse } from "axios";

export default function SuperAdminGrados() {
  const [grados, setGrados] = useState<Grado[]>([]);
  const [unidadesEducativas, setUnidadesEducativas] = useState<UnidadEducativa[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editGrado, setEditGrado] = useState<Grado | null>(null);

  useEffect(() => {
    AxiosInstance.get<Grado[]>("/academico/listar-grados/")
      .then((res) => setGrados(res.data))
      .catch(() => alert("No se pudieron cargar los grados."));
    AxiosInstance.get<UnidadEducativa[]>("/institucion/listar-unidades-educativas/")
      .then((res) => setUnidadesEducativas(res.data))
      .catch(() => alert("No se pudieron cargar las unidades educativas."));
  }, []);

  const handleSave = async (form: Grado) => {
    try {
      let res: AxiosResponse<Grado>;
      if (editGrado) {
        res = await AxiosInstance.put<Grado>(`/academico/editar-grado/${editGrado.id}/`, form);
        setGrados((prev) =>
          prev.map((c) => (c.id === editGrado.id ? res.data : c))
        );
      } else {
        res = await AxiosInstance.post<Grado>("/academico/crear-grado/", form);
        setGrados((prev) => [...prev, res.data]);
      }
      setShowForm(false);
      setEditGrado(null);
    } catch (err) {
      console.error("Error al guardar grado:", err);
      alert("Ocurrió un error al guardar el grado.");
    }
  };

  const handleDelete = async (gradoId: number) => {
    if (!confirm("¿Eliminar este grado?")) return;
    try {
      await AxiosInstance.delete(`/academico/eliminar-grado/${gradoId}/`);
      setGrados((prev) => prev.filter((c) => c.id !== gradoId));
    } catch (err) {
      console.error("Error al eliminar grado:", err);
      alert("Error al eliminar el grado.");
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">Grados</h2>
        <button
          onClick={() => {
            setEditGrado(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" /> Nuevo Grado
        </button>
      </header>

      <GradoTable
        unidadesEducativas={unidadesEducativas}
        grados={grados}
        onEdit={(c) => {
          setEditGrado(c);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />

      {showForm && (
        <GradoForm
          grados={grados}
          unidadesEducativas={unidadesEducativas}
          initial={editGrado ?? undefined}
          onCancel={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </section>
  );
}
