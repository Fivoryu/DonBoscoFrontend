import { useState } from "react";
import { X, LogOut } from "lucide-react";
import AxiosInstance from "../../../../components/AxiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;



interface Props {
  user:  {
    nombre: string;
    apellido: string;
    email: string;
    fecha_nacimiento: string;
    username: string;
    foto: string | File | null;
  };
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function PerfilModal({ user, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    ...user,
    password: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    fotoFile: null as File | null,
    fotoPreview: typeof user.foto === "string" ? user.foto : null,
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    const preview = file ? URL.createObjectURL(file) : form.fotoPreview;
    setForm((f) => ({ ...f, fotoFile: file, fotoPreview: preview }));
  };

  const guardar = () => {
    setPasswordError(null);
    // Si algún campo de contraseña está lleno, validar
    if (form.currentPassword || form.newPassword || form.confirmPassword) {
      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        setPasswordError("Completa todos los campos de contraseña para cambiarla.");
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        setPasswordError("Las nuevas contraseñas no coinciden.");
        return;
      }
    }
    // Prepara los datos a enviar
    const dataToSend = {
      ...form,
      password: form.newPassword ? form.newPassword : undefined,
      currentPassword: form.currentPassword ? form.currentPassword : undefined,
    };
    onSave(dataToSend);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await AxiosInstance.post("/user/auth/usuarios/logout/");
      localStorage.removeItem("token");
      localStorage.removeItem("datosDeloUsuario");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("No se pudo cerrar la sesión. Intenta de nuevo.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="
          bg-white rounded-xl shadow-lg
          w-full max-w-lg
          mx-2
          p-0
          sm:p-6
          relative
          flex flex-col
          max-h-[95vh]
        "
      >
        <div className="overflow-y-auto p-6 flex-1">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold text-blue-600 mb-4">Mi perfil</h2>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            {form.fotoPreview ? (
              <img
                src={
                  form.fotoPreview?.startsWith("/media/")
                    ? `${API_BASE_URL}${form.fotoPreview}`
                    : form.fotoPreview
                }
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-2xl font-semibold">
                {user.nombre[0]}
              </div>
            )}
            <label className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-lg cursor-pointer text-sm">
              Cambiar foto
              <input type="file" accept="image/*" onChange={changeFile} className="hidden" />
            </label>
          </div>

          {/* Formulario */}
          <div className="space-y-4">
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Nombre"
            />
            <input
              value={form.apellido}
              onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Apellido"
            />
            <input
              type="date"
              value={form.fecha_nacimiento}
              onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Correo"
            />
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Usuario"
            />
            {/* Sección de cambio de contraseña */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cambiar contraseña</label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mb-2"
                placeholder="Contraseña actual"
                autoComplete="current-password"
              />
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mb-2"
                placeholder="Nueva contraseña"
                autoComplete="new-password"
              />
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Confirmar nueva contraseña"
                autoComplete="new-password"
              />
              {passwordError && (
                <div className="text-red-600 text-sm mt-1">{passwordError}</div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Deja los campos vacíos si no deseas cambiar la contraseña.
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-between items-center px-6 pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={guardar}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
