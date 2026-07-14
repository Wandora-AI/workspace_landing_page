import {
  getWorkspaceData,
  updateWorkspaceData,
} from "./workspaceDataService";
import {
  getCategoryNames,
  normalizeCategories,
  sortCategories,
} from "../utils/categoryUtils";

/**
 * Category data service.
 * Categories are stored as { name, priority } objects in KV.
 * Lower priority number = appears first on the landing page.
 */

export {
  getCategoryNames,
  normalizeCategories,
  sortCategories,
} from "../utils/categoryUtils";

function getNextPriority(categories) {
  if (categories.length === 0) {
    return 1;
  }
  return Math.max(...categories.map((category) => category.priority)) + 1;
}

function normalizeName(name) {
  return name.trim();
}

export async function getCategories() {
  const data = await getWorkspaceData();
  return normalizeCategories(data.categories);
}

export async function addCategory(name, priority) {
  const value = normalizeName(name);
  if (!value) {
    throw new Error("Category name is required");
  }

  const numericPriority = Number(priority);
  let created;

  await updateWorkspaceData((data) => {
    const categories = normalizeCategories(data.categories);

    const exists = categories.some(
      (item) => item.name.toLowerCase() === value.toLowerCase()
    );
    if (exists) {
      throw new Error(`Category "${value}" already exists`);
    }

    created = {
      name: value,
      priority:
        Number.isFinite(numericPriority) && numericPriority > 0
          ? numericPriority
          : getNextPriority(categories),
    };

    data.categories = sortCategories([...categories, created]);
    return data;
  });

  return created;
}

export async function updateCategoryPriority(name, priority) {
  const value = normalizeName(name);
  const numericPriority = Number(priority);

  if (!value) {
    throw new Error("Category name is required");
  }
  if (!Number.isFinite(numericPriority) || numericPriority <= 0) {
    throw new Error("Priority must be a positive number");
  }

  let updated;

  await updateWorkspaceData((data) => {
    const categories = normalizeCategories(data.categories);
    const index = categories.findIndex(
      (item) => item.name.toLowerCase() === value.toLowerCase()
    );

    if (index === -1) {
      throw new Error(`Category "${value}" not found`);
    }

    categories[index] = {
      ...categories[index],
      priority: numericPriority,
    };

    updated = categories[index];
    data.categories = sortCategories(categories);
    return data;
  });

  return updated;
}

export async function deleteCategory(name) {
  const value = normalizeName(name);
  if (!value) {
    throw new Error("Category name is required");
  }

  await updateWorkspaceData((data) => {
    const categories = normalizeCategories(data.categories);
    const inUse = data.applications.some(
      (app) => app.category?.trim().toLowerCase() === value.toLowerCase()
    );

    if (inUse) {
      throw new Error(
        `Cannot delete "${value}" while applications still use it`
      );
    }

    const filtered = categories.filter(
      (item) => item.name.toLowerCase() !== value.toLowerCase()
    );

    if (filtered.length === categories.length) {
      throw new Error(`Category "${value}" not found`);
    }

    data.categories = filtered;
    return data;
  });
}

export function mergeCategoriesFromApplications(categories, applications) {
  const map = new Map();

  for (const category of normalizeCategories(categories)) {
    map.set(category.name.toLowerCase(), category);
  }

  let nextPriority = getNextPriority([...map.values()]);

  for (const app of applications) {
    const name = app.category?.trim();
    if (!name) continue;

    const key = name.toLowerCase();
    if (!map.has(key)) {
      map.set(key, { name, priority: nextPriority });
      nextPriority += 1;
    }
  }

  return sortCategories([...map.values()]);
}
