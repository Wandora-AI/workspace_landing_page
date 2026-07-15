import { Navigate, Route, Routes } from "react-router-dom";
import {
  AUTH_STORAGE_KEYS,
  CONFIG_PASSWORD,
  TEAM_PASSWORD,
} from "../config/auth";
import PasswordGate from "../components/PasswordGate/PasswordGate";
import Layout from "../components/Layout/Layout";
import LandingPage from "../pages/LandingPage/LandingPage";
import ConfigPage from "../pages/ConfigPage/ConfigPage";
import { VariantProvider } from "../variants/VariantContext";

/**
 * Route tree for the landing page feature.
 * Mount this inside your host app's BrowserRouter, or use LandingPageApp
 * as a standalone entry point.
 */
export default function LandingPageRoutes() {
  return (
    <PasswordGate
      expectedPassword={TEAM_PASSWORD}
      storageKey={AUTH_STORAGE_KEYS.workspace}
    >
      <VariantProvider>
        <Routes>
          <Route path="/landing_page" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route
              path="config"
              element={
                <PasswordGate
                  expectedPassword={CONFIG_PASSWORD}
                  storageKey={AUTH_STORAGE_KEYS.config}
                  badge="Admin Access"
                  title="Config Area"
                  subtitle="Enter the config password to manage applications."
                  placeholder="Enter config password"
                >
                  <ConfigPage />
                </PasswordGate>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/landing_page" replace />} />
        </Routes>
      </VariantProvider>
    </PasswordGate>
  );
}
