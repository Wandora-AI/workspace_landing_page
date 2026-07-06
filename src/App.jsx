import { BrowserRouter } from "react-router-dom";
import LandingPageRoutes from "./routes/LandingPageRoutes";

/**
 * Standalone app wrapper. When integrating into a host project,
 * import LandingPageRoutes instead and render it inside the host router.
 */
export default function App() {
  return (
    <BrowserRouter>
      <LandingPageRoutes />
    </BrowserRouter>
  );
}
