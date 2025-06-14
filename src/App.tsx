
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import AboutMaker from "./pages/AboutMaker";
import Chat from "./pages/Chat";
import Scheduler from "./pages/Scheduler";
import Emails from "./pages/Emails";
import Audit from "./pages/Audit";
import EmailConfirmation from "./pages/EmailConfirmation";
import Onboarding from "./pages/Onboarding";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen">
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/email-confirmation" element={<EmailConfirmation />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/about" element={<About />} />
                <Route path="/about-maker" element={<AboutMaker />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/scheduler" element={<Scheduler />} />
                <Route path="/emails" element={<Emails />} />
                <Route path="/audit" element={<Audit />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
