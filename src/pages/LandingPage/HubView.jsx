import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import wandoraLogo from "../../../assets/wandora-logo-cropped-preview.png";
import AppLogo from "../../components/AppLogo/AppLogo";
import SearchBar from "../../components/SearchBar/SearchBar";
import {
  filterGroupedCategories,
  getDisplayHost,
  getEnvBadge,
} from "../../utils/appMeta";
import "./HubView.css";

const ALL = "__all__";

export default function HubView({ groupedCategories }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL);

  const searching = query.trim().length > 0;

  const visibleGroups = useMemo(() => {
    if (searching) return filterGroupedCategories(groupedCategories, query);
    if (activeCategory === ALL) return groupedCategories;
    return groupedCategories.filter(([name]) => name === activeCategory);
  }, [groupedCategories, query, searching, activeCategory]);

  const totalApps = useMemo(
    () => groupedCategories.reduce((sum, [, apps]) => sum + apps.length, 0),
    [groupedCategories]
  );

  const resultCount = visibleGroups.reduce(
    (sum, [, apps]) => sum + apps.length,
    0
  );

  const firstMatch = visibleGroups[0]?.[1][0];

  return (
    <div className="hub">
      <aside className="hub__sidebar">
        <div className="hub__brand">
          <img src={wandoraLogo} alt="Wandora" className="hub__brand-logo" />
          <span className="hub__brand-name">Workspace</span>
        </div>

        <nav className="hub__nav" aria-label="Categories">
          <button
            type="button"
            className={navClass(activeCategory === ALL && !searching)}
            onClick={() => {
              setActiveCategory(ALL);
              setQuery("");
            }}
          >
            <span className="hub__nav-label">All platforms</span>
            <span className="hub__nav-count">{totalApps}</span>
          </button>
          {groupedCategories.map(([name, apps]) => (
            <button
              key={name}
              type="button"
              className={navClass(activeCategory === name && !searching)}
              onClick={() => {
                setActiveCategory(name);
                setQuery("");
              }}
            >
              <span className="hub__nav-label">{name}</span>
              <span className="hub__nav-count">{apps.length}</span>
            </button>
          ))}
        </nav>

        <div className="hub__sidebar-footer">
          <Link to="/landing_page/config" className="hub__settings-link">
            ⚙ Settings
          </Link>
          <p className="hub__hint">
            Press <kbd>/</kbd> to search
          </p>
        </div>
      </aside>

      <main className="hub__content">
        <div className="hub__search-row">
          <SearchBar
            value={query}
            onChange={setQuery}
            resultCount={resultCount}
            placeholder="Find a platform — name, team, or URL…"
            onOpenFirst={
              firstMatch
                ? () =>
                    window.open(firstMatch.url, "_blank", "noopener,noreferrer")
                : undefined
            }
          />
        </div>

        {visibleGroups.length === 0 ? (
          <div className="hub__empty">
            <p className="hub__empty-title">No matches for “{query.trim()}”</p>
            <button
              type="button"
              className="hub__empty-clear"
              onClick={() => setQuery("")}
            >
              Clear search
            </button>
          </div>
        ) : (
          visibleGroups.map(([category, apps]) => (
            <section key={category} className="hub__section">
              <header className="hub__section-header">
                <h2 className="hub__section-title">{category}</h2>
                <span className="hub__section-count">{apps.length}</span>
              </header>
              <div className="hub__rows">
                {apps.map((app, index) => (
                  <HubRow key={app.id} application={app} index={index} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}

function HubRow({ application, index }) {
  const badge = getEnvBadge(application);
  const host = getDisplayHost(application.url);

  return (
    <a
      href={application.url}
      target="_blank"
      rel="noopener noreferrer"
      className="hub-row"
      style={{ "--row-i": Math.min(index, 12) }}
      title={application.description}
    >
      <AppLogo application={application} size={36} />
      <span className="hub-row__text">
        <span className="hub-row__name-line">
          <span className="hub-row__name">{application.name}</span>
          {badge && <span className="hub-row__badge">{badge}</span>}
        </span>
        <span className="hub-row__description">{application.description}</span>
      </span>
      <span className="hub-row__host">{host}</span>
      <span className="hub-row__arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

function navClass(active) {
  return active ? "hub__nav-item hub__nav-item--active" : "hub__nav-item";
}
