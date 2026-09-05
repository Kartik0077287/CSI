import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export default function Select({ label, error, options, placeholder, id, className = "", ...rest }: SelectProps) {
  const selectId = id || rest.name;
  return (
    <div>
      {label && <label htmlFor={selectId} className="label-field">{label}</label>}
      <select
        id={selectId}
        className={`input-field ${error ? "border-red-300" : ""} ${className}`}
        aria-invalid={!!error}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
