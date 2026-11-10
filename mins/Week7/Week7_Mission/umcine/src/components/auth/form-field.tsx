import type { InputHTMLAttributes, ReactNode } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  action?: ReactNode;
  icon?: "mail" | "lock";
}

export function FormField({ label, error, hint, action, icon, id, ...props }: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className={`field-control${icon ? " field-with-icon" : ""}`}>
        {icon && (
          <span className="field-icon">
            <img src={`/icons/auth/${icon}.svg`} alt="" />
          </span>
        )}
        <input
          {...props}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? `${id}-message` : undefined}
        />
        {action}
      </div>
      {(hint || error) && (
        <div id={`${id}-message`}>
          {hint && <p className="field-hint">{hint}</p>}
          {error && (
            <p className="field-error" aria-live="polite">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
