// frontend/src/pages/verifier/VerifierVerify.tsx

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { verificationAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  QrCode,
  Hash,
  ExternalLink,
  Award,
  Calendar,
  User,
  Building,
  Shield,
  Copy,
  Camera,
  FileText,
  X,
} from "lucide-react";
import { QRCodeReader } from "@/components/QRCodeReader";

export function VerifierVerify() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("hash");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [hashInput, setHashInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // QR Scanner state
  const [qrScanner, setQrScanner] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrCodeReaderRef = useRef<Html5Qrcode | null>(null);

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
    setError(null);

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
      setError(error.response?.data?.message || "Failed to verify hash");
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to verify hash",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // QR Code Scanner
  const startQRScanner = () => {
    setShowScanner(true);

    setTimeout(() => {
      if (scannerRef.current) {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true,
          },
          false,
        );

        scanner.render(
          async (decodedText) => {
            console.log("QR Code scanned:", decodedText);
            scanner.clear();
            setShowScanner(false);

            try {
              const url = new URL(decodedText);
              const shareId = url.searchParams.get("shareId");
              if (shareId) {
                setIsVerifying(true);
                const response = await verificationAPI.verifyByShareId(shareId);
                setVerificationResult(response.data);
                toast({
                  title: response.data.isValid ? "✅ Verified" : "❌ Invalid",
                  description: response.data.message,
                });
                setIsVerifying(false);
              } else {
                setHashInput(decodedText);
                await verifyByHash();
              }
            } catch {
              setHashInput(decodedText);
              await verifyByHash();
            }
          },
          (error) => {
            console.error("QR Scan error:", error);
          },
        );

        setQrScanner(scanner);
      }
    }, 100);
  };

  const stopQRScanner = () => {
    if (qrScanner) {
      qrScanner.clear();
      setQrScanner(null);
    }
    setShowScanner(false);
  };

  const verifyDocument = async () => {
    if (!selectedFile) return;

    setIsVerifying(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("document", selectedFile);

      const response = await verificationAPI.verifyDocument(formData);
      console.log("📄 Document verification response:", response.data);

      setVerificationResult(response.data);

      toast({
        title: response.data.isValid ? "✅ Verified" : "❌ Invalid",
        description: response.data.message,
      });
    } catch (error: any) {
      console.error("Document verification error:", error);
      setError(error.response?.data?.message || "Failed to verify document");
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to verify document",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  return (
    <div className="p-8">
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
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upload" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Document
                  </TabsTrigger>
                  <TabsTrigger value="qr" className="gap-2">
                    <QrCode className="h-4 w-4" />
                    QR Code
                  </TabsTrigger>
                  <TabsTrigger value="hash" className="gap-2">
                    <Hash className="h-4 w-4" />
                    Hash
                  </TabsTrigger>
                </TabsList>

                {/* Document Upload Tab */}
                <TabsContent value="upload" className="mt-6">
                  <div className="space-y-4">
                    {!selectedFile ? (
                      <div
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedFile(file);
                              // Create preview for images
                              if (file.type.startsWith("image/")) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  setFilePreview(e.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }
                          }}
                          accept=".pdf,.png,.jpg,.jpeg,.json"
                          className="hidden"
                        />
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground">
                          PDF, PNG, JPG, or JSON (max 10MB)
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-muted/30">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-primary" />
                              <div>
                                <p className="font-medium">
                                  {selectedFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={clearFile}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {filePreview && (
                            <div className="mt-4 flex justify-center">
                              <img
                                src={filePreview}
                                alt="Preview"
                                className="max-h-48 rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={verifyDocument}
                          disabled={isVerifying}
                          className="w-full gap-2"
                        >
                          {isVerifying ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              Verify Document
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* QR Code Tab */}
                <TabsContent value="qr" className="mt-6">
                  <QRCodeReader
                    onScanSuccess={async (decodedText) => {
                      console.log(
                        "✅ QR Code scanned successfully:",
                        decodedText,
                      );

                      // Show loading state
                      setIsVerifying(true);

                      try {
                        // Try to parse as URL first
                        try {
                          const url = new URL(decodedText);
                          const shareId = url.searchParams.get("shareId");

                          if (shareId) {
                            // Verify by shareId
                            const response =
                              await verificationAPI.verifyByShareId(shareId);
                            setVerificationResult(response.data);
                            toast({
                              title: response.data.isValid
                                ? "✅ Verified"
                                : "❌ Invalid",
                              description: response.data.message,
                            });
                          } else {
                            // Treat as direct hash
                            setHashInput(decodedText);
                            const response =
                              await verificationAPI.verifyByHash(decodedText);
                            setVerificationResult(response.data);
                            toast({
                              title: response.data.isValid
                                ? "✅ Verified"
                                : "❌ Invalid",
                              description: response.data.message,
                            });
                          }
                        } catch {
                          // Not a valid URL, treat as direct hash
                          setHashInput(decodedText);
                          const response =
                            await verificationAPI.verifyByHash(decodedText);
                          setVerificationResult(response.data);
                          toast({
                            title: response.data.isValid
                              ? "✅ Verified"
                              : "❌ Invalid",
                            description: response.data.message,
                          });
                        }
                      } catch (error: any) {
                        console.error("Verification error:", error);
                        setError(
                          error.response?.data?.message ||
                            "Failed to verify credential",
                        );
                        toast({
                          title: "Error",
                          description:
                            error.response?.data?.message ||
                            "Failed to verify credential",
                          variant: "destructive",
                        });
                      } finally {
                        setIsVerifying(false);
                      }
                    }}
                    onScanError={(error) => {
                      console.error("❌ QR scan error:", error);
                    }}
                  />
                </TabsContent>

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
          {isVerifying ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Verifying credential...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-destructive">
                      Verification Failed
                    </h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setError(null);
                    setVerificationResult(null);
                  }}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : verificationResult ? (
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
                          {verificationResult.message ||
                            "Credential could not be verified"}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {verificationResult.isValid &&
                  verificationResult.credential && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="flex items-center gap-2 mb-3">
                          <Award className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold">Credential Details</h4>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium">
                              {verificationResult.credential.title ||
                                "Untitled"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Title
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-sm">
                                {verificationResult.credential.studentName ||
                                  "Unknown"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Student
                              </p>
                            </div>
                            <div>
                              <p className="text-sm">
                                {verificationResult.credential
                                  .institutionName || "Unknown"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Institution
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-sm capitalize">
                                {verificationResult.credential.credentialType ||
                                  "Unknown"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Type
                              </p>
                            </div>
                            <div>
                              <p className="text-sm">
                                {verificationResult.credential.issueDate
                                  ? new Date(
                                      verificationResult.credential.issueDate,
                                    ).toLocaleDateString()
                                  : "Unknown"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Issue Date
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-border/50">
                        <p className="text-sm font-medium mb-2">
                          Blockchain Proof
                        </p>
                        <div className="font-mono text-xs break-all bg-muted p-2 rounded">
                          {verificationResult.verification?.blockchainTxHash ||
                            hashInput}
                        </div>
                        {verificationResult.verification?.blockNumber && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Block: {verificationResult.verification.blockNumber}{" "}
                            | Confirmations:{" "}
                            {verificationResult.verification.confirmations}
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() =>
                              copyToClipboard(
                                verificationResult.verification
                                  ?.blockchainTxHash || hashInput,
                              )
                            }
                          >
                            <Copy className="h-3 w-3" />
                            Copy Hash
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() =>
                              window.open(
                                `https://sepolia.etherscan.io/tx/${verificationResult.verification?.blockchainTxHash || hashInput}`,
                                "_blank",
                              )
                            }
                          >
                            <ExternalLink className="h-3 w-3" />
                            View on Etherscan
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => {
                    setVerificationResult(null);
                    setError(null);
                  }}
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
    </div>
  );
}
