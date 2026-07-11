import { Link, NavLink, Outlet } from "react-router-dom";
import wandoraLogo from "../../../assets/wandora-logo-cropped-preview.png";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__brand">
          <Link to="/landing_page" className="layout__logo-link">
            <img src={wandoraLogo} alt="Wandora" className="layout__logo" />
          </Link>
          <span className="layout__divider" aria-hidden="true" />
          <NavLink
            to="/landing_page"
            end
            className={({ isActive }) =>
              isActive
                ? "layout__nav-link layout__nav-link--workspace layout__nav-link--active"
                : "layout__nav-link layout__nav-link--workspace"
            }
          >
            Workspace
          </NavLink>
        </div>
        <nav className="layout__nav">
          <NavLink
            to="/landing_page/config"
            className={({ isActive }) =>
              isActive
                ? "layout__nav-link layout__nav-link--config layout__nav-link--active"
                : "layout__nav-link layout__nav-link--config"
            }
          >
            Config
          </NavLink>
        </nav>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
