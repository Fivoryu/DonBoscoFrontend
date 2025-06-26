import UnitSelect from "../../../components/UnitSelect";

export default function SelectUnitStep({ colegioId, value, onChange }: { colegioId?: number; value?: number; onChange: (id: number) => void }) {
  return (
    <div>
      <label className="block mb-2 font-semibold">Seleccione una unidad educativa</label>
      <UnitSelect colegioId={colegioId} value={value} onChange={onChange} />
    </div>
  );
}
