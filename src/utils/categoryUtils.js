export function normalizeCategory(item, fallbackPriority = 9999) {
  if (typeof item === "string") {
    const name = item.trim();
    return name ? { name, priority: fallbackPriority } : null;
  }

  if (item && typeof item.name === "string") {
    const name = item.name.trim();
    const priority = Number(item.priority);
    if (!name) return null;
    return {
      name,
      priority:
        Number.isFinite(priority) && priority > 0 ? priority : fallbackPriority,
    };
  }

  return null;
}

export function normalizeCategories(categories = []) {
  if (!Array.isArray(categories)) {
    return [];
  }

  const normalized = [];
  for (let index = 0; index < categories.length; index += 1) {
    const category = normalizeCategory(categories[index], index + 1);
    if (category) {
      normalized.push(category);
    }
  }

  const deduped = new Map();
  for (const category of normalized) {
    const key = category.name.toLowerCase();
    if (!deduped.has(key)) {
      deduped.set(key, category);
    }
  }

  return sortCategories([...deduped.values()]);
}

export function sortCategories(categories) {
  return [...categories].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.name.localeCompare(b.name);
  });
}

export function getCategoryNames(categories) {
  return sortCategories(normalizeCategories(categories)).map(
    (category) => category.name
  );
}
