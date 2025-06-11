import { Plus } from "lucide-react";
import AxiosInstance from "../../../../components/AxiosInstance";
import GradosTable from "./components/GradoTable";
import GradoFormModal from "./components/GradoForm";
import { Grado } from "@/app/modelos/Academico";
import { UnidadEducativa, Colegio } from "@/app/modelos/Institucion";
import { useState, useEffect } from "react";

export default function AcademicoGrados() {
  const [grados, setGrados] = useState<Grado[]>([]);
  const [unidades, setUnidades] = useState<UnidadEducativa[]>([]);
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof Grado>("nivel_educativo");
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editGrado, setEditGrado] = useState<Grado | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      AxiosInstance.get<Grado[]>("/academico/grados/listar/"),
      AxiosInstance.get<UnidadEducativa[]>("/institucion/unidades-educativas/listar/"),
      AxiosInstance.get<Colegio[]>("institucion/colegios/listar/")
    ])
      .then(([resG, resU, resC]) => {
        const gradosCamel: Grado[] = resG.data.map(g => ({
          id:                g.id,
          nivel_educativo:   g.nivel_educativo,
          numero:            g.numero,
          unidad_educativa: g.unidad_educativa,
          nombre:            g.nombre,
        }));
        setGrados(gradosCamel);
        setUnidades(resU.data);
        setColegios(resC.data);
      })
      .catch(() => setError("No se pudieron cargar grados o unidades."))
      .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key: keyof Grado) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este grado?")) return;
    try {
      await AxiosInstance.delete(`/academico/grados/${id}/eliminar/`);
      setGrados(prev => prev.filter(g => g.id !== id));
    } catch {
      alert("Error al eliminar grado.");
    }
  };
  

  const handleEdit = (g: Grado | null) => {
    setEditGrado(g);
    setModalOpen(true);
  };

  const handleSave = async (grado: Grado) => {
    try {
      if (grado.id && grado.id !== 0) {
        // Editar
        const resp = await AxiosInstance.put(`/academico/grados/${grado.id}/editar/`, grado);
        setGrados(prev => prev.map(g => (g.id === grado.id ? resp.data : g)));
      } else {
        // Crear
        const resp = await AxiosInstance.post("/academico/grados/crear/", grado);
        setGrados(prev => [...prev, resp.data]);
      }
      setModalOpen(false);
      setEditGrado(null);
    } catch (error) {
      let message = "Error guardando grado: ";
      if (typeof error === "object" && error !== null) {
        if ("response" in error && typeof (error as any).response === "object" && (error as any).response !== null) {
          message += JSON.stringify((error as any).response.data);
        } else if ("message" in error) {
          message += (error as any).message;
        } else {
          message += JSON.stringify(error);
        }
      } else {
        message += String(error);
      }
      alert(message);
    }
  };


  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Grados</h1>
        <button
          onClick={() => handleEdit(null)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Nuevo
        </button>
      </header>

      {loading && <div className="text-center">Cargando…</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}

      {!loading && !error && (
        <GradosTable
          grados={grados}
          unidades={unidades}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {modalOpen && (
        <GradoFormModal
          initial={editGrado}
          unidades={unidades}
          colegios={colegios}
          onCancel={() => { setModalOpen(false); setEditGrado(null); }}
          onSave={handleSave}
        />
      )}
      {/* To debug, use console.log above the return or display the value below */}
    </section>
  );
}