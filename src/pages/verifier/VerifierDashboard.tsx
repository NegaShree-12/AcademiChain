// frontend/src/pages/verifier/VerifierDashboard.tsx
import React, { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Upload,
  QrCode,
  FileText,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Download,
  Copy,
  ExternalLink,
  BarChart3,
  Users,
  Building,
  Camera,
  Hash,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface VerificationResult {
  id: string;
  isValid: boolean;
  credential: {
    title: string;
    institution: string;
    studentName: string;
    issueDate: string;
    description: string;
  };
  verifiedAt: string;
  method: "upload" | "qr" | "hash";
  blockchainInfo: {
    txHash: string;
    blockNumber: number;
    confirmations: number;
  };
}

export function VerifierDashboard() {
  const [activeTab, setActiveTab] = useState("upload");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<
    VerificationResult[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [qrData, setQrData] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [hashInput, setHashInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Stats
  const stats = {
    totalVerifications: 1245,
    verifiedToday: 23,
    successRate: 99.8,
    pendingReviews: 5,
  };

  // Handle file upload verification
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsVerifying(true);
    setUploadedFile(file);

    try {
      // Simulate file processing and verification
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResult: VerificationResult = {
        id: `verify_${Date.now()}`,
        isValid: Math.random() > 0.1, // 90% valid
        credential: {
          title: "Bachelor of Computer Science",
          institution: "Massachusetts Institute of Technology",
          studentName: "John Doe",
          issueDate: "2023-06-15",
          description: "Awarded with Honors",
        },
        verifiedAt: new Date().toISOString(),
        method: "upload",
        blockchainInfo: {
          txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
          blockNumber: Math.floor(Math.random() * 20000000),
          confirmations: Math.floor(Math.random() * 100000) + 1000,
        },
      };

      setVerificationResults((prev) => [mockResult, ...prev]);

      toast({
        title: mockResult.isValid
          ? "Verification Successful"
          : "Verification Failed",
        description: mockResult.isValid
          ? "Document verified on blockchain"
          : "Document could not be verified",
        variant: mockResult.isValid ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify document",
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
      console.error("Camera error:", error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to scan QR codes",
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

  const captureQR = () => {
    // Simulate QR capture
    setIsVerifying(true);

    setTimeout(() => {
      const mockResult: VerificationResult = {
        id: `verify_${Date.now()}`,
        isValid: true,
        credential: {
          title: "Master of Data Science",
          institution: "Stanford University",
          studentName: "Jane Smith",
          issueDate: "2024-05-20",
          description: "Specialization in Machine Learning",
        },
        verifiedAt: new Date().toISOString(),
        method: "qr",
        blockchainInfo: {
          txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
          blockNumber: Math.floor(Math.random() * 20000000),
          confirmations: Math.floor(Math.random() * 100000) + 1000,
        },
      };

      setVerificationResults((prev) => [mockResult, ...prev]);
      setQrData(
        `https://verify.academichain.com/${mockResult.blockchainInfo.txHash}`,
      );
      setIsVerifying(false);
      stopCamera();

      toast({
        title: "QR Code Scanned",
        description: "Credential verified successfully",
      });
    }, 1500);
  };

  // Handle hash verification
  const verifyByHash = async () => {
    if (!hashInput.trim()) {
      toast({
        title: "No input",
        description: "Please enter a credential hash",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockResult: VerificationResult = {
        id: `verify_${Date.now()}`,
        isValid: true,
        credential: {
          title: "AWS Solutions Architect",
          institution: "Amazon Web Services",
          studentName: "Bob Johnson",
          issueDate: "2024-01-10",
          description: "Professional Certification",
        },
        verifiedAt: new Date().toISOString(),
        method: "hash",
        blockchainInfo: {
          txHash: hashInput.startsWith("0x") ? hashInput : `0x${hashInput}`,
          blockNumber: Math.floor(Math.random() * 20000000),
          confirmations: Math.floor(Math.random() * 100000) + 1000,
        },
      };

      setVerificationResults((prev) => [mockResult, ...prev]);
      setHashInput("");

      toast({
        title: "Verification Complete",
        description: "Credential verified on blockchain",
      });
    } catch (error) {
      console.error("Hash verification error:", error);
      toast({
        title: "Verification Failed",
        description: "Invalid credential hash",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Generate verification report
  const generateReport = (result: VerificationResult) => {
    const report = `
      AcademiChain Verification Report
      ================================
      
      Verification ID: ${result.id}
      Verification Date: ${new Date(result.verifiedAt).toLocaleString()}
      Verification Method: ${result.method.toUpperCase()}
      Status: ${result.isValid ? "✅ VERIFIED" : "❌ INVALID"}
      
      Credential Details:
      ------------------
      Title: ${result.credential.title}
      Institution: ${result.credential.institution}
      Student: ${result.credential.studentName}
      Issue Date: ${new Date(result.credential.issueDate).toLocaleDateString()}
      Description: ${result.credential.description}
      
      Blockchain Information:
      ----------------------
      Transaction: ${result.blockchainInfo.txHash}
      Block Number: ${result.blockchainInfo.blockNumber}
      Confirmations: ${result.blockchainInfo.confirmations.toLocaleString()}
      
      Generated by: ${localStorage.getItem("company_name") || "Your Organization"}
      Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `verification-${result.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: "Verification report downloaded",
    });
  };

  const filteredResults = verificationResults.filter(
    (result) =>
      result.credential.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      result.credential.institution
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      result.credential.studentName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Verification Portal</h1>
                <p className="text-muted-foreground">
                  Verify academic credentials for hiring and admissions
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="font-semibold">Tech Corp Inc.</p>
            </div>
            <Badge
              variant="outline"
              className="bg-success/10 text-success border-success/20"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Verified Organization
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  +12%
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">
                  {stats.totalVerifications.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total Verifications
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  Today
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{stats.verifiedToday}</p>
                <p className="text-sm text-muted-foreground">Verified Today</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-pending/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-pending" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  Accuracy
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{stats.successRate}%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  Review
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{stats.pendingReviews}</p>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Interface */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Verification Methods */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upload" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Document
                    </TabsTrigger>
                    <TabsTrigger value="qr" className="gap-2">
                      <QrCode className="h-4 w-4" />
                      Scan QR Code
                    </TabsTrigger>
                    <TabsTrigger value="hash" className="gap-2">
                      <Hash className="h-4 w-4" />
                      Enter Hash
                    </TabsTrigger>
                  </TabsList>

                  {/* Upload Tab */}
                  <TabsContent value="upload" className="space-y-6 mt-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        Upload Document
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Upload a credential PDF, image, or document for instant
                        verification
                      </p>

                      <div className="border-2 border-dashed border-border rounded-2xl p-8">
                        <input
                          type="file"
                          id="document-upload"
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
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
                              <div className="flex items-center justify-center gap-2">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                <span>Verifying document...</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Checking blockchain records...
                              </p>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                              <p className="text-muted-foreground mb-2">
                                Drag & drop or click to upload
                              </p>
                              <p className="text-sm text-muted-foreground mb-4">
                                Supported: PDF, PNG, JPG, DOC up to 10MB
                              </p>
                              <Button variant="outline">Choose File</Button>
                            </>
                          )}
                        </label>
                      </div>

                      {uploadedFile && (
                        <div className="mt-4 p-4 rounded-lg bg-muted border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">
                                  {uploadedFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(uploadedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline">Uploaded</Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* QR Tab */}
                  <TabsContent value="qr" className="space-y-6 mt-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
                        <QrCode className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        Scan QR Code
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Scan a credential QR code using your camera
                      </p>

                      {!cameraActive ? (
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-border rounded-2xl p-12 flex items-center justify-center">
                            <Camera className="h-16 w-16 text-muted-foreground" />
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
                              className="w-full rounded-2xl border-2 border-primary"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-48 w-48 border-4 border-primary/50 rounded-lg" />
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              onClick={captureQR}
                              className="flex-1 gap-2"
                              disabled={isVerifying}
                            >
                              {isVerifying ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Scanning...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4" />
                                  Capture QR Code
                                </>
                              )}
                            </Button>
                            <Button variant="outline" onClick={stopCamera}>
                              Stop Camera
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Hash Tab */}
                  <TabsContent value="hash" className="space-y-6 mt-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
                        <Hash className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Enter Hash</h3>
                      <p className="text-muted-foreground mb-6">
                        Enter a credential transaction hash or verification ID
                      </p>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="credential-hash">
                            Credential Hash
                          </Label>
                          <Input
                            id="credential-hash"
                            placeholder="0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f"
                            value={hashInput}
                            onChange={(e) => setHashInput(e.target.value)}
                            disabled={isVerifying}
                            className="font-mono"
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={verifyByHash}
                            disabled={!hashInput.trim() || isVerifying}
                            className="flex-1 gap-2"
                          >
                            {isVerifying ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <Shield className="h-4 w-4" />
                                Verify Hash
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setHashInput(
                                "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
                              );
                              toast({
                                title: "Example loaded",
                                description: "Click Verify to test",
                              });
                            }}
                          >
                            Load Example
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Recent Verifications Sidebar */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Recent Verifications</h3>
                  <Badge variant="secondary" className="text-xs">
                    {verificationResults.length} total
                  </Badge>
                </div>

                <div className="space-y-4">
                  {verificationResults.slice(0, 5).map((result) => (
                    <div
                      key={result.id}
                      className="p-4 rounded-lg border border-border/50 group hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.isValid ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                          <span className="font-medium text-sm">
                            {result.credential.title}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            result.isValid
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-destructive/10 text-destructive border-destructive/20",
                          )}
                        >
                          {result.isValid ? "Valid" : "Invalid"}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground mb-2">
                        {result.credential.institution}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {new Date(result.verifiedAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => generateReport(result)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              window.open(
                                `https://sepolia.etherscan.io/tx/${result.blockchainInfo.txHash}`,
                                "_blank",
                              );
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {verificationResults.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No verifications yet</p>
                      <p className="text-sm mt-1">
                        Use the verification tools to get started
                      </p>
                    </div>
                  )}
                </div>

                {verificationResults.length > 0 && (
                  <Button variant="ghost" className="w-full mt-4 text-sm">
                    View All Verifications
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Verification Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Success Rate
                    </span>
                    <span className="font-semibold">99.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Avg. Time
                    </span>
                    <span className="font-semibold">1.2s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Blockchain Cost
                    </span>
                    <span className="font-semibold">~$0.05</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      API Calls
                    </span>
                    <span className="font-semibold">1,245</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Verification History */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Verification History</h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search verifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="valid">Valid</SelectItem>
                    <SelectItem value="invalid">Invalid</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            {filteredResults.length > 0 ? (
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 font-medium">Credential</th>
                      <th className="text-left p-4 font-medium">Student</th>
                      <th className="text-left p-4 font-medium">Method</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((result) => (
                      <tr
                        key={result.id}
                        className="border-b border-border/50 last:border-0 hover:bg-muted/50"
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium">
                              {result.credential.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {result.credential.institution}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-medium">
                            {result.credential.studentName}
                          </p>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="capitalize">
                            {result.method}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {result.isValid ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            )}
                            <span
                              className={cn(
                                "font-medium",
                                result.isValid
                                  ? "text-success"
                                  : "text-destructive",
                              )}
                            >
                              {result.isValid ? "Verified" : "Invalid"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">
                            {new Date(result.verifiedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(result.verifiedAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => generateReport(result)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  result.blockchainInfo.txHash,
                                );
                                toast({
                                  title: "Copied!",
                                  description:
                                    "Transaction hash copied to clipboard",
                                });
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                window.open(
                                  `https://sepolia.etherscan.io/tx/${result.blockchainInfo.txHash}`,
                                  "_blank",
                                );
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">
                  No verification history
                </h4>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "No results match your search"
                    : "Start verifying credentials to see them here"}
                </p>
                <Button onClick={() => setActiveTab("upload")}>
                  Verify Your First Credential
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
