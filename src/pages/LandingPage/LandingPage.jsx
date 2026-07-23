import { groupByCategory } from "../../services/applicationService";
import { useApplications } from "../../hooks/useApplications";
import { useCategories } from "../../hooks/useCategories";
import { useVariant } from "../../variants/VariantContext";
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

  if (variant === "bento") {
    return (
      <>
        <BentoView groupedCategories={groupedCategories} />
        <VariantSwitcher />
      </>
    );
  }

  return (
    <>
      <HubView groupedCategories={groupedCategories} />
      <VariantSwitcher />
    </>
  );
}
