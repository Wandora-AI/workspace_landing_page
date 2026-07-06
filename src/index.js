/**
 * Integration entry point for host applications.
 *
 * Usage in an existing React app:
 *
 *   import { LandingPageRoutes } from "./landing-page";
 *
 *   function HostApp() {
 *     return (
 *       <BrowserRouter>
 *         <Routes>
 *           ...your existing routes
 *           <Route path="/*" element={<LandingPageRoutes />} />
 *         </Routes>
 *       </BrowserRouter>
 *     );
 *   }
 */

export { default as LandingPageRoutes } from "./routes/LandingPageRoutes";
export { default as LandingPage } from "./pages/LandingPage/LandingPage";
export { default as ConfigPage } from "./pages/ConfigPage/ConfigPage";
export * from "./services/applicationService";
export * from "./services/categoryService";
export { useApplications } from "./hooks/useApplications";
export { useCategories } from "./hooks/useCategories";
