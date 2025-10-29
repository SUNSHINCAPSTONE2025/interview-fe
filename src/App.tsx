import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewSession />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/session/:id" element={<SessionDetail />} />
          <Route path="/practice/:id" element={<PracticeGuide />} />
          <Route path="/practice/:id/setup" element={<PracticeSetup />} />
          <Route path="/practice/:id/run" element={<PracticeRoom />} />
          <Route path="/feedback/:id" element={<Feedback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
