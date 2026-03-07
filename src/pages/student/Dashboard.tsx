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
      const [statsRes, credentialsRes] = await Promise.all([
        studentAPI.getDashboardStats(),
        studentAPI.getCredentials(),
      ]);

      setStats(statsRes.data.data);
      setCredentials(credentialsRes.data.data.slice(0, 5));
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                Welcome back, {user?.name}! Manage and share your academic
                credentials.
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
          {/* Stats cards - same as your second version */}
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
                +{stats?.verifiedCredentials || 0} verified
              </span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-yellow-600">
                {stats?.pendingCredentials || 0} pending
              </span>
            </div>
          </div>

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

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Request Credential
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">+12%</p>
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
                      key={credential.credentialId}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-md font-medium text-gray-900">
                              {credential.title}
                            </h3>
                            <span
                              className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                                credential.blockchainStatus === "verified"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {credential.blockchainStatus === "verified"
                                ? "Verified"
                                : "Pending"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {credential.institutionName}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Issued:{" "}
                            {new Date(
                              credential.issueDate,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <Link
                          to={`/student/credentials/${credential.credentialId}`}
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
                      Your issued credentials will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <Link
                  to="/student/activity"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                  stats.recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          {activity.type === "share_created" ? (
                            <QrCode className="h-4 w-4 text-green-600" />
                          ) : (
                            <Award className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
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

                <Link
                  to="/student/shares"
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Share2 className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-green-900">
                      Manage Share Links
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-green-600" />
                </Link>

                <Link
                  to="/student/verification-history"
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="text-sm font-medium text-purple-900">
                      Verification History
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-purple-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
