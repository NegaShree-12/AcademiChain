import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { RoleLayout } from "@/layouts/RoleLayout";
import { useAuth } from "@/contexts/AuthContext"; // ← THIS WAS MISSING!

// Public Pages
import { Landing } from "./pages/Landing";
import { Verify } from "./pages/Verify";
import NotFound from "./pages/NotFound";

// Student Pages
import { StudentDashboard } from "./pages/Dashboard";
import { CredentialDetailPage } from "./pages/student/CredentialDetailPage";
import { SettingsPage } from "./pages/student/SettingsPage";
import { SharedLinksPage } from "./pages/student/SharedLinksPage";
import { VerificationHistoryPage } from "./pages/student/VerificationHistoryPage";

// Institution Pages
import { InstitutionDashboard } from "./pages/InstitutionDashboard";
import { UploadCredential } from "./pages/institution/UploadCredential";

// Verifier Pages
import { VerifierDashboard } from "./pages/verifier/VerifierDashboard";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";

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
                    <CredentialDetailPage />
                  </RoleLayout>
                </RoleGuard>
              }
            />
            <Route
              path="/student/settings"
              element={
                <RoleGuard allowedRoles={["student"]}>
                  <RoleLayout>
                    <SettingsPage />
                  </RoleLayout>
                </RoleGuard>
              }
            />
            <Route
              path="/student/shared"
              element={
                <RoleGuard allowedRoles={["student"]}>
                  <RoleLayout>
                    <SharedLinksPage />
                  </RoleLayout>
                </RoleGuard>
              }
            />
            <Route
              path="/student/verifications"
              element={
                <RoleGuard allowedRoles={["student"]}>
                  <RoleLayout>
                    <VerificationHistoryPage />
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
                <RoleGuard
                  allowedRoles={["employer", "university", "verifier"]}
                >
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
            <Route path="/dashboard" element={<RoleBasedRedirect />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
}

// Helper component for redirect - NOW useAuth is defined!
function RoleBasedRedirect() {
  const { user } = useAuth();

  console.log("🔄 RoleBasedRedirect - User:", user);

  if (!user) {
    console.log("🚫 No user, redirecting to /");
    return <Navigate to="/" replace />;
  }

  if (!user.role) {
    console.log("🚫 No role, redirecting to /");
    return <Navigate to="/" replace />;
  }

  console.log(`✅ Redirecting to /${user.role}`);

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
