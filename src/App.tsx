// frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { RoleLayout } from "@/layouts/RoleLayout";
import { useAuth } from "@/contexts/AuthContext";

// Public Pages
import { Landing } from "./pages/Landing";
import Verify from "./pages/Verify";
import { VerifyCredential } from "./pages/VerifyCredential";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentDashboard from "./pages/student/dashboard";
import CredentialDetailPage from "./pages/student/CredentialDetailPage";
import CredentialsPage from "./pages/student/CredentialsPage";
import { SettingsPage } from "./pages/student/SettingsPage";
import SharedLinksPage from "./pages/student/SharedLinksPage";
import { VerificationHistoryPage } from "./pages/student/VerificationHistoryPage";

// Institution Pages
import { InstitutionDashboard } from "./pages/InstitutionDashboard";
import { UploadCredential } from "./pages/institution/UploadCredential";
import { StudentsPage } from "./pages/institution/StudentPage";
import { IssuedCredentialsPage } from "./pages/institution/IssuedCredentialsPage";
import { InstitutionSettingsPage } from "./pages/institution/SettingsPage";

// Verifier Pages
import { VerifierVerify } from "./pages/verifier/VerifierVerify";

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
            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<Landing />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/verify/:hash" element={<VerifyCredential />} />

            {/* ================= STUDENT ROUTES ================= */}
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
              path="/student/credentials"
              element={
                <RoleGuard allowedRoles={["student"]}>
                  <RoleLayout>
                    <CredentialsPage />
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
            <Route
              path="/student/activity"
              element={
                <RoleGuard allowedRoles={["student"]}>
                  <RoleLayout>
                    <div className="container py-8">
                      <h1 className="text-2xl font-bold">Activity History</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </RoleLayout>
                </RoleGuard>
              }
            />

            {/* ================= INSTITUTION ROUTES ================= */}
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
              path="/institution/students"
              element={
                <RoleGuard allowedRoles={["institution"]}>
                  <RoleLayout>
                    <StudentsPage />
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
            <Route
              path="/institution/credentials"
              element={
                <RoleGuard allowedRoles={["institution"]}>
                  <RoleLayout>
                    <IssuedCredentialsPage />
                  </RoleLayout>
                </RoleGuard>
              }
            />
            <Route
              path="/institution/settings"
              element={
                <RoleGuard allowedRoles={["institution"]}>
                  <RoleLayout>
                    <InstitutionSettingsPage />
                  </RoleLayout>
                </RoleGuard>
              }
            />

            {/* ================= VERIFIER ROUTES ================= */}
            {/* Single verifier route - both dashboard and verify point here */}
            <Route
              path="/verifier"
              element={
                <RoleGuard
                  allowedRoles={["verifier", "employer", "university"]}
                >
                  <RoleLayout>
                    <VerifierVerify />
                  </RoleLayout>
                </RoleGuard>
              }
            />
            {/* Removed duplicate /verifier/verify route */}

            <Route
              path="/verifier/history"
              element={
                <RoleGuard
                  allowedRoles={["verifier", "employer", "university"]}
                >
                  <RoleLayout>
                    <div className="container py-8">
                      <h1 className="text-2xl font-bold">
                        Verification History
                      </h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </RoleLayout>
                </RoleGuard>
              }
            />
            <Route
              path="/verifier/settings"
              element={
                <RoleGuard
                  allowedRoles={["verifier", "employer", "university"]}
                >
                  <RoleLayout>
                    <div className="container py-8">
                      <h1 className="text-2xl font-bold">Verifier Settings</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </RoleLayout>
                </RoleGuard>
              }
            />

            {/* ================= ADMIN ROUTES ================= */}
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

            {/* ================= REDIRECT ROUTES ================= */}
            <Route path="/dashboard" element={<RoleBasedRedirect />} />
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
    case "employer":
    case "university":
      return <Navigate to="/verifier" replace />;
    case "admin":
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}

export default App;
