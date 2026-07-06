import seedData from "../data/applications.json";

const STORAGE_KEY = "landing_page_applications";

/**
 * Application data service.
 * Currently reads/writes via localStorage seeded from applications.json.
 * Replace these functions with API calls when backend is ready.
 */

function readFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  return [...seedData];
}

function writeToStorage(applications) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

export async function getApplications() {
  return readFromStorage();
}

export async function addApplication(application) {
  const applications = readFromStorage();
  const newApp = {
    ...application,
    id: crypto.randomUUID(),
  };
  applications.push(newApp);
  writeToStorage(applications);
  return newApp;
}

export async function updateApplication(id, updates) {
  const applications = readFromStorage();
  const index = applications.findIndex((app) => app.id === id);
  if (index === -1) {
    throw new Error(`Application with id "${id}" not found`);
  }
  applications[index] = { ...applications[index], ...updates, id };
  writeToStorage(applications);
  return applications[index];
}

export async function deleteApplication(id) {
  const applications = readFromStorage();
  const filtered = applications.filter((app) => app.id !== id);
  if (filtered.length === applications.length) {
    throw new Error(`Application with id "${id}" not found`);
  }
  writeToStorage(filtered);
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

export function resetToSeed() {
  localStorage.removeItem(STORAGE_KEY);
}
