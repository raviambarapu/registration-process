import { useField } from "formik";

export default function FormSelect({ label, options, placeholder = "Select", ...props }) {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <div className={`field ${hasError ? "field--error" : ""}`}>
      <label htmlFor={props.name}>{label}</label>
      <div className="field__control">
        <select id={props.name} aria-invalid={!!hasError} {...field} {...props}>
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {hasError && <span className="field__error" role="alert">{meta.error}</span>}
    </div>
  );
}
