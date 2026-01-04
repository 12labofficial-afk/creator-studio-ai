import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Studio from "./pages/Studio";
import History from "./pages/History";
import BuyCredits from "./pages/BuyCredits";
import ScriptGenerator from "./pages/ScriptGenerator";
import ThumbnailGenerator from "./pages/ThumbnailGenerator";
import SeoKit from "./pages/SeoKit";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/history" element={<History />} />
          <Route path="/buy-credits" element={<BuyCredits />} />
          <Route path="/script-generator" element={<ScriptGenerator />} />
          <Route path="/thumbnail-generator" element={<ThumbnailGenerator />} />
          <Route path="/seo-kit" element={<SeoKit />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
