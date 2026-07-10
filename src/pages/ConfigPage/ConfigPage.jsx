import { useState } from "react";
import AddCategoryBar from "../../components/AddCategoryBar/AddCategoryBar";
import ApplicationForm from "../../components/ApplicationForm/ApplicationForm";
import ApplicationTable from "../../components/ApplicationTable/ApplicationTable";
import { useApplications } from "../../hooks/useApplications";
import { useCategories } from "../../hooks/useCategories";
import "./ConfigPage.css";

export default function ConfigPage() {
  const { applications, loading, error, add, update, remove } =
    useApplications();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    add: addCategory,
  } = useCategories(applications);
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleAddClick() {
    setEditingApp(null);
    setSaveError("");
    setShowForm(true);
  }

  function handleEdit(app) {
    setEditingApp(app);
    setSaveError("");
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingApp(null);
    setSaveError("");
    setSaving(false);
  }

  async function handleSubmit(formData) {
    setSaving(true);
    setSaveError("");
    try {
      if (editingApp) {
        await update(editingApp.id, formData);
      } else {
        await add(formData);
      }
      handleCancel();
    } catch (err) {
      setSaveError(err.message || "Failed to save application");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(app) {
    const confirmed = window.confirm(
      `Delete "${app.name}"? This cannot be undone.`
    );
    if (!confirmed) {
      return;
    }

    setSaveError("");
    try {
      await remove(app.id);
      if (editingApp?.id === app.id) {
        handleCancel();
      }
    } catch (err) {
      setSaveError(err.message || "Failed to delete application");
    }
  }

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

  return (
    <div className="config-page">
      <header className="config-page__header">
        <div>
          <h1 className="config-page__title">Application Directory</h1>
          <p className="config-page__subtitle">
            Manage internal applications shown on the landing page.
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleAddClick}
          >
            Add Application
          </button>
        )}
      </header>

      <AddCategoryBar categories={categories} onAdd={addCategory} />

      {saveError && (
        <p className="page-status page-status--error">{saveError}</p>
      )}

      {showForm && (
        <div className="config-page__form-panel">
          <h2 className="config-page__form-title">
            {editingApp ? "Edit Application" : "New Application"}
          </h2>
          <ApplicationForm
            initialValues={editingApp || undefined}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={saving}
          />
        </div>
      )}

      <ApplicationTable
        applications={applications}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
