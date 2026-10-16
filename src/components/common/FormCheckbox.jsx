import { useField } from "formik";

export default function FormCheckbox({ label, ...props }) {
  const [field, meta] = useField({ ...props, type: "checkbox" });
  const hasError = meta.touched && meta.error;

  return (
    <div className={`field field--check ${hasError ? "field--error" : ""}`}>
      <label className="check">
        <input type="checkbox" {...field} {...props} />
        <span>{label}</span>
      </label>
      {hasError && <span className="field__error" role="alert">{meta.error}</span>}
    </div>
  );
}
