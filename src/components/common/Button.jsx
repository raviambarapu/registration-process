export default function Button({ loading = false, children, variant = "primary", ...props }) {
  return (
    <button className={`btn btn--${variant}`} disabled={loading || props.disabled} {...props}>
      {loading ? <span className="spinner" aria-hidden="true" /> : null}
      {loading ? "Please wait..." : children}
    </button>
  );
}
