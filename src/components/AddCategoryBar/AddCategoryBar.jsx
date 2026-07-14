import { useState } from "react";
import "./AddCategoryBar.css";

export default function AddCategoryBar({
  categories,
  onAdd,
  onUpdatePriority,
  onDelete,
  disabled,
}) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updatingName, setUpdatingName] = useState("");
  const [deletingName, setDeletingName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Enter a category name");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onAdd(name.trim(), priority.trim() || undefined);
      setName("");
      setPriority("");
    } catch (err) {
      setError(err.message || "Could not add category");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePriorityChange(category, nextPriority) {
    if (!onUpdatePriority) return;

    const numericPriority = Number(nextPriority);
    if (!Number.isFinite(numericPriority) || numericPriority <= 0) {
      setError("Priority must be a positive number");
      return;
    }

    if (numericPriority === category.priority) {
      return;
    }

    setUpdatingName(category.name);
    setError("");
    try {
      await onUpdatePriority(category.name, numericPriority);
    } catch (err) {
      setError(err.message || "Could not update priority");
    } finally {
      setUpdatingName("");
    }
  }

  async function handleDelete(category) {
    if (!onDelete) return;

    const confirmed = window.confirm(
      `Delete category "${category.name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingName(category.name);
    setError("");
    try {
      await onDelete(category.name);
    } catch (err) {
      setError(err.message || "Could not delete category");
    } finally {
      setDeletingName("");
    }
  }

  return (
    <section className="add-category">
      <div className="add-category__header">
        <h2 className="add-category__title">Categories</h2>
        <p className="add-category__subtitle">
          Set priority to control order on the landing page. Lower number
          appears first.
        </p>
      </div>

      <form className="add-category__form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="New category name"
          disabled={disabled || submitting}
        />
        <input
          type="number"
          min="1"
          step="1"
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            setError("");
          }}
          placeholder="Priority"
          className="add-category__priority-input"
          disabled={disabled || submitting}
        />
        <button
          type="submit"
          className="btn btn--ghost"
          disabled={disabled || submitting}
        >
          Add Category
        </button>
      </form>

      {error && <p className="add-category__error">{error}</p>}

      {categories.length > 0 && (
        <ul className="add-category__list">
          {categories.map((category) => (
            <li key={category.name} className="add-category__item">
              <span className="add-category__name">{category.name}</span>
              <div className="add-category__actions">
                <label className="add-category__priority">
                  <span>Priority</span>
                  <input
                    key={`${category.name}-${category.priority}`}
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={category.priority}
                    disabled={disabled || updatingName === category.name}
                    onBlur={(e) =>
                      handlePriorityChange(category, e.target.value)
                    }
                  />
                </label>
                {onDelete && (
                  <button
                    type="button"
                    className="add-category__delete"
                    disabled={disabled || deletingName === category.name}
                    onClick={() => handleDelete(category)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
