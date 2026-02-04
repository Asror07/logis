import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute, PublicRoute } from "@/components/auth/ProtectedRoute";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AILogs from "@/pages/AILogs";
import Confirm from "@/pages/auth/Confirm";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Settings from "@/pages/settings/Settings";
import TemplatesTest from "@/pages/templatesTest/Templates";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "./app/store";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AnalyticsDashboard from "./pages/analytics-dashboard/AnalyticsDashboard";
import Assets from "./pages/assets/Assets";
import Drivers from "./pages/drivers/Drivers";
import Exceptions from "./pages/exceptions/Exceptions";
import InteractionLogs from "./pages/interaction-logs/InteractionLogs";
import LoadMonitoring from "./pages/load-monitoring/LoadMonitoring";
import Notifications from "./pages/notifications/Notifications";
import Preferences from "./pages/preferences/Preferences";
import Reports from "./pages/reports/Reports";
import Templates from "./pages/templates/Templates";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public auth routes */}
                    <Route
                      path="/login"
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <PublicRoute>
                          <Register />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/confirm"
                      element={
                        <PublicRoute>
                          <Confirm />
                        </PublicRoute>
                      }
                    />

                    {/* Protected routes */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Index />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/analytics"
                      element={
                        <ProtectedRoute>
                          <AnalyticsDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/loads"
                      element={
                        <ProtectedRoute>
                          <LoadMonitoring />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/preferences"
                      element={
                        <ProtectedRoute>
                          <Preferences />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/templates"
                      element={
                        <ProtectedRoute>
                          <Templates />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/exceptions"
                      element={
                        <ProtectedRoute>
                          <Exceptions />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <ProtectedRoute>
                          <Reports />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute>
                          <Notifications />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/interaction-logs"
                      element={
                        <ProtectedRoute>
                          <InteractionLogs />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/ai-logs"
                      element={
                        <ProtectedRoute>
                          <AILogs />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/drivers"
                      element={
                        <ProtectedRoute>
                          <Drivers />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/assets"
                      element={
                        <ProtectedRoute>
                          <Assets />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/test-templates"
                      element={
                        <ProtectedRoute>
                          <TemplatesTest />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </AuthProvider>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
