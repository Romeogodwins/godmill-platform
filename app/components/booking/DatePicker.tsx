import type { ChangeEvent } from "react";

interface DatePickerProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  min?: string;
}

export default function DatePicker({
  id,
  label,
  name,
  value,
  onChange,
  error,
  min,
}: DatePickerProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-gray-200">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
        min={min}
        className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-[#d4b16f]"
      />
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
