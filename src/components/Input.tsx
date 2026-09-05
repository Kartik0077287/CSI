import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({ label, error, hint, id, className = "", ...rest }: InputProps) {
  const inputId = id || rest.name;
  return (
    <div>
      {label && <label htmlFor={inputId} className="label-field">{label}</label>}
      <input
        id={inputId}
        className={`input-field ${error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...rest}
      />
      {error && <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-500">{error}</p>}
      {!error && hint && <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-ink-400">{hint}</p>}
    </div>
  );
}
