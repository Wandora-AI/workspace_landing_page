export const TEAM_PASSWORD = import.meta.env.VITE_TEAM_PASSWORD ?? "";
export const CONFIG_PASSWORD = import.meta.env.VITE_CONFIG_PASSWORD ?? "";

export const AUTH_STORAGE_KEYS = {
  workspace: "workspace_authenticated",
  config: "workspace_config_authenticated",
};

const CONFIG_PASSWORD_STORAGE_KEY = "workspace_config_password";

export function persistConfigAuthPassword(password) {
  try {
    sessionStorage.setItem(CONFIG_PASSWORD_STORAGE_KEY, password);
  } catch {
    // sessionStorage may be unavailable in some contexts
  }
}

export function clearConfigAuthPassword() {
  try {
    sessionStorage.removeItem(CONFIG_PASSWORD_STORAGE_KEY);
  } catch {
    // sessionStorage may be unavailable in some contexts
  }
}

export function getConfigAuthPassword() {
  try {
    return sessionStorage.getItem(CONFIG_PASSWORD_STORAGE_KEY) ?? CONFIG_PASSWORD;
  } catch {
    return CONFIG_PASSWORD;
  }
}
