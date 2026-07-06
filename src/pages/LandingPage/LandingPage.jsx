import { groupByCategory } from "../../services/applicationService";
import { useApplications } from "../../hooks/useApplications";
import CategorySection from "../../components/CategorySection/CategorySection";
import "./LandingPage.css";

export default function LandingPage() {
  const { applications, loading, error } = useApplications();
  const categories = groupByCategory(applications);

  if (loading) {
    return <p className="page-status">Loading applications…</p>;
  }

  if (error) {
    return <p className="page-status page-status--error">{error}</p>;
  }

  return (
    <div className="landing-page">
      <header className="landing-page__hero">
        <span className="landing-page__badge">Internal • Workspace</span>
        <h1 className="landing-page__title">
          Everything, <em>in one place.</em>
        </h1>
        <p className="landing-page__subtitle">
          Jump to Almosafer, HK Souq, and ops tools — no bookmarks, no Slack
          digging.
        </p>
      </header>

      {categories.length === 0 ? (
        <p className="page-status">No applications configured yet.</p>
      ) : (
        categories.map(([category, apps]) => (
          <CategorySection
            key={category}
            category={category}
            applications={apps}
          />
        ))
      )}
    </div>
  );
}
