import { Navigate, Route, Routes } from "react-router-dom";
import ConfigPasswordGate from "../components/ConfigPasswordGate/ConfigPasswordGate";
import Layout from "../components/Layout/Layout";
import LandingPage from "../pages/LandingPage/LandingPage";
import ConfigPage from "../pages/ConfigPage/ConfigPage";

/**
 * Route tree for the landing page feature.
 * Mount this inside your host app's BrowserRouter, or use LandingPageApp
 * as a standalone entry point.
 */
export default function LandingPageRoutes() {
  return (
    <Routes>
      <Route path="/landing_page" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route
          path="config"
          element={
            <ConfigPasswordGate>
              <ConfigPage />
            </ConfigPasswordGate>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/landing_page" replace />} />
    </Routes>
  );
}
