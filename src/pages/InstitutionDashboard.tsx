// frontend/src/pages/InstitutionDashboard.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import {
  Award,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { institutionAPI } from "@/lib/api";

export function InstitutionDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalIssued: 0,
    activeStudents: 0,
    pendingIssuance: 0,
    verifiedToday: 0,
    totalStudents: 0,
    pendingCredentials: 0,
    failedCredentials: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);

      // Fetch dashboard stats
      const statsRes = await institutionAPI.getDashboardStats();
      console.log("📊 Dashboard stats:", statsRes.data);

      // Fetch credentials to calculate pending/failed
      const credentialsRes = await institutionAPI.getIssuedCredentials();
      const credentials = credentialsRes.data?.data || [];

      const pendingCount = credentials.filter(
        (c: any) => c.blockchainStatus === "pending",
      ).length;
      const failedCount = credentials.filter(
        (c: any) => c.blockchainStatus === "failed",
      ).length;

      setStats({
        totalIssued: statsRes.data?.data?.totalCredentials || 0,
        activeStudents: statsRes.data?.data?.activeStudents || 0,
        pendingIssuance: statsRes.data?.data?.pendingStudents || 0,
        verifiedToday: statsRes.data?.data?.verifiedToday || 0,
        totalStudents: statsRes.data?.data?.totalStudents || 0,
        pendingCredentials: pendingCount,
        failedCredentials: failedCount,
      });
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Institution Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Issue and manage blockchain-verified academic credentials
          </p>
        </div>
        <Link to="/institution/upload">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Issue New Credential
          </Button>
        </Link>
      </div>

      {/* Stats Cards - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Issued"
          value={stats.totalIssued}
          icon={Award}
          variant="primary"
        />
        <StatsCard
          title="Active Students"
          value={stats.activeStudents}
          icon={Users}
          variant="success"
        />
        <StatsCard
          title="Pending Students"
          value={stats.pendingIssuance}
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Verified Today"
          value={stats.verifiedToday}
          icon={CheckCircle2}
          variant="default"
        />
      </div>

      {/* Stats Cards - Second Row (Credential Status) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold mt-2">{stats.totalStudents}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending Credentials
                </p>
                <p className="text-3xl font-bold mt-2 text-yellow-600">
                  {stats.pendingCredentials}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Failed Credentials
                </p>
                <p className="text-3xl font-bold mt-2 text-red-600">
                  {stats.failedCredentials}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/institution/students">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Manage Students</h3>
                <p className="text-sm text-muted-foreground">
                  View and edit student details
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/institution/upload">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Issue Credential</h3>
                <p className="text-sm text-muted-foreground">
                  Create new blockchain credential
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/institution/credentials">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">View All Credentials</h3>
                <p className="text-sm text-muted-foreground">
                  See all issued credentials
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
