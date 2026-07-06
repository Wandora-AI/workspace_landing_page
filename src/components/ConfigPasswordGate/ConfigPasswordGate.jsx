import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ConfigPasswordGate.css";

const TEAM_PASSWORD = "Wandora";

export default function ConfigPasswordGate({ children }) {
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthenticated(false);
    setPassword("");
    setError("");
  }, [location.key]);

  function handleSubmit(e) {
    e.preventDefault();
    if (password === TEAM_PASSWORD) {
      setAuthenticated(true);
      setError("");
      return;
    }
    setError("Incorrect password. Please try again.");
    setPassword("");
  }

  if (authenticated) {
    return children;
  }

  return (
    <div className="config-gate">
      <div className="config-gate__panel">
        <span className="config-gate__badge">Team Access</span>
        <h1 className="config-gate__title">Config Area</h1>
        <p className="config-gate__subtitle">
          Enter the team password to manage applications.
        </p>

        <form className="config-gate__form" onSubmit={handleSubmit}>
          <label className="config-gate__field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter team password"
              autoComplete="current-password"
              autoFocus
            />
          </label>

          {error && <p className="config-gate__error">{error}</p>}

          <button type="submit" className="btn btn--primary config-gate__submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
