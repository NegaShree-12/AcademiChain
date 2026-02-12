import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  GraduationCap,
  Share2,
  History,
  Settings,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const studentNavItems = [
  { href: "/student", icon: LayoutDashboard, label: "Dashboard" },
  {
    href: "/student/credentials",
    icon: GraduationCap,
    label: "My Credentials",
  },
  { href: "/student/shared", icon: Share2, label: "Shared Links" },
  {
    href: "/student/verifications",
    icon: History,
    label: "Verification History",
  }, // ← ADD THIS
  { href: "/student/settings", icon: Settings, label: "Settings" },
];

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-card">
        <div className="flex h-16 items-center border-b border-border/50 px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{user?.name || "Student"}</p>
              <p className="text-xs text-muted-foreground">
                {user?.walletAddress?.slice(0, 6)}...
                {user?.walletAddress?.slice(-4)}
              </p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            {studentNavItems.map((item) => {
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

          {/* Blockchain Status Widget */}
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
                <span className="text-muted-foreground">Your Wallet</span>
                <code className="font-mono text-xs">
                  {user?.walletAddress?.slice(0, 8)}...
                </code>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen bg-background">{children}</main>
    </div>
  );
}
