import { useState } from "react";
import { useField } from "formik";

export default function FormInput({ label, type = "text", ...props }) {
  const [field, meta] = useField(props);
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const hasError = meta.touched && meta.error;

  return (
    <div className={`field ${hasError ? "field--error" : ""}`}>
      <label htmlFor={props.name}>{label}</label>
      <div className="field__control">
        <input
          id={props.name}
          type={isPassword && show ? "text" : type}
          aria-invalid={!!hasError}
          aria-describedby={hasError ? `${props.name}-error` : undefined}
          {...field}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="field__toggle"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {hasError && (
        <span id={`${props.name}-error`} className="field__error" role="alert">
          {meta.error}
        </span>
      )}
    </div>
  );
}
