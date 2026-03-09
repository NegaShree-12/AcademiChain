// frontend/src/pages/verifier/VerifierDashboard.tsx
import { useState, useRef } from "react";
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
  X,
  ExternalLink,
  Shield,
} from "lucide-react";

export function VerifierDashboard() {
  const [activeTab, setActiveTab] = useState("upload");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [hashInput, setHashInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Handle file upload verification
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsVerifying(true);
    setUploadedFile(file);
    setVerificationResult(null);

    try {
      const formData = new FormData();
      formData.append("document", file);

      // REAL API CALL - Not mock
      const response = await verificationAPI.verifyDocument(formData);
      setVerificationResult(response.data);

      toast({
        title: response.data.isValid ? "✅ Verified" : "❌ Verification Failed",
        description: response.data.message,
        variant: response.data.isValid ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify document",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

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
      // REAL API CALL
      const response = await verificationAPI.verifyByHash(hashInput);
      setVerificationResult(response.data);

      toast({
        title: response.data.isValid ? "✅ Verified" : "❌ Invalid",
        description: response.data.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify hash",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle QR code scanning
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureQR = async () => {
    // This would use a QR scanner library like jsQR
    // For now, prompt user to enter the data manually
    const qrData = prompt("Enter QR code data:");
    if (qrData) {
      setHashInput(qrData);
      verifyByHash();
    }
    stopCamera();
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

                  {/* Upload Tab */}
                  <TabsContent value="upload" className="mt-6">
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center">
                        <input
                          type="file"
                          id="document-upload"
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                          }}
                          disabled={isVerifying}
                        />
                        <label
                          htmlFor="document-upload"
                          className="cursor-pointer"
                        >
                          {isVerifying ? (
                            <div className="space-y-4">
                              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                              <p>Verifying document on blockchain...</p>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                              <p className="text-muted-foreground mb-2">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-sm text-muted-foreground">
                                PDF, PNG, JPG up to 10MB
                              </p>
                              <Button variant="outline" className="mt-4">
                                Choose File
                              </Button>
                            </>
                          )}
                        </label>
                      </div>

                      {uploadedFile && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* QR Tab */}
                  <TabsContent value="qr" className="mt-6">
                    <div className="space-y-4">
                      {!cameraActive ? (
                        <div className="text-center">
                          <div className="border-2 border-dashed border-border rounded-2xl p-12 mb-4">
                            <QrCode className="h-16 w-16 text-muted-foreground mx-auto" />
                          </div>
                          <Button onClick={startCamera} className="gap-2">
                            <Camera className="h-4 w-4" />
                            Start Camera
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              className="w-full rounded-lg border-2 border-primary"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-48 h-48 border-4 border-primary/50 rounded-lg" />
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button onClick={captureQR} className="flex-1">
                              Capture QR
                            </Button>
                            <Button variant="outline" onClick={stopCamera}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
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
                        <div className="p-4 rounded-lg bg-muted">
                          <h4 className="font-semibold mb-2">
                            {verificationResult.credential.title}
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="text-muted-foreground">
                                Student:
                              </span>{" "}
                              {verificationResult.credential.studentName}
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Institution:
                              </span>{" "}
                              {verificationResult.credential.institutionName}
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Issue Date:
                              </span>{" "}
                              {new Date(
                                verificationResult.credential.issueDate,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border border-border/50">
                          <p className="text-sm font-medium mb-2">
                            Blockchain Proof
                          </p>
                          <div className="font-mono text-xs break-all bg-muted p-2 rounded">
                            {verificationResult.verification?.blockchainTxHash}
                          </div>
                          <a
                            href={`https://sepolia.etherscan.io/tx/${verificationResult.verification?.blockchainTxHash}`}
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
