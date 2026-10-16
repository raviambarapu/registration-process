import Button from "../common/Button.jsx";

export default function SuccessCard({ user, onLogin, onReset }) {
  return (
    <div className="success">
      <div className="success__icon">✓</div>
      <h2>Welcome, {user.firstName}!</h2>
      <p>Your account was saved in this browser. You can now log in.</p>
      <p className="success__meta">
        Registered email: <strong>{user.email}</strong> · ID #{user.id}
      </p>
      <div className="success__actions">
        <Button type="button" onClick={onLogin}>
          Continue to login
        </Button>
        <Button type="button" variant="secondary" onClick={onReset}>
          Register another user
        </Button>
      </div>
    </div>
  );
}
