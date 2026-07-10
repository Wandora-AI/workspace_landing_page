import { Link, NavLink, Outlet } from "react-router-dom";
import wandoraLogo from "../../../assets/wandora-logo.svg";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      <header className="layout__header">
        <Link to="/landing_page" className="layout__brand">
          <img src={wandoraLogo} alt="Wandora" className="layout__logo" />
          <span className="layout__workspace">Workspace</span>
        </Link>
        <nav className="layout__nav">
          <NavLink
            to="/landing_page/config"
            className={({ isActive }) =>
              isActive ? "layout__nav-link layout__nav-link--active" : "layout__nav-link"
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
