import AppCard from "../AppCard/AppCard";
import "./CategorySection.css";

export default function CategorySection({ category, applications }) {
  return (
    <section className="category-section">
      <header className="category-section__header">
        <h2 className="category-section__title">{category}</h2>
        <p className="category-section__count">
          {applications.length}{" "}
          {applications.length === 1 ? "application" : "applications"}
        </p>
      </header>
      <div className="category-section__grid">
        {applications.map((app) => (
          <AppCard key={app.id} application={app} />
        ))}
      </div>
    </section>
  );
}
