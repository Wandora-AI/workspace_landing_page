import { Link, NavLink, Outlet } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      <header className="layout__header">
        <Link to="/landing_page" className="layout__logo">
          wandora.
        </Link>
        <nav className="layout__nav">
          <NavLink
            to="/landing_page"
            end
            className={({ isActive }) =>
              isActive ? "layout__nav-link layout__nav-link--active" : "layout__nav-link"
            }
          >
            Workspace
          </NavLink>
        </nav>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
