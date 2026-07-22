import { useMemo, useState } from "react";
import AppLogo from "../../components/AppLogo/AppLogo";
import SearchBar from "../../components/SearchBar/SearchBar";
import {
  filterGroupedCategories,
  getDisplayHost,
  getEnvBadge,
} from "../../utils/appMeta";
import "./BentoView.css";

const CATEGORY_TINTS = [
  "#ef5b2b",
  "#0f8a6d",
  "#7752e0",
  "#0e7fbf",
  "#c9426d",
  "#c98a1b",
];

export default function BentoView({ groupedCategories }) {
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  const tintByCategory = useMemo(() => {
    const map = new Map();
    groupedCategories.forEach(([name], index) => {
      map.set(name, CATEGORY_TINTS[index % CATEGORY_TINTS.length]);
    });
    return map;
  }, [groupedCategories]);

  const visibleGroups = useMemo(
    () => filterGroupedCategories(groupedCategories, query),
    [groupedCategories, query]
  );

  const resultCount = visibleGroups.reduce(
    (sum, [, apps]) => sum + apps.length,
    0
  );

  const firstMatch = visibleGroups[0]?.[1][0];

  return (
    <div className="bento">
      <header className="bento__hero">
        <h1 className="bento__title">Find your platform.</h1>
        <p className="bento__subtitle">
          Every Wandora tool — storefronts, socials, finance, marketing — one
          click away.
        </p>
        <div className="bento__search">
          <SearchBar
            value={query}
            onChange={setQuery}
            resultCount={resultCount}
            placeholder="Search platforms…"
            onOpenFirst={
              firstMatch
                ? () =>
                    window.open(firstMatch.url, "_blank", "noopener,noreferrer")
                : undefined
            }
          />
        </div>
      </header>

      {groupedCategories.length === 0 ? (
        <div className="bento__empty">
          <p className="bento__empty-title">No applications configured yet.</p>
        </div>
      ) : visibleGroups.length === 0 ? (
        <div className="bento__empty">
          <p className="bento__empty-title">Nothing matches “{query.trim()}”</p>
          <button
            type="button"
            className="bento__empty-clear"
            onClick={() => setQuery("")}
          >
            Clear search
          </button>
        </div>
      ) : (
        visibleGroups.map(([category, apps]) => {
          const tint = tintByCategory.get(category) || CATEGORY_TINTS[0];
          const withHero = !searching && apps.length >= 3;
          return (
            <section
              key={category}
              className="bento__section"
              style={{ "--tile-tint": tint }}
            >
              <header className="bento__section-header">
                <span className="bento__section-dot" aria-hidden="true" />
                <h2 className="bento__section-title">{category}</h2>
                <span className="bento__section-count">
                  {apps.length} {apps.length === 1 ? "tool" : "tools"}
                </span>
              </header>
              <div className="bento__grid">
                {apps.map((app, index) => (
                  <BentoTile
                    key={app.id}
                    application={app}
                    hero={withHero && index === 0}
                    index={index}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

function BentoTile({ application, hero, index }) {
  const badge = getEnvBadge(application);
  const host = getDisplayHost(application.url);

  return (
    <a
      href={application.url}
      target="_blank"
      rel="noopener noreferrer"
      className={hero ? "bento-tile bento-tile--hero" : "bento-tile"}
      style={{ "--tile-i": Math.min(index, 10) }}
      title={application.description}
    >
      <span className="bento-tile__arrow" aria-hidden="true">
        ↗
      </span>
      <AppLogo application={application} size={hero ? 56 : 44} />
      <span className="bento-tile__name">{application.name}</span>
      {hero && (
        <span className="bento-tile__description">
          {application.description}
        </span>
      )}
      <span className="bento-tile__meta">
        <span className="bento-tile__host">{host}</span>
        {badge && <span className="bento-tile__badge">{badge}</span>}
      </span>
    </a>
  );
}
