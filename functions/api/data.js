import seedApplications from "../../src/data/applications.json";
import seedCategories from "../../src/data/categories.json";
import { normalizeCategories } from "../../src/utils/categoryUtils.js";

const DATA_KEY = "workspace_data";

function seedData() {
  return {
    applications: seedApplications,
    categories: normalizeCategories(seedCategories),
  };
}

function normalizeBody(body) {
  return {
    applications: body.applications,
    categories: normalizeCategories(body.categories),
  };
}

export async function onRequestGet(context) {
  const stored = await context.env.WORKSPACE_KV.get(DATA_KEY, "json");
  const data = stored ?? seedData();
  return Response.json({
    applications: data.applications,
    categories: normalizeCategories(data.categories),
  });
}

export async function onRequestPut(context) {
  const { request, env } = context;
  const password = request.headers.get("X-Config-Password");

  if (!env.CONFIG_PASSWORD || password !== env.CONFIG_PASSWORD) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.applications) || !Array.isArray(body.categories)) {
    return Response.json(
      { error: "Expected { applications: [], categories: [] }" },
      { status: 400 }
    );
  }

  const normalized = normalizeBody(body);
  await env.WORKSPACE_KV.put(DATA_KEY, JSON.stringify(normalized));
  return Response.json(normalized);
}
