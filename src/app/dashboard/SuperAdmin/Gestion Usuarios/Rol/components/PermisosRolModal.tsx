import { useEffect, useState } from "react";
import { Rol, PermisoRol, Accion, ModeloPermitido } from "@/app/modelos/Usuarios";
import { getPermisosByRol, crearPermisoRol, eliminarPermisoRol } from "../api/permisoRol";
import AxiosInstance from "@/components/AxiosInstance";

type Props = {
  rol: Rol;
  onClose: () => void;
};

const PermisosRolModal = ({ rol, onClose }: Props) => {
  const [permisos, setPermisos] = useState<PermisoRol[]>([]);
  const [acciones, setAcciones] = useState<Accion[]>([]);
  const [modelos, setModelos] = useState<ModeloPermitido[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar acciones y modelos permitidos
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getPermisosByRol(rol.id),
      AxiosInstance.get<Accion[]>("/user/auth/acciones/").then(r => r.data),
      AxiosInstance.get<ModeloPermitido[]>("/user/auth/modelos-permitidos/").then(r => r.data),
    ])
      .then(([permisosRes, accionesRes, modelosRes]) => {
        setPermisos(permisosRes);
        setAcciones(accionesRes);
        setModelos(modelosRes);
      })
      .finally(() => setLoading(false));
  }, [rol.id]);


  // Utilidad para capitalizar y reemplazar guiones bajos por espacios
  function toTitleCase(str: string) {
    return str
      .replace(/_/g, " ")
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
  }

  console.log(permisos)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl flex flex-col max-h-[90vh] w-full max-w-4xl mx-2 md:mx-auto"
        style={{ minWidth: 320 }}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-bold">Permisos de: {rol.nombre}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Cerrar
          </button>
        </div>
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar de modelos */}
          <aside className="hidden md:block bg-gray-50 border-r w-48 overflow-y-auto">
            <ul>
              {modelos.map(m => (
                <li key={m.id} className="px-4 py-2 border-b text-xs truncate">
                  {toTitleCase(m.nombre)}
                </li>
              ))}
            </ul>
          </aside>
          {/* Tabla de permisos */}
          <div className="flex-1 overflow-auto p-2">
            {loading ? (
              <div className="text-center py-8">Cargando permisos...</div>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full text-xs border">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 bg-gray-100 sticky left-0 z-10">Modelo</th>
                      {acciones.map(a => (
                        <th key={a.id} className="px-2 py-1">{toTitleCase(a.nombre)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modelos.map(m => (
                      <tr key={m.id}>
                        <td className="px-2 py-1 bg-gray-50 sticky left-0 z-10">{toTitleCase(m.nombre)}</td>
                        {acciones.map(a => {
                          // Busca el permiso existente por IDs
                          const permisoExistente = permisos.find(
                            p =>
                              (typeof p.rol === "number" ? p.rol : p.rol.id) === rol.id &&
                              (typeof p.modelo === "number" ? p.modelo : p.modelo.id) === m.id &&
                              (typeof p.accion === "number" ? p.accion : p.accion.id) === a.id
                          );
                          const checked = !!permisoExistente;
                          return (
                            <td key={a.id} className="px-2 py-1 text-center">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={async () => {
                                  try {
                                    if (checked && permisoExistente) {
                                      // Si está marcado, elimina el permiso
                                      await eliminarPermisoRol(permisoExistente.id);
                                    } else if (!checked) {
                                      // Si no está marcado, crea el permiso
                                      await crearPermisoRol({
                                        rol_id: rol.id,
                                        modelo_id: m.id,
                                        accion_id: a.id,
                                      });
                                    }
                                    // Recarga permisos
                                    const nuevos = await getPermisosByRol(rol.id);
                                    setPermisos(nuevos);
                                  } catch (err: any) {
                                    const msg = err.response?.data?.non_field_errors?.[0];
                                    if (msg && msg.includes("deben formar un conjunto único")) {
                                      alert("Este permiso ya existe para este rol.");
                                    } else {
                                      alert("Error: " + JSON.stringify(err.response?.data || err.message));
                                    }
                                  }
                                }}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default PermisosRolModal;
