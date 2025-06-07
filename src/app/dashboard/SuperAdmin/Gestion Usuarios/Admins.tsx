import { Admin } from "@/app/modelos/Usuarios";

import { useState, useEffect } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import AdminTable from "./components/AdminTable";
import { Row } from "./components/AdminTable";
import AdminFormModal from "./components/AdminFormModal";

export const SuperAdminAdmins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<keyof Row>("id");
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    setLoading(true);
    AxiosInstance.get<Admin[]>("/user/auth/admins/listar-admins/")
      .then((res) => setAdmins(res.data))
      .catch(() => setError("No se pudieron cargar los administradores."))
      .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key: keyof Row) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(true);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este administrador?")) return;
    try {
      await AxiosInstance.delete(`/user/auth/admins/${id}/eliminar-admin/`);
      setAdmins((prev) => prev.filter((a) => a.usuario.id !== id));
    } catch {
      alert("Error al eliminar el administrador.");
    }
  };

  const handleEdit = (a: number | null) => {
    const admin = admins.find((adm) => adm.usuario.id === a);

    if (!admin) return;
    setEditAdmin(admin);
    setModalOpen(true);
  };

  const handleSave = (a: Admin) => {
    if (editAdmin) {
      const updatedAdmin = {
        ...editAdmin,
        ...a,
      };
      setAdmins((prev) =>
        prev.map((adm) => (adm.usuario.id === updatedAdmin.usuario.id ? updatedAdmin : adm))
      );
    }
  }

  console.log(admins)

  return (
    <section>
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Administradores</h1>
        <button
          onClick={() => { setEditAdmin(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo
        </button>
      </header>

      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}

      {!loading && !error && (
        <AdminTable
          admins={admins}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {modalOpen && (
        <AdminFormModal
          initial={editAdmin}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}