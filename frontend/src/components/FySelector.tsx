interface Props { value: string; onChange: (v: string) => void; }

const FY_OPTIONS = ['2026-27', '2025-26', '2024-25'];

export function FySelector({ value, onChange }: Props) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm">
      {FY_OPTIONS.map((fy) => <option key={fy} value={fy}>{fy}</option>)}
    </select>
  );
}
