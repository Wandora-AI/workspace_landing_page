import { getConfigAuthPassword } from "../config/auth";

const API_URL = "/api/data";

export async function getWorkspaceData() {
  let response;
  try {
    response = await fetch(API_URL);
  } catch {
    throw new Error(
      "Failed to load workspace data. Run npm run dev:full in a second terminal (API on :8788). If using :5173, keep both dev servers running."
    );
  }

  if (!response.ok) {
    throw new Error(`Failed to load workspace data (${response.status})`);
  }

  return response.json();
}

export async function updateWorkspaceData(updater) {
  const current = await getWorkspaceData();
  const next = updater(structuredClone(current));

  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Config-Password": getConfigAuthPassword(),
    },
    body: JSON.stringify(next),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error(
        "Save failed: unauthorized. Add CONFIG_PASSWORD in Cloudflare (same value as VITE_CONFIG_PASSWORD), then reload and try again."
      );
    }
    throw new Error(errorBody.error || "Failed to save workspace data");
  }

  return response.json();
}
