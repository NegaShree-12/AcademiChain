// frontend/src/layouts/RoleLayout.tsx
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { StudentLayout } from "./StudentLayout";
import { InstitutionLayout } from "./InstitutionLayout";
import { VerifierLayout } from "./VerifierLayout";
import { AdminLayout } from "./AdminLayout";

export function RoleLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  switch (user.role) {
    case "student":
      return <StudentLayout>{children}</StudentLayout>;
    case "institution":
      return <InstitutionLayout>{children}</InstitutionLayout>;
    case "employer":
    case "university":
      return <VerifierLayout>{children}</VerifierLayout>;
    case "admin":
      return <AdminLayout>{children}</AdminLayout>;
    default:
      return <>{children}</>;
  }
}
