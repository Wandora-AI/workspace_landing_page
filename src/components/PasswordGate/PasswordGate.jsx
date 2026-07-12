import { useState } from "react";
import wandoraLogo from "../../../assets/wandora-logo-wide-white.png";
import {
  AUTH_STORAGE_KEYS,
  clearConfigAuthPassword,
  persistConfigAuthPassword,
} from "../../config/auth";
import "./PasswordGate.css";

function readStoredAuth(storageKey) {
  try {
    return sessionStorage.getItem(storageKey) === "true";
  } catch {
    return false;
  }
}

function persistAuth(storageKey, value) {
  try {
    if (value) {
      sessionStorage.setItem(storageKey, "true");
    } else {
      sessionStorage.removeItem(storageKey);
      if (storageKey === AUTH_STORAGE_KEYS.config) {
        clearConfigAuthPassword();
      }
    }
  } catch {
    // sessionStorage may be unavailable in some contexts
  }
}

export default function PasswordGate({
  children,
  expectedPassword,
  storageKey,
  badge = "Team Access",
  title = "Workspace",
  subtitle = "Enter the team password to access internal tools and links.",
  placeholder = "Enter team password",
}) {
  const [authenticated, setAuthenticated] = useState(() =>
    readStoredAuth(storageKey)
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!expectedPassword) {
      setError("Password is not configured. Set the required env variable.");
      return;
    }
    if (password === expectedPassword) {
      persistAuth(storageKey, true);
      if (storageKey === AUTH_STORAGE_KEYS.config) {
        persistConfigAuthPassword(password);
      }
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
    <div className="password-gate">
      <div className="password-gate__panel">
        <img
          src={wandoraLogo}
          alt="Wandora"
          className="password-gate__logo"
        />
        <span className="password-gate__badge">{badge}</span>
        <h1 className="password-gate__title">{title}</h1>
        <p className="password-gate__subtitle">{subtitle}</p>

        <form className="password-gate__form" onSubmit={handleSubmit}>
          <label className="password-gate__field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder={placeholder}
              autoComplete="current-password"
              autoFocus
            />
          </label>

          {error && <p className="password-gate__error">{error}</p>}

          <button type="submit" className="btn btn--primary password-gate__submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
