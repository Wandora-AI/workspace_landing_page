import { useMemo, useState } from "react";
import { getFaviconCandidates } from "../../utils/appMeta";
import { getIconEmoji } from "../../utils/icons";
import "./AppLogo.css";

export default function AppLogo({ application, size = 40 }) {
  const candidates = useMemo(
    () => getFaviconCandidates(application.url),
    [application.url]
  );
  const [attempt, setAttempt] = useState(0);

  if (attempt >= candidates.length) {
    return (
      <span
        className="app-logo app-logo--fallback"
        style={{ width: size, height: size, fontSize: size * 0.45 }}
        aria-hidden="true"
      >
        {getIconEmoji(application.icon)}
      </span>
    );
  }

  return (
    <span
      className="app-logo"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img
        src={candidates[attempt]}
        alt=""
        loading="lazy"
        onError={() => setAttempt(attempt + 1)}
        onLoad={(event) => {
          // Google's favicon service answers "no icon" with a generic 16px
          // globe instead of an error — treat it as a miss and try the next
          // candidate (apex domain, then emoji fallback).
          if (event.currentTarget.naturalWidth < 32) {
            setAttempt(attempt + 1);
          }
        }}
      />
    </span>
  );
}
