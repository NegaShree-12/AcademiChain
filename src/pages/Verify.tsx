import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verificationAPI } from "../lib/api";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building2,
  Calendar,
  Hash,
  Globe,
  Award,
  ExternalLink,
} from "lucide-react";

const Verify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const shareId = searchParams.get("shareId");
  const credentialId = searchParams.get("credentialId");

  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    verifyCredential();
  }, [shareId, credentialId]);

  const verifyCredential = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (shareId) {
        response = await verificationAPI.verifyByShareId(shareId);
      } else if (credentialId) {
        response = await verificationAPI.verifyDirect(credentialId);
      } else {
        setError("No verification ID provided");
        return;
      }

      setVerificationResult(response.data.data);
    } catch (error: any) {
      console.error("Verification error:", error);
      setError(error.response?.data?.message || "Failed to verify credential");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Verifying Credential
          </h2>
          <p className="text-gray-500">
            Please wait while we verify the credential on blockchain...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const { credential, verification, shareInfo } = verificationResult;
  const isVerified =
    verification.status === "verified" || verification.verifiedOnChain;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {isVerified ? (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-12 w-12 text-yellow-600" />
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isVerified ? "Verified Credential" : "Pending Verification"}
          </h1>
          <p className="text-gray-600">
            {isVerified
              ? "This credential has been verified on the blockchain"
              : "This credential is awaiting blockchain confirmation"}
          </p>
        </div>

        {/* Verification Badge */}
        <div
          className={`mb-6 p-4 rounded-lg ${
            isVerified
              ? "bg-green-50 border border-green-200"
              : "bg-yellow-50 border border-yellow-200"
          }`}
        >
          <div className="flex items-center">
            <Shield
              className={`h-5 w-5 ${
                isVerified ? "text-green-600" : "text-yellow-600"
              } mr-2`}
            />
            <span
              className={`font-medium ${
                isVerified ? "text-green-800" : "text-yellow-800"
              }`}
            >
              {isVerified
                ? "Blockchain Verified"
                : "Blockchain Verification Pending"}
            </span>
            {verification.blockchainNetwork && (
              <span className="ml-2 text-sm text-gray-600">
                Network: {verification.blockchainNetwork}
              </span>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Credential Header */}
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {credential.title}
            </h2>
            <p className="text-gray-600">{credential.description}</p>
          </div>

          {/* Credential Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                    Student Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {credential.studentName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                    Issuing Institution
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <Building2 className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Institution</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {credential.institutionName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                    Credential Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Issue Date</p>
                        <p className="font-medium text-gray-900">
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
                    </div>
                    <div className="flex items-start">
                      <Award className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Credential Type</p>
                        <p className="font-medium text-gray-900 capitalize">
                          {credential.credentialType}
                        </p>
                      </div>
                    </div>
                    {credential.metadata?.grade && (
                      <div className="flex items-start">
                        <Award className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Grade</p>
                          <p className="font-medium text-gray-900">
                            {credential.metadata.grade}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Proof */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                Blockchain Verification Proof
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Transaction Hash</p>
                  <code className="text-sm bg-gray-100 px-3 py-2 rounded block truncate">
                    {verification.blockchainTxHash}
                  </code>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">IPFS Hash</p>
                  <code className="text-sm bg-gray-100 px-3 py-2 rounded block truncate">
                    {verification.ipfsHash}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Verification Timestamp
                    </p>
                    <p className="font-medium text-gray-900">
                      {new Date(verification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {verification.verifiedOnChain && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Verified on Chain
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Share Information */}
            {shareInfo && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Share Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Shared by{" "}
                    <span className="font-medium text-gray-900">
                      {shareInfo.sharedBy}
                    </span>{" "}
                    on {new Date(shareInfo.sharedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    This credential has been viewed {shareInfo.accessNumber}{" "}
                    times
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => window.print()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Print Verification
              </button>
              <a
                href={`https://sepolia.etherscan.io/tx/${verification.blockchainTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                View on Etherscan
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
