// frontend/src/pages/student/dashboard.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { studentAPI } from "../../lib/api";
import {
  GraduationCap,
  Share2,
  Activity,
  ChevronRight,
  QrCode,
  TrendingUp,
  Award,
  Clock,
  Shield,
  Eye,
  Loader2,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";

interface DashboardStats {
  totalCredentials: number;
  verifiedCredentials: number;
  pendingCredentials: number;
  activeShares: number;
  totalVerifications: number;
  recentActivity: any[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch credentials
      const credentialsRes = await studentAPI.getCredentials();
      console.log("📋 Student credentials response:", credentialsRes);
      console.log("📋 Student credentials data:", credentialsRes.data);

      let credentialsList = [];
      if (credentialsRes.data?.success && credentialsRes.data?.data) {
        credentialsList = credentialsRes.data.data;
      } else if (credentialsRes.data?.data) {
        credentialsList = credentialsRes.data.data;
      } else if (Array.isArray(credentialsRes.data)) {
        credentialsList = credentialsRes.data;
      } else {
        credentialsList = credentialsRes.data || [];
      }

      console.log(
        `✅ Found ${credentialsList.length} credentials for ${user?.email || user?.walletAddress}`,
      );
      setCredentials(credentialsList.slice(0, 5)); // Show only 5 most recent

      // Calculate stats from actual credentials
      const totalCredentials = credentialsList.length;
      const verifiedCredentials = credentialsList.filter(
        (c: any) => c.blockchainStatus === "verified",
      ).length;
      const pendingCredentials = credentialsList.filter(
        (c: any) => c.blockchainStatus === "pending",
      ).length;

      // Fetch share links stats (optional)
      let activeShares = 0;
      let totalVerifications = 0;
      try {
        const sharesRes = await studentAPI.getShareLinks();
        if (sharesRes.data?.data) {
          const activeSharesList = sharesRes.data.data.filter(
            (s: any) => s.isActive && new Date(s.expiresAt) > new Date(),
          );
          activeShares = activeSharesList.length;
          totalVerifications = sharesRes.data.data.reduce(
            (sum: number, s: any) => sum + (s.accessCount || 0),
            0,
          );
        }
      } catch (shareError) {
        console.warn("Could not fetch share links:", shareError);
      }

      setStats({
        totalCredentials,
        verifiedCredentials,
        pendingCredentials,
        activeShares,
        totalVerifications,
        recentActivity: [],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Student Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.name || "Student"}! You have{" "}
                {stats?.totalCredentials || 0} credentials.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-700">
                  Network: Sepolia
                </span>
              </div>
              <div className="px-4 py-2 bg-gray-100 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Wallet: {user?.walletAddress?.slice(0, 6)}...
                  {user?.walletAddress?.slice(-4)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Credentials */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Credentials
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalCredentials || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">
                {stats?.verifiedCredentials || 0} verified
              </span>
              {stats?.pendingCredentials ? (
                <>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-yellow-600">
                    {stats?.pendingCredentials} pending
                  </span>
                </>
              ) : null}
            </div>
          </div>

          {/* Active Shares */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Shares
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.activeShares || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Share2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/student/shares"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Manage shares →
              </Link>
            </div>
          </div>

          {/* Total Verifications */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Verifications
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalVerifications || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">
                Times credentials viewed
              </span>
            </div>
          </div>

          {/* Request Credential */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Request Credential
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">+0%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">from last month</span>
            </div>
          </div>
        </div>

        {/* Main Content - Recent Credentials & Activity */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Credentials */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Credentials
                </h2>
                <Link
                  to="/student/credentials"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {credentials.length > 0 ? (
                  credentials.map((credential) => (
                    <div
                      key={credential._id || credential.credentialId}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-md font-medium text-gray-900">
                              {credential.title || "Untitled Credential"}
                            </h3>
                            <span
                              className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                                credential.blockchainStatus === "verified"
                                  ? "bg-green-100 text-green-800"
                                  : credential.blockchainStatus === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {credential.blockchainStatus === "verified"
                                ? "Verified"
                                : credential.blockchainStatus === "pending"
                                  ? "Pending"
                                  : "Unknown"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {credential.institutionName ||
                              credential.institution ||
                              "Unknown Institution"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Issued:{" "}
                            {credential.issueDate
                              ? new Date(
                                  credential.issueDate,
                                ).toLocaleDateString()
                              : "Unknown date"}
                          </p>
                          {credential.blockchainTxHash && (
                            <p className="text-xs text-gray-400 mt-1 font-mono">
                              Tx: {credential.blockchainTxHash.slice(0, 10)}...
                              {credential.blockchainTxHash.slice(-8)}
                            </p>
                          )}
                        </div>
                        <Link
                          to={`/student/credentials/${credential.credentialId || credential._id}`}
                          className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No credentials yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {user?.email
                        ? `Credentials issued to ${user.email} will appear here`
                        : "Your issued credentials will appear here"}
                    </p>
                    <Link
                      to="/verify"
                      className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Verify a Credential
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <Link
                  to="/student/credentials"
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-blue-900">
                      View My Credentials
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                </Link>

                {/* REMOVED: Manage Share Links option */}

                <Link
                  to="/student/settings"
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="text-sm font-medium text-purple-900">
                      Account Settings
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-purple-600" />
                </Link>

                <Link
                  to="/verify"
                  className="flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-amber-600 mr-3" />
                    <span className="text-sm font-medium text-amber-900">
                      Verify a Credential
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-amber-600" />
                </Link>
              </div>
            </div>

            {/* Blockchain Status Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Blockchain Status
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Network</span>
                    <span className="text-sm font-medium text-gray-900">
                      Sepolia
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Your Wallet</span>
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {user?.walletAddress?.slice(0, 8)}...
                      {user?.walletAddress?.slice(-4)}
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Connected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
