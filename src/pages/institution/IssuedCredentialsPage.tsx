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

interface Credential {
  id: string;
  credentialId: string;
  title: string;
  type: "degree" | "certificate" | "transcript" | "diploma";
  studentName: string;
  studentWallet: string;
  issueDate: string;
  txHash: string;
  status: "verified" | "pending" | "failed";
  institution: string;
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

  // Load mock data
  useEffect(() => {
    loadCredentials();
  }, []);

  useEffect(() => {
    filterCredentials();
  }, [credentials, searchQuery, statusFilter, typeFilter]);

  const loadCredentials = () => {
    const mockCredentials: Credential[] = [
      {
        id: "1",
        credentialId: "CRED-2024-001",
        title: "Bachelor of Computer Science",
        type: "degree",
        studentName: "John Doe",
        studentWallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45",
        issueDate: "2024-01-15",
        txHash:
          "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
        status: "verified",
        institution: "MIT",
      },
      {
        id: "2",
        credentialId: "CRED-2024-002",
        title: "Master of Data Science",
        type: "degree",
        studentName: "Jane Smith",
        studentWallet: "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f",
        issueDate: "2024-01-20",
        txHash:
          "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        status: "verified",
        institution: "MIT",
      },
      {
        id: "3",
        credentialId: "CRED-2024-003",
        title: "Blockchain Developer Certificate",
        type: "certificate",
        studentName: "Bob Johnson",
        studentWallet: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
        issueDate: "2024-02-01",
        txHash:
          "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
        status: "pending",
        institution: "MIT",
      },
      {
        id: "4",
        credentialId: "CRED-2024-004",
        title: "Academic Transcript",
        type: "transcript",
        studentName: "Alice Williams",
        studentWallet: "0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d",
        issueDate: "2024-01-10",
        txHash:
          "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
        status: "verified",
        institution: "MIT",
      },
      {
        id: "5",
        credentialId: "CRED-2024-005",
        title: "PhD in Physics",
        type: "degree",
        studentName: "Charlie Brown",
        studentWallet: "0x5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e",
        issueDate: "2023-12-05",
        txHash:
          "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
        status: "failed",
        institution: "MIT",
      },
    ];
    setCredentials(mockCredentials);
  };

  const filterCredentials = () => {
    let filtered = [...credentials];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cred) =>
          cred.title.toLowerCase().includes(query) ||
          cred.studentName.toLowerCase().includes(query) ||
          cred.credentialId.toLowerCase().includes(query) ||
          cred.txHash.toLowerCase().includes(query),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((cred) => cred.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((cred) => cred.type === typeFilter);
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

  const getStatusBadge = (status: Credential["status"]) => {
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
    return config[status];
  };

  const getTypeIcon = (type: Credential["type"]) => {
    const icons = {
      degree: GraduationCap,
      certificate: Award,
      transcript: FileText,
      diploma: Award,
    };
    return icons[type];
  };

  const downloadCredential = (credential: Credential) => {
    const data = {
      credential: {
        id: credential.credentialId,
        title: credential.title,
        type: credential.type,
        studentName: credential.studentName,
        institution: credential.institution,
        issueDate: credential.issueDate,
        txHash: credential.txHash,
      },
      verification: {
        status: credential.status,
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

  const stats = {
    total: credentials.length,
    verified: credentials.filter((c) => c.status === "verified").length,
    pending: credentials.filter((c) => c.status === "pending").length,
    failed: credentials.filter((c) => c.status === "failed").length,
  };

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
        <Link to="/institution/upload">
          <Button className="gap-2">
            <Award className="h-4 w-4" />
            Issue New
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Issued</p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
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
                  {stats.verified}
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
                  {stats.pending}
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
                  {stats.failed}
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

              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
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
                  const StatusBadge = getStatusBadge(credential.status);
                  const StatusIcon = StatusBadge.icon;
                  const TypeIcon = getTypeIcon(credential.type);
                  return (
                    <TableRow
                      key={credential.id}
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
                            {credential.txHash.slice(0, 10)}...
                            {credential.txHash.slice(-8)}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              copyToClipboard(
                                credential.txHash,
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
                                `https://sepolia.etherscan.io/tx/${credential.txHash}`,
                                "_blank",
                              )
                            }
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
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
