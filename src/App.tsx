
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import AboutMaker from "./pages/AboutMaker";
import Chat from "./pages/Chat";
import Scheduler from "./pages/Scheduler";
import Emails from "./pages/Emails";
import Audit from "./pages/Audit";
import YourOrganisation from "./pages/YourOrganisation";
import EmailConfirmation from "./pages/EmailConfirmation";
import Onboarding from "./pages/Onboarding";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen">
            <Routes>
              {/* Root route - redirect to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/email-confirmation" element={<EmailConfirmation />} />
              
              {/* Onboarding route - authenticated but doesn't require completed onboarding */}
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute requiresOnboarding={false}>
                    <Onboarding />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected routes that require completed onboarding */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user-profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <ProtectedRoute>
                    <About />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/about-maker" 
                element={
                  <ProtectedRoute>
                    <AboutMaker />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/scheduler" 
                element={
                  <ProtectedRoute>
                    <Scheduler />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/emails" 
                element={
                  <ProtectedRoute>
                    <Emails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/audit" 
                element={
                  <ProtectedRoute>
                    <Audit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/your-organisation" 
                element={
                  <ProtectedRoute>
                    <YourOrganisation />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
