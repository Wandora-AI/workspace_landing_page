import seedCategories from "../data/categories.json";

const STORAGE_KEY = "landing_page_categories";

/**
 * Category data service.
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
  return [...seedCategories];
}

function writeToStorage(categories) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

function normalize(name) {
  return name.trim();
}

export async function getCategories() {
  return readFromStorage().sort((a, b) => a.localeCompare(b));
}

export async function addCategory(name) {
  const value = normalize(name);
  if (!value) {
    throw new Error("Category name is required");
  }

  const categories = readFromStorage();
  const exists = categories.some(
    (item) => item.toLowerCase() === value.toLowerCase()
  );
  if (exists) {
    throw new Error(`Category "${value}" already exists`);
  }

  categories.push(value);
  writeToStorage(categories);
  return value;
}

export function mergeCategoriesFromApplications(categories, applications) {
  const merged = new Set(categories);
  for (const app of applications) {
    if (app.category?.trim()) {
      merged.add(app.category.trim());
    }
  }
  return [...merged].sort((a, b) => a.localeCompare(b));
}

export function resetCategoriesToSeed() {
  localStorage.removeItem(STORAGE_KEY);
}
