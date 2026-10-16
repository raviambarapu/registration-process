import { useState } from "react";
import RegistrationForm from "./components/registration/RegistrationForm.jsx";
import SuccessCard from "./components/registration/SuccessCard.jsx";
import LoginForm from "./components/login/LoginForm.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import { getSession, clearSession } from "./services/authStorage.js";

export default function App() {
  const [view, setView] = useState("register");
  const [registeredUser, setRegisteredUser] = useState(null);
  const [session, setSession] = useState(() => getSession());

  const goToLogin = () => {
    setRegisteredUser(null);
    setView("login");
  };

  const goToRegister = () => {
    setRegisteredUser(null);
    setView("register");
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setView("login");
  };

  if (session) {
    return (
      <main className="page">
        <section className="card card--narrow">
          <header className="card__header">
            <h1>Your portal</h1>
            <p>You are signed in.</p>
          </header>
          <Dashboard user={session} onLogout={handleLogout} />
        </section>
      </main>
    );
  }

  const isLogin = view === "login";

  return (
    <main className="page">
      <section className={`card ${isLogin ? "card--narrow" : ""}`}>
        <header className="card__header">
          <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
          <p>
            {isLogin
              ? "Log in with the email and password you registered with."
              : "Join the portal in less than a minute."}
          </p>
        </header>

        {registeredUser ? (
          <SuccessCard user={registeredUser} onLogin={goToLogin} onReset={goToRegister} />
        ) : isLogin ? (
          <LoginForm onSuccess={setSession} />
        ) : (
          <RegistrationForm onSuccess={setRegisteredUser} />
        )}

        {!registeredUser && (
          <p className="auth-switch">
            {isLogin ? (
              <>
                New here?{" "}
                <button type="button" className="auth-switch__link" onClick={goToRegister}>
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" className="auth-switch__link" onClick={goToLogin}>
                  Log in
                </button>
              </>
            )}
          </p>
        )}
      </section>
    </main>
  );
}
