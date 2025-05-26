import { Rol } from "@/app/modelos/Usuarios";

import { useState, useEffect } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import RolesTable from "./components/RolesTable";
import RolFormModal from "./components/RolFormModal";


const SuperAdminRoles = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  const [sortKey, setSortKey] = useState<keyof Rol>("id"); 
  const [asc, setAsc] = useState(true);

  const [editRol, setEditRol] = useState<Rol | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    AxiosInstance.get<Rol[]>("/user/auth/roles/listar-roles/")
      .then((res) => setRoles(res.data))
      .catch(() => setError("No se pudieron cargar los roles."))
      .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key: keyof Rol) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(true);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este rol?")) return;
    try {
      await AxiosInstance.delete(`/user/auth/roles/eliminar-rol/${id}/`);
      setRoles((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Error al eliminar rol.");
    }
  }

  const handleEdit = (r: Rol | null) => {
    setEditRol(r);
    setModalOpen(true);
  };

  const handleSave = (r: Rol) => {
    const onSuccess = (updated: Rol) => {
      setRoles((prev) => 
        updated.id
          ? prev.map((x) => (x.id === updated.id ? updated : x))
          : [...prev, updated]
      );
    };
    handleEdit(null);
    setModalOpen(false);
    setEditRol(null);
    onSuccess(r);
  }
  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Roles</h1>
        <button
          onClick={() => handleEdit(null)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo
        </button>
      </header>

      {loading && <div className="text-center">Cargando…</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}

      {!loading && !error && (
        <RolesTable
          roles={roles}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {modalOpen && (
        <RolFormModal
          initial={editRol}
          onCancel={() => {setModalOpen(false); setEditRol(null);}}
          onSave={(r) => {
            handleSave(r);
            setModalOpen(false);
          }}
        />
      )}
    </section>
  );
}

export default SuperAdminRoles
