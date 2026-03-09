// frontend/src/layouts/VerifierLayout.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  Search,
  History,
  Settings,
  LogOut,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const verifierNavItems = [
  { href: "/verifier", icon: Shield, label: "Dashboard" },
  { href: "/verifier/verify", icon: Search, label: "Verify Credentials" },
  { href: "/verifier/history", icon: History, label: "Verification History" },
  { href: "/verifier/settings", icon: Settings, label: "Settings" },
];

export function VerifierLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-card">
        <div className="flex h-16 items-center border-b border-border/50 px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{user?.name || "Verifier"}</p>
              <p className="text-xs text-muted-foreground">
                {user?.email || "verifier@organization.com"}
              </p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            {verifierNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
                      isActive(item.href) && "bg-accent text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Organization Info */}
          <div className="mt-8 p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Verifier Status</span>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Organization</span>
                <span className="font-medium text-success">Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network</span>
                <span className="font-medium">Sepolia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wallet</span>
                <code className="font-mono text-xs">
                  {user?.walletAddress?.slice(0, 6)}...
                  {user?.walletAddress?.slice(-4)}
                </code>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive mt-4"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen bg-background">{children}</main>
    </div>
  );
}
