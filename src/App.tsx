import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import NewSession from "./pages/NewSession";
import SessionDetail from "./pages/SessionDetail";
import PracticeGuide from "./pages/PracticeGuide";
import PracticeSetup from "./pages/PracticeSetup";
import PracticeRoom from "./pages/PracticeRoom";
import Feedback from "./pages/Feedback";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new" element={<ProtectedRoute><NewSession /></ProtectedRoute>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/session/:id" element={<ProtectedRoute><SessionDetail /></ProtectedRoute>} />
            <Route path="/practice/:id" element={<ProtectedRoute><PracticeGuide /></ProtectedRoute>} />
            <Route path="/practice/:id/setup" element={<ProtectedRoute><PracticeSetup /></ProtectedRoute>} />
            <Route path="/practice/:id/run" element={<ProtectedRoute><PracticeRoom /></ProtectedRoute>} />
            <Route path="/feedback/:id" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
