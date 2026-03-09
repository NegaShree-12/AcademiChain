// frontend/src/layouts/RoleLayout.tsx
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

  // Handle verifier role explicitly
  if (
    user.role === "verifier" ||
    user.role === "employer" ||
    user.role === "university"
  ) {
    console.log("🎭 Using VerifierLayout");
    return <VerifierLayout>{children}</VerifierLayout>;
  }

  switch (user.role) {
    case "student":
      console.log("🎭 Using StudentLayout");
      return <StudentLayout>{children}</StudentLayout>;

    case "institution":
      console.log("🎭 Using InstitutionLayout");
      return <InstitutionLayout>{children}</InstitutionLayout>;

    case "admin":
      console.log("🎭 Using AdminLayout");
      return <AdminLayout>{children}</AdminLayout>;

    default:
      console.log(`🎭 Unknown role: ${user.role}, rendering children directly`);
      return <>{children}</>;
  }
}
