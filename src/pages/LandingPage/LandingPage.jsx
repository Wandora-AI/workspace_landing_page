import { groupByCategory } from "../../services/applicationService";
import { useApplications } from "../../hooks/useApplications";
import { useCategories } from "../../hooks/useCategories";
import { useVariant } from "../../variants/VariantContext";
import CategorySection from "../../components/CategorySection/CategorySection";
import VariantSwitcher from "../../components/VariantSwitcher/VariantSwitcher";
import HubView from "./HubView";
import BentoView from "./BentoView";
import "./LandingPage.css";

export default function LandingPage() {
  const { variant } = useVariant();
  const { applications, loading, error } = useApplications();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories(applications);
  const groupedCategories = groupByCategory(applications, categories);

  if (loading || categoriesLoading) {
    return <p className="page-status">Loading applications…</p>;
  }

  if (error || categoriesError) {
    return (
      <p className="page-status page-status--error">
        {error || categoriesError}
      </p>
    );
  }

  if (variant === "hub") {
    return (
      <>
        <HubView groupedCategories={groupedCategories} />
        <VariantSwitcher />
      </>
    );
  }

  if (variant === "bento") {
    return (
      <>
        <BentoView groupedCategories={groupedCategories} />
        <VariantSwitcher />
      </>
    );
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

      {groupedCategories.length === 0 ? (
        <p className="page-status">No applications configured yet.</p>
      ) : (
        groupedCategories.map(([category, apps]) => (
          <CategorySection
            key={category}
            category={category}
            applications={apps}
          />
        ))
      )}
      <VariantSwitcher />
    </div>
  );
}
