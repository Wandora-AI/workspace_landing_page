import {
  getWorkspaceData,
  updateWorkspaceData,
} from "./workspaceDataService";

/**
 * Application data service.
 * Reads/writes via the /api/data endpoint backed by Cloudflare KV.
 */

export async function getApplications() {
  const data = await getWorkspaceData();
  return data.applications;
}

export async function addApplication(application) {
  let created;

  await updateWorkspaceData((data) => {
    created = {
      ...application,
      id: crypto.randomUUID(),
    };
    data.applications.push(created);
    return data;
  });

  return created;
}

export async function updateApplication(id, updates) {
  let updated;

  await updateWorkspaceData((data) => {
    const index = data.applications.findIndex((app) => app.id === id);
    if (index === -1) {
      throw new Error(`Application with id "${id}" not found`);
    }

    data.applications[index] = {
      ...data.applications[index],
      ...updates,
      id,
    };
    updated = data.applications[index];
    return data;
  });

  return updated;
}

export async function deleteApplication(id) {
  await updateWorkspaceData((data) => {
    const filtered = data.applications.filter((app) => app.id !== id);
    if (filtered.length === data.applications.length) {
      throw new Error(`Application with id "${id}" not found`);
    }

    data.applications = filtered;
    return data;
  });
}

export function groupByCategory(applications) {
  const groups = {};
  for (const app of applications) {
    const category = app.category || "Other";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(app);
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}
