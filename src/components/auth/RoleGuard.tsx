import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/",
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in, redirect to home
  if (!user) {
    console.log("🚫 No user, redirecting to /");
    return <Navigate to="/" replace />;
  }

  // If user has no role, redirect to home (role selector will handle it)
  if (!user.role) {
    console.log("🚫 No role, redirecting to /");
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    console.log(
      `🚫 Role ${user.role} not allowed, redirecting to ${redirectTo}`,
    );
    return <Navigate to={redirectTo} replace />;
  }

  console.log(`✅ Access granted for role: ${user.role}`);
  return <>{children}</>;
}
