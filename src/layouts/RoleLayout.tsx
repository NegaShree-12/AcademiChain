import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { StudentLayout } from "./StudentLayout";
import { InstitutionLayout } from "./InstitutionLayout";
import { VerifierLayout } from "./VerifierLayout";
import { AdminLayout } from "./AdminLayout";

export function RoleLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  console.log("🎭 RoleLayout - User:", user);
  console.log("🎭 RoleLayout - Children:", children);

  if (!user) {
    console.log("🎭 No user, rendering children directly");
    return <>{children}</>;
  }

  console.log(`🎭 Rendering layout for role: ${user.role}`);

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
      console.log(`🎭 Unknown role: ${user.role}, rendering children directly`);
      return <>{children}</>;
  }
}
