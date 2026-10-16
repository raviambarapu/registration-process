import { useEffect, useState } from "react";
import Button from "../common/Button.jsx";
import { getMembers } from "../../services/api.js";

const courseLabels = {
  frontend: "Frontend Development",
  fullstack: "Full Stack Development",
  data: "Data Analytics",
  python: "Python Programming",
};

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Not recorded";

export default function Dashboard({ user, onLogout }) {
  const [report, setReport] = useState(null);
  const [reportError, setReportError] = useState("");

  useEffect(() => {
    let active = true;
    getMembers()
      .then((data) => {
        if (active) setReport(data);
      })
      .catch((error) => {
        if (active) setReportError(error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  const members = report?.members || [];
  const totals = report?.totals || { registeredMembers: 0, successfulLogins: 0 };

  return (
    <div className="dashboard">
      <div className="success">
        <div className="success__icon">✓</div>
        <h2>Welcome back, {user.firstName}!</h2>
        <p>You are logged in to the registration portal.</p>
        <p className="success__meta">
          <strong>{user.email}</strong>
          {user.course ? ` · ${courseLabels[user.course] || user.course}` : ""}
          {user.id ? ` · ID #${user.id}` : ""}
        </p>
        <Button type="button" variant="secondary" onClick={onLogout}>
          Log out
        </Button>
      </div>

      <section className="member-report" aria-labelledby="member-report-title">
        <div className="member-report__header">
          <div>
            <h2 id="member-report-title">Member activity</h2>
            <p>Registration and successful login totals from PostgreSQL.</p>
          </div>
        </div>

        <div className="member-report__stats">
          <article className="member-stat">
            <span className="member-stat__label">Registered members</span>
            <strong>{totals.registeredMembers}</strong>
          </article>
          <article className="member-stat">
            <span className="member-stat__label">Successful logins</span>
            <strong>{totals.successfulLogins}</strong>
          </article>
        </div>

        <div className="member-report__table-wrap">
          <table className="member-table">
            <caption>Registered member details and login activity</caption>
            <thead>
              <tr>
                <th scope="col">Member</th>
                <th scope="col">Email</th>
                <th scope="col">Course</th>
                <th scope="col">Registered</th>
                <th scope="col">Logins</th>
                <th scope="col">Last login</th>
              </tr>
            </thead>
            <tbody>
              {reportError ? (
                <tr>
                  <td colSpan="6" className="member-table__empty">{reportError}</td>
                </tr>
              ) : report === null ? (
                <tr>
                  <td colSpan="6" className="member-table__empty">Loading member activity…</td>
                </tr>
              ) : members.length ? (
                members.map((member) => (
                  <tr key={member.id || member.email}>
                    <td>{[member.firstName, member.lastName].filter(Boolean).join(" ") || "—"}</td>
                    <td>{member.email}</td>
                    <td>{courseLabels[member.course] || member.course || "—"}</td>
                    <td>{formatDate(member.registeredAt)}</td>
                    <td>{Number(member.loginCount) || 0}</td>
                    <td>{formatDate(member.lastLoginAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="member-table__empty">
                    No members have registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </section>
    </div>
  );
}
