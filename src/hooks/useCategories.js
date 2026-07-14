import { useCallback, useEffect, useState } from "react";
import {
  addCategory,
  deleteCategory,
  getCategories,
  mergeCategoriesFromApplications,
  updateCategoryPriority,
} from "../services/categoryService";

export function useCategories(applications = []) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stored = await getCategories();
      setCategories(mergeCategoriesFromApplications(stored, applications));
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [applications]);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (name, priority) => {
      const created = await addCategory(name, priority);
      setCategories((prev) =>
        mergeCategoriesFromApplications([...prev, created], applications)
      );
      return created;
    },
    [applications]
  );

  const updatePriority = useCallback(
    async (name, priority) => {
      const updated = await updateCategoryPriority(name, priority);
      setCategories((prev) =>
        sortMergedCategories(
          prev.map((category) =>
            category.name.toLowerCase() === updated.name.toLowerCase()
              ? updated
              : category
          ),
          applications
        )
      );
      return updated;
    },
    [applications]
  );

  const remove = useCallback(
    async (name) => {
      await deleteCategory(name);
      setCategories((prev) =>
        prev.filter(
          (category) =>
            category.name.toLowerCase() !== name.trim().toLowerCase()
        )
      );
    },
    []
  );

  return {
    categories,
    loading,
    error,
    reload: load,
    add,
    updatePriority,
    remove,
  };
}

function sortMergedCategories(categories, applications) {
  return mergeCategoriesFromApplications(categories, applications);
}
