interface Props { value: string; onChange: (v: string) => void; }

const FY_OPTIONS = ['2026-27', '2025-26', '2024-25'];

export function FySelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
      {FY_OPTIONS.map((fy) => (
        <button
          key={fy}
          onClick={() => onChange(fy)}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
            value === fy ? 'text-white' : 'text-gray-500 hover:text-gray-800'
          }`}
          style={value === fy ? { background: 'var(--accent)' } : undefined}
        >
          {fy}
        </button>
      ))}
    </div>
  );
}
