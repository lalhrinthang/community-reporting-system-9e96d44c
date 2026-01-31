import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import MapView from "./pages/MapView";
import PublicDashboard from "./pages/PublicDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddReport from "./pages/AddReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Landing isAuthenticated={isAuthenticated} onLogout={logout} />}
      />
      <Route path="/login" element={<Login onLogin={login} />} />
      <Route
        path="/map"
        element={<MapView isAuthenticated={isAuthenticated} onLogout={logout} />}
      />
      <Route
        path="/dashboard"
        element={
          <PublicDashboard isAuthenticated={isAuthenticated} onLogout={logout} />
        }
      />
      <Route
        path="/admin"
        element={
          <AdminDashboard isAuthenticated={isAuthenticated} onLogout={logout} />
        }
      />
      <Route
        path="/admin/new-report"
        element={<AddReport isAuthenticated={isAuthenticated} onLogout={logout} />}
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
