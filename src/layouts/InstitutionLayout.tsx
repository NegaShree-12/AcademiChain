// frontend/src/layouts/InstitutionLayout.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  GraduationCap,
  Users,
  FileText,
  BarChart3,
  Settings,
  Upload,
  Shield,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const institutionNavItems = [
  { href: "/institution/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/institution/students", icon: Users, label: "Students" },
  { href: "/institution/upload", icon: Upload, label: "Upload Credentials" },
  {
    href: "/institution/credentials",
    icon: FileText,
    label: "Issued Credentials",
  },
  { href: "/institution/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/institution/settings", icon: Settings, label: "Settings" },
];

export function InstitutionLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-card">
        <div className="flex h-16 items-center border-b border-border/50 px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">MIT Admin</p>
              <p className="text-xs text-muted-foreground">
                Institution Portal
              </p>
            </div>
          </div>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            {institutionNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
                      isActive && "bg-accent text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
          <div className="mt-8 p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Blockchain Status</span>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network</span>
                <span className="font-medium">Sepolia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issuer Wallet</span>
                <code className="font-mono">0x742d...b045</code>
              </div>
            </div>
          </div>
        </nav>
      </aside>
      <main className="ml-64">{children}</main>
    </div>
  );
}
