// frontend/src/pages/student/CredentialDetailPage.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studentAPI } from "../../lib/api";
import {
  ArrowLeft,
  Download,
  Share2,
  QrCode,
  Shield,
  Globe,
  Calendar,
  Building2,
  User,
  Hash,
  CheckCircle,
  XCircle,
  Copy,
  ExternalLink,
  Clock,
  Loader2,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentialId: string;
  qrCode: string | null;
  shareUrl: string | null;
  onGenerateShare: (
    shareType: string,
    expiresInDays: string,
    maxAccess: string,
  ) => Promise<void>;
  onCopyLink: (text: string) => void;
  onDownloadQR: () => void;
  loading: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  credentialId,
  qrCode,
  shareUrl,
  onGenerateShare,
  onCopyLink,
  onDownloadQR,
  loading,
}) => {
  const [shareType, setShareType] = useState("public");
  const [expiresInDays, setExpiresInDays] = useState("7");
  const [maxAccess, setMaxAccess] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Share Credential
                </h3>

                {!qrCode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Share Type
                      </label>
                      <select
                        value={shareType}
                        onChange={(e) => setShareType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="public">
                          Public - Anyone with link
                        </option>
                        <option value="private">
                          Private - Only specified emails
                        </option>
                        <option value="one-time">One-time access</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expires In (Days)
                      </label>
                      <input
                        type="number"
                        value={expiresInDays}
                        onChange={(e) => setExpiresInDays(e.target.value)}
                        min="1"
                        max="30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Accesses (Optional)
                      </label>
                      <input
                        type="number"
                        value={maxAccess}
                        onChange={(e) => setMaxAccess(e.target.value)}
                        min="1"
                        placeholder="Unlimited"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      onClick={() =>
                        onGenerateShare(shareType, expiresInDays, maxAccess)
                      }
                      disabled={loading}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Generating..." : "Generate Share Link"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Debug info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                      <p>✅ QR Code generated!</p>
                      <p className="truncate mt-1 font-mono">
                        Length: {qrCode.length} characters
                      </p>
                    </div>

                    {/* QR Code Image */}
                    <div className="flex justify-center p-4 bg-white rounded-lg border">
                      <img
                        src={qrCode}
                        alt="QR Code"
                        className="w-48 h-48 block"
                        onError={(e) => {
                          console.error("Image failed to load:", e);
                          e.currentTarget.style.display = "none";
                        }}
                        onLoad={() =>
                          console.log("✅ QR Code image loaded successfully")
                        }
                      />
                    </div>

                    {/* Share URL */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 truncate mb-2">
                        {shareUrl}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onCopyLink(shareUrl!)}
                          className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm flex items-center justify-center"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy Link
                        </button>
                        <button
                          onClick={() => window.open(shareUrl!, "_blank")}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open
                        </button>
                      </div>
                    </div>

                    {/* Download and Close buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={onDownloadQR}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download QR
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CredentialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [credential, setCredential] = useState<any>(null);
  const [shareLinks, setShareLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  // Share modal state
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [generatingShare, setGeneratingShare] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCredentialDetails();
    }
  }, [id]);

  const fetchCredentialDetails = async () => {
    try {
      setLoading(true);
      console.log("📋 Fetching credential details for ID:", id);

      const response = await studentAPI.getCredentialById(id!);
      console.log("✅ Credential details response:", response.data);

      setCredential(response.data.data);
      setShareLinks(response.data.shareLinks || []);
    } catch (error: any) {
      console.error("Error fetching credential:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to load credential details",
        variant: "destructive",
      });
      navigate("/student/credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateShare = async (
    shareType: string,
    expiresInDays: string,
    maxAccess: string,
  ) => {
    try {
      setGeneratingShare(true);
      const response = await studentAPI.generateShareLink(
        credential.credentialId,
        {
          shareType,
          expiresInDays: parseInt(expiresInDays),
          maxAccess: maxAccess ? parseInt(maxAccess) : undefined,
        },
      );

      console.log("Share link response:", response.data);
      setQrCode(response.data.data.qrCode);
      setShareUrl(response.data.data.shareUrl);

      toast({
        title: "Success",
        description: "Share link generated successfully",
      });
    } catch (error: any) {
      console.error("Error generating share link:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to generate share link",
        variant: "destructive",
      });
    } finally {
      setGeneratingShare(false);
    }
  };

  const handleCopyLink = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownloadQR = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `credential-qr-${credential.credentialId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "QR code saved to your device",
    });
  };

  const handleCloseModal = () => {
    setShowShareModal(false);
    // Don't clear QR code so it stays when reopening
  };

  const handleRevokeShare = async (shareId: string) => {
    try {
      await studentAPI.revokeShareLink(shareId);
      toast({
        title: "Success",
        description: "Share link revoked successfully",
      });
      fetchCredentialDetails();
    } catch (error: any) {
      console.error("Error revoking share link:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to revoke share link",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!credential) return;

    const data = {
      credential: {
        id: credential.credentialId,
        title: credential.title,
        studentName: credential.studentName,
        institutionName: credential.institutionName,
        issueDate: credential.issueDate,
        credentialType: credential.credentialType,
        blockchainTxHash: credential.blockchainTxHash,
        ipfsHash: credential.ipfsHash,
      },
      verification: {
        verified: credential.blockchainStatus === "verified",
        timestamp: new Date().toISOString(),
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `credential-${credential.credentialId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Credential data downloaded successfully",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Credential Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          The credential you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/student/credentials")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <button
          onClick={() => navigate("/student/credentials")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Credentials
        </button>

        {/* Credential Status Banner */}
        {credential.blockchainStatus === "verified" ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-800 font-medium">
              Verified on Blockchain
            </span>
            <span className="text-green-600 text-sm ml-2">
              Transaction confirmed
            </span>
          </div>
        ) : credential.blockchainStatus === "pending" ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center">
            <Clock className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-yellow-800 font-medium">
              Pending Verification
            </span>
            <span className="text-yellow-600 text-sm ml-2">
              Awaiting blockchain confirmation
            </span>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-800 font-medium">
              Verification Failed
            </span>
            <span className="text-red-600 text-sm ml-2">
              Credential could not be verified
            </span>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Credential Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-900">
                  {credential.title}
                </h1>
                <p className="text-gray-600 mt-1">{credential.description}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Student Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Student Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-base font-medium text-gray-900">
                          {credential.studentName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Hash className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Student ID</p>
                        <p className="text-base font-medium text-gray-900">
                          {credential.studentId}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Institution Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Issuing Institution
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <Building2 className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Institution Name
                        </p>
                        <p className="text-base font-medium text-gray-900">
                          {credential.institutionName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credential Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Credential Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Issue Date</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(credential.issueDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Credential Type</p>
                      <p className="text-base font-medium text-gray-900 capitalize">
                        {credential.credentialType}
                      </p>
                    </div>
                    {credential.metadata?.grade && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500">Grade</p>
                        <p className="text-base font-medium text-gray-900">
                          {credential.metadata.grade}
                        </p>
                      </div>
                    )}
                    {credential.metadata?.gpa && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500">GPA</p>
                        <p className="text-base font-medium text-gray-900">
                          {credential.metadata.gpa}
                        </p>
                      </div>
                    )}
                    {credential.metadata?.credits && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500">Credits</p>
                        <p className="text-base font-medium text-gray-900">
                          {credential.metadata.credits}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Blockchain Proof */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Blockchain Verification
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">
                          Transaction Hash
                        </p>
                        <div className="flex items-center mt-1">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                            {credential.blockchainTxHash}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                credential.blockchainTxHash,
                              );
                              toast({
                                title: "Copied!",
                                description:
                                  "Transaction hash copied to clipboard",
                              });
                            }}
                            className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Globe className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">IPFS Hash</p>
                        <div className="flex items-center mt-1">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {credential.ipfsHash}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Share Links */}
          <div className="lg:col-span-1 space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Credential
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download as JSON
                </button>
              </div>
            </div>

            {/* Active Share Links */}
            {shareLinks.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-gray-900">
                    Active Share Links
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {shareLinks
                    .filter(
                      (s) => s.isActive && new Date(s.expiresAt) > new Date(),
                    )
                    .map((share) => (
                      <div key={share.shareId} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 flex items-center">
                              <QrCode className="h-4 w-4 text-green-500 mr-1" />
                              {share.shareType}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Expires:{" "}
                              {new Date(share.expiresAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              Views: {share.accessCount}{" "}
                              {share.maxAccess && `/ ${share.maxAccess}`}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRevokeShare(share.shareId)}
                            className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          >
                            Revoke
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={handleCloseModal}
        credentialId={credential.credentialId}
        qrCode={qrCode}
        shareUrl={shareUrl}
        onGenerateShare={handleGenerateShare}
        onCopyLink={handleCopyLink}
        onDownloadQR={handleDownloadQR}
        loading={generatingShare}
      />
    </div>
  );
};

export default CredentialDetailPage;
