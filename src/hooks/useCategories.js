import { useCallback, useEffect, useState } from "react";
import {
  addCategory,
  getCategories,
  mergeCategoriesFromApplications,
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
    async (name) => {
      const created = await addCategory(name);
      setCategories((prev) =>
        mergeCategoriesFromApplications([...prev, created], applications)
      );
      return created;
    },
    [applications]
  );

  return {
    categories,
    loading,
    error,
    reload: load,
    add,
  };
}
