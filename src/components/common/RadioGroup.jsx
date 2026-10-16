import { useField } from "formik";

export default function RadioGroup({ label, options, ...props }) {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <div className={`field ${hasError ? "field--error" : ""}`}>
      <span className="field__label">{label}</span>
      <div className="radio-group">
        {options.map((o) => (
          <label key={o.value} className="radio">
            <input
              type="radio"
              {...field}
              value={o.value}
              checked={field.value === o.value}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {hasError && <span className="field__error" role="alert">{meta.error}</span>}
    </div>
  );
}
