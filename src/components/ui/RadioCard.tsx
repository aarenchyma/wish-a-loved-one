interface RadioCardProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: string;
  subtitle?: string;
}

export function RadioCard({ name, value, checked, onChange, title, subtitle }: RadioCardProps) {
  return (
    <label
      className={`block cursor-pointer border rounded-xl p-4 transition ${
        checked ? 'border-gray-900 ring-2 ring-gray-900' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <p className="font-medium text-gray-900">{title}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </label>
  );
}