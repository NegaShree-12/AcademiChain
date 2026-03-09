// frontend/src/pages/institution/IssuedCredentialsPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Search,
  Award,
  GraduationCap,
  ExternalLink,
  Copy,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Filter,
  Calendar,
  User,
  Building,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { institutionAPI } from "@/lib/api";

interface Credential {
  _id: string;
  credentialId: string;
  title: string;
  credentialType: "degree" | "certificate" | "transcript" | "diploma";
  studentName: string;
  studentEmail: string;
  issueDate: string;
  blockchainTxHash: string;
  blockchainStatus: "verified" | "pending" | "failed";
  institutionName: string;
  description?: string;
  isRevoked?: boolean;
}

export function IssuedCredentialsPage() {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Load credentials from API
  useEffect(() => {
    fetchCredentials();
  }, []);

  useEffect(() => {
    filterCredentials();
  }, [credentials, searchQuery, statusFilter, typeFilter]);

  const fetchCredentials = async () => {
    try {
      setIsLoading(true);
      console.log("📋 Fetching credentials from API...");

      const response = await institutionAPI.getIssuedCredentials();
      console.log("📋 API Response:", response);

      let credentialsList = [];
      if (response.data?.data) {
        credentialsList = response.data.data;
      } else if (Array.isArray(response.data)) {
        credentialsList = response.data;
      } else {
        credentialsList = response.data || [];
      }

      console.log(`✅ Found ${credentialsList.length} credentials`);
      setCredentials(credentialsList);
    } catch (error) {
      console.error("❌ Failed to fetch credentials:", error);
      toast({
        title: "Error",
        description: "Failed to load credentials",
        variant: "destructive",
      });
      setCredentials([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCredentials = () => {
    let filtered = [...credentials];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cred) =>
          cred.title?.toLowerCase().includes(query) ||
          cred.studentName?.toLowerCase().includes(query) ||
          cred.credentialId?.toLowerCase().includes(query) ||
          cred.blockchainTxHash?.toLowerCase().includes(query),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (cred) => cred.blockchainStatus === statusFilter,
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((cred) => cred.credentialType === typeFilter);
    }

    setFilteredCredentials(filtered);
  };

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description,
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      verified: {
        icon: CheckCircle2,
        label: "Verified",
        className: "bg-success/10 text-success border-success/20",
      },
      pending: {
        icon: Clock,
        label: "Pending",
        className: "bg-pending/10 text-pending border-pending/20",
      },
      failed: {
        icon: AlertCircle,
        label: "Failed",
        className: "bg-destructive/10 text-destructive border-destructive/20",
      },
    };
    return config[status] || config.pending;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      degree: GraduationCap,
      certificate: Award,
      transcript: FileText,
      diploma: Award,
    };
    return icons[type] || FileText;
  };

  const downloadCredential = (credential: Credential) => {
    const data = {
      credential: {
        id: credential.credentialId,
        title: credential.title,
        type: credential.credentialType,
        studentName: credential.studentName,
        institution: credential.institutionName,
        issueDate: credential.issueDate,
        txHash: credential.blockchainTxHash,
      },
      verification: {
        status: credential.blockchainStatus,
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
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Credential data downloaded successfully",
    });
  };

  // Calculate stats
  const totalIssued = credentials.length;
  const verified = credentials.filter(
    (c) => c.blockchainStatus === "verified",
  ).length;
  const pending = credentials.filter(
    (c) => c.blockchainStatus === "pending",
  ).length;
  const failed = credentials.filter(
    (c) => c.blockchainStatus === "failed",
  ).length;

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Issued Credentials</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all blockchain-verified credentials
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={fetchCredentials}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Link to="/institution/upload">
            <Button className="gap-2">
              <Award className="h-4 w-4" />
              Issue New
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Issued</p>
                <p className="text-3xl font-bold mt-2">{totalIssued}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-3xl font-bold mt-2 text-success">
                  {verified}
                </p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold mt-2 text-pending">
                  {pending}
                </p>
              </div>
              <div className="p-3 bg-pending/10 rounded-lg">
                <Clock className="h-5 w-5 text-pending" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-3xl font-bold mt-2 text-destructive">
                  {failed}
                </p>
              </div>
              <div className="p-3 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, student, or transaction hash..."
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
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="degree">Degree</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="transcript">Transcript</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credentials Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Credential</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCredentials.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium mb-1">
                      No credentials found
                    </p>
                    <p className="text-sm">
                      {searchQuery
                        ? "Try a different search term"
                        : "Issue your first credential to get started"}
                    </p>
                    {!searchQuery && (
                      <Link to="/institution/upload">
                        <Button variant="link" className="mt-4">
                          Issue Credential
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCredentials.map((credential) => {
                  const StatusBadge = getStatusBadge(
                    credential.blockchainStatus,
                  );
                  const StatusIcon = StatusBadge.icon;
                  const TypeIcon = getTypeIcon(credential.credentialType);
                  return (
                    <TableRow
                      key={credential._id}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <TypeIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{credential.title}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {credential.credentialId}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span>{credential.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {format(
                              new Date(credential.issueDate),
                              "MMM d, yyyy",
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={StatusBadge.className}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {StatusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono">
                            {credential.blockchainTxHash?.slice(0, 10)}...
                            {credential.blockchainTxHash?.slice(-8)}
                          </code>
                          {credential.blockchainTxHash && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  copyToClipboard(
                                    credential.blockchainTxHash!,
                                    "Transaction hash copied",
                                  )
                                }
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  window.open(
                                    `https://sepolia.etherscan.io/tx/${credential.blockchainTxHash}`,
                                    "_blank",
                                  )
                                }
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => downloadCredential(credential)}
                          >
                            <Download className="h-4 w-4" />
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
    </div>
  );
}
