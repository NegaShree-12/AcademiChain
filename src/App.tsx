import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { RoleLayout } from "@/layouts/RoleLayout";

// Public Pages
import { Landing } from "./pages/Landing";
import { Verify } from "./pages/Verify";
import NotFound from "./pages/NotFound";

// Student Pages
import { StudentDashboard } from "./pages/Dashboard";
// import { CredentialDetailPage } from './pages/student/CredentialDetailPage';
// import { SettingsPage } from './pages/student/SettingsPage';

// Institution Pages
import { InstitutionDashboard } from "./pages/InstitutionDashboard";
import { UploadCredential } from "./pages/institution/UploadCredential";

// Verifier Pages
import { VerifierDashboard } from "./pages/verifier/VerifierDashboard";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { useAuth } from "@/contexts/AuthContext"; // ← Add this

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/verify/:hash" element={<Verify />} />

            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <RoleGuard allowedRoles={["student"]}>
                  <RoleLayout>
                    <StudentDashboard />
                  </RoleLayout>
                </RoleGuard>
              }
            />
            <Route
              path="/student/credentials/:id"
              element={
                <RoleGuard allowedRoles={["student"]}>
                  <RoleLayout>
                    {/* <CredentialDetailPage /> */} {/* TODO: create */}
                    <div>Credential Detail Page (Coming Soon)</div>
                  </RoleLayout>
                </RoleGuard>
              }
            />
            <Route
              path="/student/settings"
              element={
                <RoleGuard allowedRoles={["student"]}>
                  <RoleLayout>
                    {/* <SettingsPage /> */} {/* TODO: create */}
                    <div>Settings Page (Coming Soon)</div>
                  </RoleLayout>
                </RoleGuard>
              }
            />

            {/* Institution Routes */}
            <Route
              path="/institution"
              element={
                <RoleGuard allowedRoles={["institution"]}>
                  <RoleLayout>
                    <InstitutionDashboard />
                  </RoleLayout>
                </RoleGuard>
              }
            />
            <Route
              path="/institution/upload"
              element={
                <RoleGuard allowedRoles={["institution"]}>
                  <RoleLayout>
                    <UploadCredential />
                  </RoleLayout>
                </RoleGuard>
              }
            />

            {/* Verifier Routes */}
            <Route
              path="/verifier"
              element={
                <RoleGuard allowedRoles={["employer", "university"]}>
                  <RoleLayout>
                    <VerifierDashboard />
                  </RoleLayout>
                </RoleGuard>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <RoleLayout>
                    <AdminDashboard />
                  </RoleLayout>
                </RoleGuard>
              }
            />

            {/* Redirect /dashboard based on role */}
            <Route
              path="/dashboard"
              element={
                <RoleGuard
                  allowedRoles={[
                    "student",
                    "institution",
                    "employer",
                    "university",
                    "admin",
                  ]}
                  redirectTo="/"
                >
                  <RoleBasedRedirect />
                </RoleGuard>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
}

// Helper component for redirect
function RoleBasedRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  switch (user.role) {
    case "student":
      return <Navigate to="/student" replace />;
    case "institution":
      return <Navigate to="/institution" replace />;
    case "verifier":
      return <Navigate to="/verifier" replace />;
    case "admin":
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}

export default App;
