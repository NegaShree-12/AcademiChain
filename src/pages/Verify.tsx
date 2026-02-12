import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  VerificationBadge,
  BlockchainBadge,
  TrustBadge,
} from "@/components/VerificationBadge";
import {
  Search,
  ArrowRight,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  FileText,
  Calendar,
  Hash,
  Building,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { credentialAPI } from "@/lib/api";
import { mockCredentials } from "@/data/mockData";

export function Verify() {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [inputHash, setInputHash] = useState(hash || "");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );

  const { toast } = useToast();

  // Mock verification function (replace with real API)
  const verifyCredential = async (hashToVerify: string) => {
    setIsVerifying(true);
    setVerificationError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check if hash matches any mock credential
      const matchingCredential = mockCredentials.find(
        (cred) => cred.txHash === hashToVerify || cred.id === hashToVerify,
      );

      if (matchingCredential) {
        // Valid credential found
        const mockResult = {
          isValid: matchingCredential.status === "verified",
          credential: matchingCredential,
          txHash: hashToVerify,
          blockNumber: matchingCredential.blockNumber,
          confirmations: 145678,
          verifiedAt: new Date().toISOString(),
          issuer: {
            name: matchingCredential.institution,
            address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45",
            verified: true,
          },
        };
        setVerificationResult(mockResult);

        toast({
          title:
            matchingCredential.status === "verified"
              ? "✅ Verification Successful"
              : "⚠️ Credential Found - Pending Verification",
          description:
            matchingCredential.status === "verified"
              ? "Credential verified on blockchain"
              : "This credential is still pending verification",
          variant:
            matchingCredential.status === "verified" ? "default" : "warning",
        });
      } else {
        // No matching credential found
        setVerificationError("Credential not found on blockchain");
        toast({
          title: "❌ Verification Failed",
          description: "No matching credential found",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Verification failed";
      setVerificationError(errorMessage);
      toast({
        title: "❌ Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setVerificationError(null);
  };

  const handleVerify = async () => {
    if (!inputHash.trim()) {
      toast({
        title: "No input",
        description: "Please enter a credential hash or verification URL",
        variant: "destructive",
      });
      return;
    }

    resetVerification();
    await verifyCredential(inputHash);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  // Auto-verify if hash in URL
  useEffect(() => {
    if (hash) {
      setInputHash(hash);
      verifyCredential(hash);
    }
  }, [hash]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12 md:py-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Verify Academic Credentials
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter a credential hash or verification link to instantly verify its
            authenticity on the blockchain.
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
            <Input
              placeholder="Enter credential hash (0x...) or verification URL..."
              value={inputHash}
              onChange={(e) => setInputHash(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-14 pl-12 text-base font-mono pr-32"
              disabled={isVerifying}
            />
            <Button
              size="lg"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6"
              onClick={handleVerify}
              disabled={!inputHash.trim() || isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>

          {/* Example hash */}
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Try example:</span>
              <code
                className="font-mono text-xs bg-muted px-2 py-1 rounded cursor-pointer hover:bg-muted/80"
                onClick={() => {
                  setInputHash(
                    "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
                  );
                  toast({
                    title: "Example loaded",
                    description: "Click Verify to test",
                  });
                }}
              >
                0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f
              </code>
            </p>
          </div>
        </div>

        {/* Error State */}
        {verificationError && (
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
            <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive mb-1">
                    Verification Failed
                  </h3>
                  <p className="text-destructive/80 mb-3">
                    {verificationError}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={resetVerification}
                    >
                      Try Again
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/dashboard")}
                    >
                      View My Credentials
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification Progress */}
        {isVerifying && !verificationError && (
          <div className="max-w-md mx-auto mb-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              {["Checking Hash", "Querying Blockchain", "Verifying Issuer"].map(
                (step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all mb-2",
                        index === 0
                          ? "bg-primary text-primary-foreground animate-pulse"
                          : index === 1
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {index === 2 ? "3" : index + 1}
                    </div>
                    <p className="text-xs text-muted-foreground">{step}</p>
                  </div>
                ),
              )}
            </div>
            <p className="text-muted-foreground animate-pulse">
              Querying Ethereum blockchain for credential verification...
            </p>
          </div>
        )}

        {/* Verification Result */}
        {verificationResult && verificationResult.isValid && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            {/* Success Banner */}
            <div className="flex flex-col items-center text-center mb-12">
              <VerificationBadge size="lg" showAnimation={true} />
              <h2 className="text-2xl md:text-3xl font-bold text-success mt-6 mb-2">
                Credential Verified
              </h2>
              <p className="text-muted-foreground">
                This credential has been verified on the Ethereum blockchain.
              </p>
            </div>

            {/* Credential Details Card */}
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden mb-6">
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-border/50">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Document Type
                    </p>
                    <h3 className="text-2xl font-bold">
                      {verificationResult.credential?.title ||
                        "Academic Credential"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">Authentic</span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Building className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Issuing Institution
                      </p>
                      <p className="font-semibold">
                        {verificationResult.credential?.institution ||
                          "Verified Institution"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Issue Date
                      </p>
                      <p className="font-semibold">
                        {formatDate(
                          verificationResult.credential?.issueDate ||
                            verificationResult.verifiedAt,
                        )}
                      </p>
                    </div>
                  </div>

                  {verificationResult.credential?.description && (
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Description
                        </p>
                        <p className="font-semibold">
                          {verificationResult.credential.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Hash className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground mb-1">
                        Transaction Hash
                      </p>
                      <p className="font-mono text-sm break-all">
                        {verificationResult.txHash || inputHash}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Block Number
                      </p>
                      <p className="font-mono font-semibold">
                        #
                        {verificationResult.blockNumber?.toLocaleString() ||
                          "Pending"}
                      </p>
                    </div>
                  </div>

                  <BlockchainBadge
                    confirmations={verificationResult.confirmations || 1}
                  />
                </div>
              </div>

              {/* Issuer Verification */}
              <div className="p-6 md:p-8 border-t border-border/50 bg-muted/30">
                <TrustBadge
                  institution={
                    verificationResult.issuer?.name || "Blockchain Verified"
                  }
                  verified={verificationResult.issuer?.verified || true}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 gap-2"
                onClick={() => {
                  // Generate verification certificate
                  const certificate =
                    `AcademiChain Verification Certificate\n\n` +
                    `Credential: ${verificationResult.credential?.title || "Verified Credential"}\n` +
                    `Institution: ${verificationResult.credential?.institution || "Verified Issuer"}\n` +
                    `Transaction: ${verificationResult.txHash}\n` +
                    `Block: ${verificationResult.blockNumber}\n` +
                    `Verified: ${new Date(verificationResult.verifiedAt || Date.now()).toLocaleString()}\n` +
                    `Status: ✅ Verified on Blockchain`;

                  const blob = new Blob([certificate], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `verification-${verificationResult.txHash?.slice(0, 8) || "certificate"}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);

                  toast({
                    title: "Certificate Downloaded",
                    description: "Verification certificate saved",
                  });
                }}
              >
                <Download className="h-4 w-4" />
                Download Verification Certificate
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => {
                  if (verificationResult.txHash) {
                    window.open(
                      `https://sepolia.etherscan.io/tx/${verificationResult.txHash}`,
                      "_blank",
                    );
                  }
                }}
              >
                <ExternalLink className="h-4 w-4" />
                View on Block Explorer
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => navigate("/dashboard")}
              >
                <FileText className="h-4 w-4" />
                View My Credentials
              </Button>
            </div>
          </div>
        )}

        {/* Help Section (shown when idle) */}
        {!isVerifying && !verificationResult && !verificationError && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="rounded-2xl border border-border/50 bg-card p-8">
              <h3 className="font-semibold mb-6 text-lg">
                How to verify a credential
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-medium shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">
                      Get the verification link
                    </h4>
                    <p className="text-muted-foreground">
                      Ask the credential owner for their verification link or
                      hash
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-medium shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Paste and verify</h4>
                    <p className="text-muted-foreground">
                      Paste the link or hash above and click "Verify"
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-medium shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">
                      View verification results
                    </h4>
                    <p className="text-muted-foreground">
                      See blockchain-verified details including issuer,
                      timestamp, and authenticity status
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-lg bg-muted border border-muted-foreground/20">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-pending shrink-0" />
                  <div>
                    <p className="font-medium text-sm mb-2">
                      Example hash to try:
                    </p>
                    <div className="flex flex-col gap-2">
                      <code
                        className="text-xs font-mono text-muted-foreground break-all bg-background p-2 rounded cursor-pointer hover:bg-background/80 transition-colors"
                        onClick={() => {
                          setInputHash(
                            "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
                          );
                          toast({
                            title: "Example loaded",
                            description: "Click Verify to test",
                          });
                        }}
                      >
                        0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f
                      </code>
                      <p className="text-xs text-muted-foreground">
                        Click the hash above to load it, then click "Verify"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => navigate("/dashboard")}
                >
                  <FileText className="h-4 w-4" />
                  View My Credentials
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() =>
                    window.open("https://ethereum.org/en/learn/", "_blank")
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                  Learn About Blockchain
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
