import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import wandoraLogo from "../../../assets/wandora-logo-cropped-preview.png";
import { useVariant } from "../../variants/VariantContext";
import "./Layout.css";

export default function Layout() {
  const { variant } = useVariant();
  const { pathname } = useLocation();
  // Variant chrome only applies to the workspace home; Settings keeps
  // the classic layout so admin flows stay stable across variants.
  const isWorkspaceHome = pathname.replace(/\/$/, "") === "/landing_page";
  const activeVariant = isWorkspaceHome ? variant : "classic";

  return (
    <div className="layout" data-variant={activeVariant}>
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
            Settings
          </NavLink>
        </nav>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
