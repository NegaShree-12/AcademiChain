import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  VerificationBadge,
  BlockchainBadge,
  TrustBadge,
} from "@/components/VerificationBadge";
import { mockVerificationResult } from "@/data/mockData";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

type VerificationState =
  | "idle"
  | "checking"
  | "verifying"
  | "success"
  | "error";

export function Verify() {
  const { hash } = useParams();
  const [inputHash, setInputHash] = useState(hash || "");
  const [verificationState, setVerificationState] =
    useState<VerificationState>("idle");
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (hash) {
      handleVerify();
    }
  }, [hash]);

  const handleVerify = async () => {
    if (!inputHash) return;

    setVerificationState("checking");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setVerificationState("verifying");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setVerificationState("success");
    setShowResult(true);
  };

  const result = mockVerificationResult;

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
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Enter credential hash (0x...) or verification URL..."
                value={inputHash}
                onChange={(e) => setInputHash(e.target.value)}
                className="h-14 pl-12 text-base font-mono"
              />
            </div>
            <Button
              size="lg"
              className="h-14 px-8"
              onClick={handleVerify}
              disabled={
                !inputHash ||
                verificationState === "checking" ||
                verificationState === "verifying"
              }
            >
              {verificationState === "checking" ||
              verificationState === "verifying" ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
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
        </div>

        {/* Verification Progress */}
        {(verificationState === "checking" ||
          verificationState === "verifying") && (
          <div className="max-w-md mx-auto mb-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              {["Checking Hash", "Querying Blockchain", "Verifying Issuer"].map(
                (step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                        index === 0 && verificationState === "checking"
                          ? "bg-primary text-primary-foreground animate-pulse"
                          : index <= 1 && verificationState === "verifying"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </div>
                    {index < 2 && (
                      <div
                        className={cn(
                          "w-8 h-0.5",
                          index === 0 && verificationState === "verifying"
                            ? "bg-primary"
                            : "bg-muted",
                        )}
                      />
                    )}
                  </div>
                ),
              )}
            </div>
            <p className="text-muted-foreground">
              {verificationState === "checking"
                ? "Checking hash format..."
                : "Querying Ethereum blockchain..."}
            </p>
          </div>
        )}

        {/* Verification Result */}
        {showResult && verificationState === "success" && (
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            {/* Success Banner */}
            <div className="flex flex-col items-center text-center mb-12">
              <VerificationBadge size="lg" />
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
                      {result.credential?.title}
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
                        {result.credential?.institution}
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
                        {result.credential?.issueDate &&
                          new Date(
                            result.credential.issueDate,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Description
                      </p>
                      <p className="font-semibold">
                        {result.credential?.description || "Bachelor's Degree"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Hash className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground mb-1">
                        Transaction Hash
                      </p>
                      <p className="font-mono text-sm break-all">
                        {result.credential?.txHash}
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
                        #{result.credential?.blockNumber.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <BlockchainBadge confirmations={result.blockConfirmations} />
                </div>
              </div>

              {/* Issuer Verification */}
              <div className="p-6 md:p-8 border-t border-border/50 bg-muted/30">
                <TrustBadge
                  institution={result.issuer.name}
                  verified={result.issuer.verified}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 gap-2">
                <Download className="h-4 w-4" />
                Download Verification Certificate
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <ExternalLink className="h-4 w-4" />
                View on Block Explorer
              </Button>
            </div>
          </div>
        )}

        {/* Help Section (shown when idle) */}
        {verificationState === "idle" && !showResult && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-border/50 bg-card p-8">
              <h3 className="font-semibold mb-4">How to verify a credential</h3>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                    1
                  </div>
                  <p>
                    Get the verification link or hash from the credential owner
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                    2
                  </div>
                  <p>Paste it in the search box above and click "Verify"</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                    3
                  </div>
                  <p>
                    View the blockchain-verified details including issuer,
                    timestamp, and authenticity status
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-muted">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-pending shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Example hash to try:</p>
                    <code className="text-xs font-mono text-muted-foreground break-all">
                      0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
