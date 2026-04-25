import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AiAssistantProvider } from "@/context/AiAssistantContext";
import { useEffect } from "react";
import { hydrateLocalStorageFromBackend } from "@/utils/localStorage";

// Layouts
import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// User Pages
import Dashboard from "./pages/Dashboard";
import AlumniNetwork from "./pages/AlumniNetwork";
import Jobs from "./pages/Jobs";
import Events from "./pages/Events";
import SuccessStories from "./pages/SuccessStories";
import Donate from "./pages/Donate";
import Profile from "./pages/Profile";
import Mentorship from "./pages/Mentorship";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAlumni from "./pages/admin/AdminAlumni";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminDonations from "./pages/admin/AdminDonations";
import AdminStories from "./pages/admin/AdminStories";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AiAssistantWidget from "@/components/ai/AiAssistantWidget";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    const hydrate = async () => {
      try {
        await hydrateLocalStorageFromBackend();
      } catch (error) {
        console.error('Failed to hydrate data from backend:', error);
      }
    };

    void hydrate();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/stories" element={<SuccessStories />} />
          <Route path="/events" element={<Events />} />
        </Route>

        {/* Auth Pages (no layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        <Route element={<MainLayout />}>
          <Route path="/student" element={<Navigate to="/dashboard" replace />} />
          <Route path="/student/dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['alumni', 'student']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/alumni" element={
            <ProtectedRoute>
              <AlumniNetwork />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          } />
          <Route path="/mentorship" element={
            <ProtectedRoute>
              <Mentorship />
            </ProtectedRoute>
          } />
          <Route path="/donate" element={
            <ProtectedRoute>
              <Donate />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['alumni']}>
              <Profile />
            </ProtectedRoute>
          } />
        </Route>

        {/* Admin Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/alumni" element={<AdminAlumni />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/donations" element={<AdminDonations />} />
          <Route path="/admin/stories" element={<AdminStories />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AiAssistantWidget />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AiAssistantProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AiAssistantProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
