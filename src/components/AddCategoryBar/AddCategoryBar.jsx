import { useState } from "react";
import "./AddCategoryBar.css";

export default function AddCategoryBar({ categories, onAdd, disabled }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Enter a category name");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onAdd(name.trim());
      setName("");
    } catch (err) {
      setError(err.message || "Could not add category");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="add-category">
      <div className="add-category__header">
        <h2 className="add-category__title">Categories</h2>
        <p className="add-category__subtitle">
          Add categories here, then pick one when creating an application.
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
            <li key={category} className="add-category__tag">
              {category}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
