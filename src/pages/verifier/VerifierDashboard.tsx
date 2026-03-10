import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { verificationAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  QrCode,
  Hash,
  Camera,
  ExternalLink,
  Award,
  Calendar,
  User,
  Building,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function VerifierDashboard() {
  const [activeTab, setActiveTab] = useState("hash");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [hashInput, setHashInput] = useState("");
  const { toast } = useToast();

  // Handle hash verification
  const verifyByHash = async () => {
    if (!hashInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a credential hash",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      console.log("🔍 Verifying hash:", hashInput);
      const response = await verificationAPI.verifyByHash(hashInput);
      console.log("✅ Verification response:", response.data);

      setVerificationResult(response.data);

      toast({
        title: response.data.isValid ? "✅ Verified" : "❌ Invalid",
        description: response.data.message,
      });
    } catch (error: any) {
      console.error("Verification error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to verify hash",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Verify Credentials</h1>
          <p className="text-muted-foreground">
            Verify academic credentials on the blockchain
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Verification Methods */}
          <div>
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upload" className="gap-2" disabled>
                      <Upload className="h-4 w-4" />
                      Document
                    </TabsTrigger>
                    <TabsTrigger value="qr" className="gap-2" disabled>
                      <QrCode className="h-4 w-4" />
                      QR Code
                    </TabsTrigger>
                    <TabsTrigger value="hash" className="gap-2">
                      <Hash className="h-4 w-4" />
                      Hash
                    </TabsTrigger>
                  </TabsList>

                  {/* Hash Tab */}
                  <TabsContent value="hash" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Transaction Hash / Credential ID
                        </label>
                        <Input
                          placeholder="0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f"
                          value={hashInput}
                          onChange={(e) => setHashInput(e.target.value)}
                          className="font-mono"
                          disabled={isVerifying}
                        />
                      </div>
                      <Button
                        onClick={verifyByHash}
                        disabled={!hashInput.trim() || isVerifying}
                        className="w-full gap-2"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Hash className="h-4 w-4" />
                            Verify Hash
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Verification Result */}
          <div>
            {verificationResult ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    {verificationResult.isValid ? (
                      <>
                        <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-success" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-success">
                            Verified
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            This credential is authentic
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                          <AlertCircle className="h-6 w-6 text-destructive" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-destructive">
                            Not Verified
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {verificationResult.message}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {verificationResult.isValid &&
                    verificationResult.credential && (
                      <div className="space-y-4">
                        {/* Credential Details */}
                        <div className="p-4 rounded-lg bg-muted">
                          <div className="flex items-center gap-2 mb-3">
                            <Award className="h-5 w-5 text-primary" />
                            <h4 className="font-semibold">
                              Credential Details
                            </h4>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium">
                                {verificationResult.credential.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Title
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-sm">
                                  {verificationResult.credential.studentName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Student
                                </p>
                              </div>
                              <div>
                                <p className="text-sm">
                                  {
                                    verificationResult.credential
                                      .institutionName
                                  }
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Institution
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-sm capitalize">
                                  {verificationResult.credential.credentialType}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Type
                                </p>
                              </div>
                              <div>
                                <p className="text-sm">
                                  {new Date(
                                    verificationResult.credential.issueDate,
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Issue Date
                                </p>
                              </div>
                            </div>

                            {verificationResult.credential.metadata?.grade && (
                              <div>
                                <p className="text-sm">
                                  Grade:{" "}
                                  {verificationResult.credential.metadata.grade}
                                </p>
                              </div>
                            )}

                            {verificationResult.credential.description && (
                              <div className="pt-2 border-t">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Description
                                </p>
                                <p className="text-sm">
                                  {verificationResult.credential.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Blockchain Proof */}
                        <div className="p-4 rounded-lg border border-border/50">
                          <p className="text-sm font-medium mb-2">
                            Blockchain Proof
                          </p>
                          <div className="font-mono text-xs break-all bg-muted p-2 rounded">
                            {verificationResult.verification
                              ?.blockchainTxHash || hashInput}
                          </div>
                          {verificationResult.verification?.blockNumber && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Block:{" "}
                              {verificationResult.verification.blockNumber} |
                              Confirmations:{" "}
                              {verificationResult.verification.confirmations}
                            </p>
                          )}
                          <a
                            href={`https://sepolia.etherscan.io/tx/${verificationResult.verification?.blockchainTxHash || hashInput}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline mt-2 inline-flex items-center gap-1"
                          >
                            View on Etherscan
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setVerificationResult(null)}
                  >
                    Verify Another
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter verification details to see results</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
