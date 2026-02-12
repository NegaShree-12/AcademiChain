import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Download,
  Copy,
  ExternalLink,
  Search,
  Filter,
  Building,
  User,
  Calendar,
  Shield,
  FileText,
  Award,
  ChevronRight,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockCredentials } from "@/data/mockData";
import { format, formatDistance } from "date-fns";

// Mock verification history data
const mockVerifications = [
  {
    id: "ver_1",
    credentialId: "1",
    credentialTitle: "Bachelor of Computer Science",
    institution: "Massachusetts Institute of Technology",
    verifierName: "Google Inc.",
    verifierEmail: "hr@google.com",
    verifierWallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45",
    verifiedAt: "2024-01-16T14:30:00Z",
    ipAddress: "172.217.160.142",
    location: "Mountain View, CA",
    userAgent: "Chrome 120.0 / macOS",
    method: "link",
    status: "success",
    txHash: "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
  },
  {
    id: "ver_2",
    credentialId: "1",
    credentialTitle: "Bachelor of Computer Science",
    institution: "Massachusetts Institute of Technology",
    verifierName: "Microsoft",
    verifierEmail: "verify@microsoft.com",
    verifierWallet: "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
    verifiedAt: "2024-01-15T09:45:00Z",
    ipAddress: "13.107.42.16",
    location: "Redmond, WA",
    userAgent: "Edge 120.0 / Windows",
    method: "qr",
    status: "success",
    txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
  },
  {
    id: "ver_3",
    credentialId: "2",
    credentialTitle: "Master of Data Science",
    institution: "Stanford University",
    verifierName: "Amazon",
    verifierEmail: "recruiting@amazon.com",
    verifierWallet: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
    verifiedAt: "2024-01-14T11:20:00Z",
    ipAddress: "52.94.236.166",
    location: "Seattle, WA",
    userAgent: "Firefox 122.0 / Windows",
    method: "hash",
    status: "success",
    txHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
  },
  {
    id: "ver_4",
    credentialId: "3",
    credentialTitle: "AWS Solutions Architect",
    institution: "Amazon Web Services",
    verifierName: "Accenture",
    verifierEmail: "background@accenture.com",
    verifierWallet: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
    verifiedAt: "2024-01-12T15:10:00Z",
    ipAddress: "34.120.45.67",
    location: "London, UK",
    userAgent: "Safari 17.0 / macOS",
    method: "link",
    status: "success",
    txHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
  },
  {
    id: "ver_5",
    credentialId: "1",
    credentialTitle: "Bachelor of Computer Science",
    institution: "Massachusetts Institute of Technology",
    verifierName: "Unknown",
    verifierEmail: null,
    verifierWallet: null,
    verifiedAt: "2024-01-10T08:30:00Z",
    ipAddress: "203.0.113.45",
    location: "Singapore",
    userAgent: "Mobile Safari / iOS",
    method: "qr",
    status: "pending",
    txHash: null,
  },
  {
    id: "ver_6",
    credentialId: "4",
    credentialTitle: "Official Academic Transcript",
    institution: "Massachusetts Institute of Technology",
    verifierName: "Goldman Sachs",
    verifierEmail: "compliance@gs.com",
    verifierWallet: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
    verifiedAt: "2024-01-08T13:45:00Z",
    ipAddress: "198.51.100.67",
    location: "New York, NY",
    userAgent: "Chrome 119.0 / Windows",
    method: "hash",
    status: "failed",
    txHash: null,
  },
];

export function VerificationHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [verifications, setVerifications] = useState(mockVerifications);
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter verifications
  const filteredVerifications = verifications.filter((ver) => {
    const matchesSearch =
      ver.credentialTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ver.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ver.verifierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ver.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ver.status === statusFilter;
    const matchesMethod = methodFilter === "all" || ver.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Statistics
  const totalVerifications = verifications.length;
  const successCount = verifications.filter((v) => v.status === "success").length;
  const pendingCount = verifications.filter((v) => v.status === "pending").length;
  const failedCount = verifications.filter((v) => v.status === "failed").length;
  
  const uniqueVerifiers = new Set(verifications.map((v) => v.verifierName)).size;
  const mostVerifiedCredential = Object.entries(
    verifications.reduce((acc: any, v) => {
      acc[v.credentialTitle] = (acc[v.credentialTitle] || 0) + 1;
      return acc;
    }, {})
  ).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "None";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return {
          label: "Verified",
          className: "bg-success/10 text-success border-success/20",
          icon: CheckCircle2,
        };
      case "pending":
        return {
          label: "Pending",
          className: "bg-pending/10 text-pending border-pending/20",
          icon: Clock,
        };
      case "failed":
        return {
          label: "Failed",
          className: "bg-destructive/10 text-destructive border-destructive/20",
          icon: AlertCircle,
        };
      default:
        return {
          label: status,
          className: "bg-muted text-muted-foreground",
          icon: AlertCircle,
        };
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "link":
        return { label: "Share Link", className: "bg-blue-500/10 text-blue-600" };
      case "qr":
        return { label: "QR Code", className: "bg-purple-500/10 text-purple-600" };
      case "hash":
        return { label: "Transaction Hash", className: "bg-amber-500/10 text-amber-600" };
      default:
        return { label: method, className: "bg-muted text-muted-foreground" };
    }
  };

  const exportReport = (verification: any) => {
    const report = `
ACADEMICHAIN VERIFICATION CERTIFICATE
=====================================
Certificate ID: ${verification.id}
Generated: ${new Date().toLocaleString()}

CREDENTIAL DETAILS
------------------
Credential: ${verification.credentialTitle}
Institution: ${verification.institution}
Issue Date: ${mockCredentials.find(c => c.id === verification.credentialId)?.issueDate || "N/A"}

VERIFICATION DETAILS
--------------------
Verifier: ${verification.verifierName}
Verifier Email: ${verification.verifierEmail || "N/A"}
Verification Date: ${new Date(verification.verifiedAt).toLocaleString()}
Verification Method: ${verification.method.toUpperCase()}
Location: ${verification.location}
IP Address: ${verification.ipAddress}
Status: ${verification.status.toUpperCase()}

BLOCKCHAIN PROOF
----------------
Transaction Hash: ${verification.txHash || "N/A"}
Network: Ethereum Sepolia

This certificate confirms that the above credential was verified on the AcademiChain platform.
    `;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `verification-${verification.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: "Verification certificate downloaded",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Verification History</h1>
            <p className="text-muted-foreground">
              Track who has verified your credentials and when
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export All Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{totalVerifications}</p>
                <p className="text-sm text-muted-foreground">Total Verifications</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{successCount}</p>
                <p className="text-sm text-muted-foreground">Successful</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-pending/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-pending" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{failedCount}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Building className="h-5 w-5 text-purple-500" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{uniqueVerifiers}</p>
                <p className="text-sm text-muted-foreground">Unique Verifiers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by credential, verifier, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="link">Share Link</SelectItem>
                <SelectItem value="qr">QR Code</SelectItem>
                <SelectItem value="hash">Transaction Hash</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Verification Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Credential</TableHead>
                  <TableHead>Verifier</TableHead>
                  <TableHead>Date & Location</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVerifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-1">No verifications found</p>
                      <p className="text-sm">
                        {searchQuery
                          ? "Try adjusting your search filters"
                          : "Share your credentials to see verification activity"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVerifications.map((ver) => {
                    const status = getStatusBadge(ver.status);
                    const StatusIcon = status.icon;
                    const method = getMethodBadge(ver.method);
                    
                    return (
                      <TableRow
                        key={ver.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          setSelectedVerification(ver);
                          setDetailDialogOpen(true);
                        }}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{ver.credentialTitle}</p>
                            <p className="text-xs text-muted-foreground">{ver.institution}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{ver.verifierName}</p>
                              {ver.verifierEmail && (
                                <p className="text-xs text-muted-foreground">{ver.verifierEmail}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(ver.verifiedAt), "MMM d, yyyy")}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistance(new Date(ver.verifiedAt), new Date(), { addSuffix: true })}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {ver.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={method.className}>
                            {method.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status.className}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                exportReport(ver);
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVerification(ver);
                                setDetailDialogOpen(true);
                              }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Verification Details Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Details
              </DialogTitle>
              <DialogDescription>
                Complete information about this verification event
              </DialogDescription>
            </DialogHeader>
            
            {selectedVerification && (
              <div className="space-y-6">
                {/* Status Banner */}
                <div className={`p-4 rounded-lg ${
                  selectedVerification.status === "success"
                    ? "bg-success/10 border-success/20"
                    : selectedVerification.status === "pending"
                    ? "bg-pending/10 border-pending/20"
                    : "bg-destructive/10 border-destructive/20"
                } border`}>
                  <div className="flex items-center gap-3">
                    {selectedVerification.status === "success" && (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    )}
                    {selectedVerification.status === "pending" && (
                      <Clock className="h-5 w-5 text-pending" />
                    )}
                    {selectedVerification.status === "failed" && (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                    <div>
                      <p className="font-semibold capitalize">{selectedVerification.status} Verification</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedVerification.verifiedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Credential Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Credential
                    </h3>
                    <div className="p-4 rounded-lg bg-muted border">
                      <p className="font-medium">{selectedVerification.credentialTitle}</p>
                      <p className="text-sm text-muted-foreground">{selectedVerification.institution}</p>
                      {mockCredentials.find(c => c.id === selectedVerification.credentialId) && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Issued: {format(
                            new Date(mockCredentials.find(c => c.id === selectedVerification.credentialId)!.issueDate),
                            "MMMM d, yyyy"
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Verifier Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Verifier
                    </h3>
                    <div className="p-4 rounded-lg bg-muted border">
                      <p className="font-medium">{selectedVerification.verifierName}</p>
                      {selectedVerification.verifierEmail ? (
                        <p className="text-sm text-muted-foreground">{selectedVerification.verifierEmail}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Anonymous</p>
                      )}
                      {selectedVerification.verifierWallet && (
                        <div className="flex items-center gap-2 mt-2">
                          <code className="text-xs font-mono text-muted-foreground">
                            {selectedVerification.verifierWallet.slice(0, 10)}...
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedVerification.verifierWallet);
                              toast({ title: "Address copied!" });
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Verification Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Method</span>
                        <span className="text-sm font-medium capitalize">{selectedVerification.method}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">IP Address</span>
                        <span className="text-sm font-mono">{selectedVerification.ipAddress}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Location</span>
                        <span className="text-sm">{selectedVerification.location}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Device</span>
                        <span className="text-sm">{selectedVerification.userAgent}</span>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Proof */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Blockchain Proof
                    </h3>
                    {selectedVerification.txHash ? (
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono break-all flex-1">
                            {selectedVerification.txHash}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedVerification.txHash);
                              toast({ title: "Hash copied!" });
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="link"
                          className="mt-2 h-auto p-0 text-xs"
                          onClick={() => window.open(
                            `https://sepolia.etherscan.io/tx/${selectedVerification.txHash}`,
                            "_blank"
                          )}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View on Etherscan
                        </Button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg bg-muted border">
                        <p className="text-sm text-muted-foreground italic">
                          No blockchain transaction recorded
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => exportReport(selectedVerification)}
                  >
                    <Download className="h-4 w-4" />
                    Download Certificate
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => setDetailDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}