import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Studio from "./pages/Studio";
import ScriptGenerator from "./pages/ScriptGenerator";
import ThumbnailGenerator from "./pages/ThumbnailGenerator";
import SeoKit from "./pages/SeoKit";
import BuyCredits from "./pages/BuyCredits";
import HistoryPage from "./pages/History";
import NotFound from "./pages/NotFound";
import Migration from "./pages/admin/Migration";
import Maintenance from "./pages/Maintenance";

const queryClient = new QueryClient();

// Set to false to enable maintenance mode
const SITE_ACTIVE = true;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          {SITE_ACTIVE ? (
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/studio" element={
                <ProtectedRoute>
                  <Studio />
                </ProtectedRoute>
              } />
              <Route path="/script-generator" element={
                <ProtectedRoute>
                  <ScriptGenerator />
                </ProtectedRoute>
              } />
              <Route path="/thumbnail-generator" element={
                <ProtectedRoute>
                  <ThumbnailGenerator />
                </ProtectedRoute>
              } />
              <Route path="/seo-kit" element={
                <ProtectedRoute>
                  <SeoKit />
                </ProtectedRoute>
              } />
              <Route path="/buy-credits" element={
                <ProtectedRoute>
                  <BuyCredits />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/migration" element={<Migration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="*" element={<Maintenance />} />
            </Routes>
          )}
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
