import {
  getWorkspaceData,
  updateWorkspaceData,
} from "./workspaceDataService";

/**
 * Category data service.
 * Reads/writes via the /api/data endpoint backed by Cloudflare KV.
 */

function normalize(name) {
  return name.trim();
}

export async function getCategories() {
  const data = await getWorkspaceData();
  return data.categories.sort((a, b) => a.localeCompare(b));
}

export async function addCategory(name) {
  const value = normalize(name);
  if (!value) {
    throw new Error("Category name is required");
  }

  let created;

  await updateWorkspaceData((data) => {
    const exists = data.categories.some(
      (item) => item.toLowerCase() === value.toLowerCase()
    );
    if (exists) {
      throw new Error(`Category "${value}" already exists`);
    }

    data.categories.push(value);
    created = value;
    return data;
  });

  return created;
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
