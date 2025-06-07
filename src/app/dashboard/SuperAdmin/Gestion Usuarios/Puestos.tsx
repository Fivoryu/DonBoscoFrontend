import { useEffect, useState } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import Table from "@/components/Table";
import FormModal from "@/components/FormModal";
import { Pencil, Trash2 } from "lucide-react";

type Puesto = {
  id: number;
  nombre: string;
  descripcion?: string | null;
};

type Accion = {
  id: number;
  nombre: string;
};

type ModeloPermitido = {
  id: number;
  nombre: string;
};

type PermisoPuesto = {
  id: number;
  puesto: Puesto;
  modelo: ModeloPermitido;
  accion: Accion;
};

export default function SuperAdminPuestos() {
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [permisos, setPermisos] = useState<PermisoPuesto[]>([]);
  const [acciones, setAcciones] = useState<Accion[]>([]);
  const [modelos, setModelos] = useState<ModeloPermitido[]>([]);
  const [selectedPuesto, setSelectedPuesto] = useState<Puesto | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPuesto, setEditPuesto] = useState<Puesto | null>(null);

  // Cargar datos iniciales
  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      AxiosInstance.get<Puesto[]>("/user/auth/puestos/listar-puestos/"),
      AxiosInstance.get<Accion[]>("/user/auth/acciones/"),
      AxiosInstance.get<ModeloPermitido[]>("/user/auth/modelos-permitidos/"),
      // Quita la petición de permisos aquí
    ])
      .then(([puestosRes, accionesRes, modelosRes]) => {
        setPuestos([...puestosRes.data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
        setAcciones([...accionesRes.data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
        setModelos([...modelosRes.data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
        // No setPermisos aquí
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Cargar permisos de un puesto específico
  const fetchPermisosPuesto = async (puestoId: number) => {
    setLoading(true);
    try {
      const resp = await AxiosInstance.get<PermisoPuesto[]>(`/user/auth/permisos-puesto/?puesto_id=${puestoId}`);
      setPermisos(resp.data);
    } finally {
      setLoading(false);
    }
  };

  // Cuando seleccionas un puesto, carga solo sus permisos
  useEffect(() => {
    if (selectedPuesto) {
      fetchPermisosPuesto(selectedPuesto.id);
    } else {
      setPermisos([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPuesto]);

  // Handler para cambiar un permiso (checkbox)
  const handlePermisoChange = async (
    modeloId: number,
    accionId: number,
    checked: boolean
  ) => {
    if (!selectedPuesto) return;
    const permisoExistente = permisos.find(
      p =>
        p.puesto.id === selectedPuesto.id &&
        p.modelo.id === modeloId &&
        p.accion.id === accionId
    );
    if (checked && !permisoExistente) {
      await AxiosInstance.post("/user/auth/permisos-puesto/", {
        puesto_id: selectedPuesto.id,
        modelo_id: modeloId,
        accion_id: accionId,
      });
      fetchPermisosPuesto(selectedPuesto.id); // recarga permisos
    } else if (!checked && permisoExistente) {
      await AxiosInstance.delete(`/user/auth/permisos-puesto/${permisoExistente.id}/`);
      fetchPermisosPuesto(selectedPuesto.id); // recarga permisos
    }
  };

  // Crear o editar puesto
  const handleSavePuesto = async (p: Partial<Puesto>) => {
    try {
      let resp: { data: Puesto };
      if (editPuesto) {
        resp = await AxiosInstance.put(`/user/auth/puestos/editar-puesto/${editPuesto.id}/`, p);
        setPuestos(prev => prev.map(x => (x.id === editPuesto.id ? resp.data : x)));
      } else {
        resp = await AxiosInstance.post("/user/auth/puestos/crear-puesto/", p);
        setPuestos(prev => [...prev, resp.data]);
      }
      setModalOpen(false);
      setEditPuesto(null);
    } catch (err: any) {
      alert("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  // Eliminar puesto
  const handleDeletePuesto = async (id: number) => {
    if (!confirm("¿Eliminar este puesto?")) return;
    try {
      await AxiosInstance.delete(`/user/auth/puestos/eliminar-puesto/${id}/`);
      setPuestos(prev => prev.filter(p => p.id !== id));
      if (selectedPuesto?.id === id) setSelectedPuesto(null);
    } catch {
      alert("Error al eliminar el puesto.");
    }
  };

  // Buscador
  const [search, setSearch] = useState("");
  const filtered = puestos.filter(
    p =>
      p.nombre.toLowerCase().includes(search.trim().toLowerCase()) ||
      (p.descripcion?.toLowerCase().includes(search.trim().toLowerCase()) ?? false)
  );

  // Utilidad para capitalizar y reemplazar guiones bajos por espacios
  function toTitleCase(str: string) {
    return str
      .replace(/_/g, " ")
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
  }

  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Puestos</h1>
        <button
          onClick={() => { setEditPuesto(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo
        </button>
      </header>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar puestos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      {loading && <div className="text-center">Cargando...</div>}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tabla de puestos */}
          <div>
            <Table>
              <thead className="bg-blue-50 text-blue-600 select-none">
                <tr>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Descripción</th>
                  <th className="px-4 py-2">Permisos</th>
                  <th className="px-4 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      Sin puestos
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => (
                    <tr key={p.id} className={selectedPuesto?.id === p.id ? "bg-blue-50" : ""}>
                      <td className="px-4 py-2">{p.nombre}</td>
                      <td className="px-4 py-2">{p.descripcion || "—"}</td>
                      <td className="px-4 py-2">
                        <button
                          className="text-blue-600 underline"
                          onClick={() => setSelectedPuesto(p)}
                        >
                          Gestionar
                        </button>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          className="mr-2 text-blue-600 hover:underline"
                          onClick={() => { setEditPuesto(p); setModalOpen(true); }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDeletePuesto(p.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
          {/* Matriz de permisos */}
          <div>
            {selectedPuesto ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold">
                    Permisos de: {selectedPuesto.nombre}
                  </h2>
                  <button
                    className="text-sm text-gray-500 underline"
                    onClick={() => setSelectedPuesto(null)}
                  >
                    Cerrar
                  </button>
                </div>
                <div className="overflow-auto border rounded">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th className="px-2 py-1">Modelo</th>
                        {acciones.map(a => (
                          <th key={a.id} className="px-2 py-1">{toTitleCase(a.nombre)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {modelos.map(m => (
                        <tr key={m.id}>
                          <td className="px-2 py-1">{toTitleCase(m.nombre)}</td>
                          {acciones.map(a => {
                            // Buscar el permiso directamente en el array de permisos
                            const checked = permisos.some(
                              p =>
                                p.puesto.id === selectedPuesto.id &&
                                p.modelo.id === m.id &&
                                p.accion.id === a.id
                            );
                            return (
                              <td key={a.id} className="px-2 py-1 text-center">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={e =>
                                    handlePermisoChange(m.id, a.id, e.target.checked)
                                  }
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center mt-8">
                Selecciona un puesto para gestionar sus permisos.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal para crear/editar puesto */}
      {modalOpen && (
        <FormModal
          title={editPuesto ? "Editar Puesto" : "Nuevo Puesto"}
          onCancel={() => { setModalOpen(false); setEditPuesto(null); }}
          onSubmit={() => {
            const nombre = (document.getElementById("nombre-puesto") as HTMLInputElement)?.value.trim();
            const descripcion = (document.getElementById("desc-puesto") as HTMLInputElement)?.value.trim();
            if (!nombre) {
              alert("El nombre es obligatorio");
              return;
            }
            handleSavePuesto({ nombre, descripcion });
          }}
        >
          <div>
            <label className="block mb-1">Nombre</label>
            <input
              id="nombre-puesto"
              defaultValue={editPuesto?.nombre || ""}
              className="w-full border rounded p-2"
              autoFocus
            />
          </div>
          <div>
            <label className="block mb-1">Descripción</label>
            <input
              id="desc-puesto"
              defaultValue={editPuesto?.descripcion || ""}
              className="w-full border rounded p-2"
            />
          </div>
        </FormModal>
      )}
    </section>
  );
}
