import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { institutionAPI } from "@/lib/api"; // reuse institution API or create admin API

export function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 3245,
    totalInstitutions: 156,
    totalVerifiers: 89,
    totalCredentials: 15432,
    pendingVerifications: 23,
    systemUptime: "99.98%",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      // In production: call admin API
      // const response = await adminAPI.getStats();
      // setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard stats",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 flex items-center justify-center h-64">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              System overview and management
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-success/10 text-success border-success/20 gap-1"
          >
            <Shield className="h-3 w-3" />
            System Healthy
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            variant="primary"
          />
          <StatsCard
            title="Institutions"
            value={stats.totalInstitutions}
            icon={Building2}
            variant="success"
          />
          <StatsCard
            title="Verifiers"
            value={stats.totalVerifiers}
            icon={Shield}
            variant="default"
          />
          <StatsCard
            title="Credentials"
            value={stats.totalCredentials.toLocaleString()}
            icon={BarChart3}
            variant="warning"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Recent System Activity</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 pb-3 border-b last:border-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        New institution registered
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stanford University • 2 hours ago
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Verified
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Blockchain Network</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Healthy</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">IPFS Gateway</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Operational</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Response</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">120ms avg</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="gap-2 h-auto py-4 flex-col"
                >
                  <Users className="h-6 w-6" />
                  <span>Manage Users</span>
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 h-auto py-4 flex-col"
                >
                  <Building2 className="h-6 w-6" />
                  <span>Verify Institutions</span>
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 h-auto py-4 flex-col"
                >
                  <Shield className="h-6 w-6" />
                  <span>System Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
