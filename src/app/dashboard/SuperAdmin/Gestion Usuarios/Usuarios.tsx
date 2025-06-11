import AxiosInstance from "../../../../components/AxiosInstance";
import UsuariosTable from "./components/UsuariosTable";
import UsuarioFormModal from "./components/UsuariosFormModal";
import { Usuario } from "../../../modelos/Usuarios";
import { useState, useEffect } from "react";

export default function SuperAdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<keyof Usuario>("ci");
  const [asc, setAsc] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<Usuario | null>(null);

  // Carga inicial
  useEffect(() => {
    console.log("🔄 Cargando usuarios...");
    setLoading(true);
    AxiosInstance.get<Usuario[]>("/user/auth/usuarios/listar-usuarios/")
      .then((res) => {
        console.log("✅ Usuarios cargados:", res.data);
        setUsuarios(res.data);
      })
      .catch((err) => {
        console.error("❌ Error al cargar usuarios:", err);
        setError("No se pudieron cargar los usuarios.");
      })
      .finally(() => {
        console.log("✅ Carga finalizada.");
        setLoading(false);
      });
  }, []);

  // Ordenamiento
  const toggleSort = (key: keyof Usuario) => {
    console.log("↕ Ordenando por:", key);
    if (key === sortKey) {
      setAsc(!asc);
      console.log("🔁 Cambio de orden:", !asc ? "Ascendente" : "Descendente");
    } else {
      setSortKey(key);
      setAsc(true);
      console.log("🔀 Nuevo campo de orden:", key);
    }
  };

  // Borra usuario
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    console.log("🗑️ Eliminando usuario con ID:", id);
    try {
      await AxiosInstance.delete(`/user/auth/usuarios/${id}/eliminar/`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      console.log("✅ Usuario eliminado:", id);
    } catch (err) {
      console.error("❌ Error al eliminar usuario:", err);
      alert("Error al eliminar usuario.");
    }
  };

  // Abre modal en modo “nuevo” o “editar”
  const handleEdit = (u: Usuario | null) => {
    if (u) {
      console.log("✏️ Editando usuario:", u);
    } else {
      console.log("🆕 Creando nuevo usuario");
    }
    setEditUser(u);
    setModalOpen(true);
  };

  // Guarda cambios (crea o edita)
  const handleSave = (u: Usuario) => {
    console.log("💾 Usuario guardado desde modal:", u);

    const onSuccess = (updated: Usuario) => {
      console.log("🔄 Actualizando lista local de usuarios...");
      setUsuarios((prev) =>
        updated.id
          ? prev.map((x) => (x.id === updated.id ? updated : x))
          : [...prev, updated]
      );
      console.log("✅ Lista de usuarios actualizada.");
    };

    handleEdit(null);
    onSuccess(u);
  };

  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Usuarios</h1>
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
        <UsuariosTable
          usuarios={usuarios}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {modalOpen && (
        <UsuarioFormModal
          initial={editUser}
          onCancel={() => setModalOpen(false)}
          onSave={(u) => {
            handleSave(u);
            setModalOpen(false);
          }}
        />
      )}
    </section>
  );
}
