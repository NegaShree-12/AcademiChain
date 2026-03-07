import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { studentAPI } from "../../lib/api";
import {
  Share2,
  QrCode,
  Clock,
  Eye,
  Copy,
  ExternalLink,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";

interface ShareLink {
  shareId: string;
  credentialTitle: string;
  shareType: string;
  accessCount: number;
  maxAccess?: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  qrCode?: string;
}

const SharedLinksPage: React.FC = () => {
  const { toast } = useToast();
  const [shares, setShares] = useState<ShareLink[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedShare, setSelectedShare] = useState<ShareLink | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    fetchShares();
  }, []);

  const fetchShares = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getShareLinks();
      setShares(response.data.data);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching share links:", error);
      toast({
        title: "Error",
        description: "Failed to load share links",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (shareId: string) => {
    try {
      await studentAPI.revokeShareLink(shareId);
      toast({
        title: "Success",
        description: "Share link revoked successfully",
      });
      fetchShares();
    } catch (error) {
      console.error("Error revoking share link:", error);
      toast({
        title: "Error",
        description: "Failed to revoke share link",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (shareId: string) => {
    const url = `${import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173"}/verify?shareId=${shareId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const activeShares = shares.filter(
    (s) => s.isActive && new Date(s.expiresAt) > new Date(),
  );
  const expiredShares = shares.filter(
    (s) => !s.isActive || new Date(s.expiresAt) <= new Date(),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shared Links</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and track your shared credential links
              </p>
            </div>
            <Link
              to="/student/credentials"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Credentials
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm font-medium text-gray-600">Total Shares</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {stats.active}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-600 mt-2">
                {stats.expired}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {stats.totalAccesses}
              </p>
            </div>
          </div>
        )}

        {/* Active Shares */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Active Share Links
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {activeShares.length > 0 ? (
              activeShares.map((share) => (
                <div
                  key={share.shareId}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium text-gray-900">
                          {share.credentialTitle}
                        </h3>
                        <span className="ml-3 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {share.shareType}
                        </span>
                      </div>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          Expires:{" "}
                          {new Date(share.expiresAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Eye className="h-4 w-4 mr-1 text-gray-400" />
                          Views: {share.accessCount}{" "}
                          {share.maxAccess && `/ ${share.maxAccess}`}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                          Active
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(share.shareId)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        title="Copy link"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedShare(share);
                          setShowQRModal(true);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                        title="Show QR code"
                      >
                        <QrCode className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleRevoke(share.shareId)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                        title="Revoke"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No active share links</p>
                <p className="text-sm text-gray-400 mt-1">
                  Share your credentials to generate links
                </p>
                <Link
                  to="/student/credentials"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Credentials
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Expired/Revoked Shares */}
        {expiredShares.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Expired & Revoked Links
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {expiredShares.slice(0, 5).map((share) => (
                <div key={share.shareId} className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {share.credentialTitle}
                      </p>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="text-xs text-gray-500">
                          Created:{" "}
                          {new Date(share.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-red-600 flex items-center">
                          <XCircle className="h-3 w-3 mr-1" />
                          {share.isActive ? "Expired" : "Revoked"}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {share.accessCount} views
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedShare && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={() => setShowQRModal(false)}
            ></div>

            <div className="relative bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                QR Code
              </h3>

              <div className="flex justify-center mb-4">
                {selectedShare.qrCode ? (
                  <img
                    src={selectedShare.qrCode}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                    <QrCode className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 text-center mb-4">
                Scan to verify {selectedShare.credentialTitle}
              </p>

              <button
                onClick={() => setShowQRModal(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedLinksPage;
