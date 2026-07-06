import { getIconEmoji } from "../../utils/icons";
import "./AppCard.css";

export default function AppCard({ application }) {
  const { name, description, url, icon } = application;
  const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="app-card"
    >
      <div className="app-card__top">
        <span className="app-card__icon" aria-hidden="true">
          {getIconEmoji(icon)}
        </span>
        <span className="app-card__arrow" aria-hidden="true">
          ↗
        </span>
      </div>
      <h3 className="app-card__title">{name}</h3>
      <p className="app-card__description">{description}</p>
      <span className="app-card__link">{displayUrl.toUpperCase()}</span>
    </a>
  );
}
