interface Permiso {
  modelo: string;
  accion: string;
}

interface Props {
  modelos: string[];
  acciones: string[];
  permisos: Permiso[];
  onChange: (modelo: string, accion: string, checked: boolean) => void;
}

export default function PermisosMatrix({ modelos, acciones, permisos, onChange }: Props) {
  return (
    <table className="table-auto border">
      <thead>
        <tr>
          <th>Modelo</th>
          {acciones.map(a => <th key={a}>{a}</th>)}
        </tr>
      </thead>
      <tbody>
        {modelos.map(modelo => (
          <tr key={modelo}>
            <td>{modelo}</td>
            {acciones.map(accion => {
              const checked = permisos.some(p => p.modelo === modelo && p.accion === accion);
              return (
                <td key={accion}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={e => onChange(modelo, accion, e.target.checked)}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
