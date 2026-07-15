import { useEffect, useMemo, useRef } from "react";
import "./SearchBar.css";

const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export default function SearchBar({
  value,
  onChange,
  resultCount,
  placeholder = "Find a platform…",
  onOpenFirst,
}) {
  const inputRef = useRef(null);
  const kbdLabel = useMemo(() => (IS_MAC ? "⌘K" : "Ctrl K"), []);

  useEffect(() => {
    function handleKeyDown(event) {
      const isCmdK =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      const isSlash =
        event.key === "/" && !event.metaKey && !event.ctrlKey && !isTyping;

      if (isCmdK || isSlash) {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searching = value.trim().length > 0;

  return (
    <div className={`search-bar${searching ? " search-bar--active" : ""}`}>
      <svg
        className="search-bar__icon"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="m13.5 13.5 3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <input
        ref={inputRef}
        className="search-bar__input"
        type="text"
        value={value}
        placeholder={placeholder}
        aria-label="Search platforms"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onChange("");
            event.currentTarget.blur();
          }
          if (event.key === "Enter" && searching && onOpenFirst) {
            onOpenFirst();
          }
        }}
      />
      {searching ? (
        <span className="search-bar__count">
          {resultCount} {resultCount === 1 ? "match" : "matches"}
          {resultCount > 0 && onOpenFirst ? " · ↵ opens first" : ""}
        </span>
      ) : (
        <kbd className="search-bar__kbd">{kbdLabel}</kbd>
      )}
    </div>
  );
}
