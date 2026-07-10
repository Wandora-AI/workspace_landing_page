import { useEffect, useMemo, useState } from "react";
import { ICON_OPTIONS } from "../../utils/icons";
import "./ApplicationForm.css";

const EMPTY_FORM = {
  name: "",
  description: "",
  url: "",
  category: "",
  icon: "globe",
};

export default function ApplicationForm({
  initialValues,
  categories = [],
  onSubmit,
  onCancel,
  submitting = false,
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});

  const categoryOptions = useMemo(() => {
    const options = new Set(categories);
    if (initialValues?.category?.trim()) {
      options.add(initialValues.category.trim());
    }
    return [...options].sort((a, b) => a.localeCompare(b));
  }, [categories, initialValues]);

  useEffect(() => {
    setForm({ ...EMPTY_FORM, ...initialValues });
    setErrors({});
  }, [initialValues]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.description.trim()) next.description = "Description is required";
    if (!form.url.trim()) next.url = "URL is required";
    else if (!/^https?:\/\/.+/.test(form.url.trim())) {
      next.url = "URL must start with http:// or https://";
    }
    if (!form.category.trim()) next.category = "Category is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate() || submitting) return;
    await onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      url: form.url.trim(),
      category: form.category.trim(),
      icon: form.icon,
    });
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      <div className="app-form__grid">
        <label className="app-form__field">
          <span>Name</span>
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <em className="app-form__error">{errors.name}</em>}
        </label>

        <label className="app-form__field">
          <span>Category</span>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Select a category</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {categoryOptions.length === 0 && (
            <em className="app-form__hint">
              Add a category above before creating an application.
            </em>
          )}
          {errors.category && (
            <em className="app-form__error">{errors.category}</em>
          )}
        </label>

        <label className="app-form__field app-form__field--full">
          <span>Description</span>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          {errors.description && (
            <em className="app-form__error">{errors.description}</em>
          )}
        </label>

        <label className="app-form__field app-form__field--full">
          <span>URL</span>
          <input
            name="url"
            type="url"
            value={form.url}
            onChange={handleChange}
            placeholder="https://example.com"
          />
          {errors.url && <em className="app-form__error">{errors.url}</em>}
        </label>

        <label className="app-form__field">
          <span>Icon</span>
          <select name="icon" value={form.icon} onChange={handleChange}>
            {ICON_OPTIONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="app-form__actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? "Saving…" : "Save"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
