import { useCallback, useEffect, useState } from "react";
import {
  addApplication,
  deleteApplication,
  getApplications,
  updateApplication,
} from "../services/applicationService";

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(async (application) => {
    const created = await addApplication(application);
    setApplications((prev) => [...prev, created]);
    return created;
  }, []);

  const update = useCallback(async (id, updates) => {
    const updated = await updateApplication(id, updates);
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? updated : app))
    );
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    await deleteApplication(id);
    setApplications((prev) => prev.filter((app) => app.id !== id));
  }, []);

  return {
    applications,
    loading,
    error,
    reload: load,
    add,
    update,
    remove,
  };
}
