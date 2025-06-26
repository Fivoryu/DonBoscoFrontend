import SchoolSelect from "../../../components/SchoolSelect";

export default function SelectSchoolStep({ value, onChange }: { value?: number; onChange: (id: number) => void }) {
  return (
    <div>
      <label className="block mb-2 font-semibold">Seleccione un colegio</label>
      <SchoolSelect value={value} onChange={onChange} />
    </div>
  );
}