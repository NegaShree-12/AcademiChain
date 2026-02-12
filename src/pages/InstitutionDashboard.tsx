// /pages/InstitutionDashboard.tsx
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Users,
  FileText,
  BarChart3,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Award,
  GraduationCap,
  ScrollText,
  Calendar,
  Wallet,
  Mail,
  ChevronRight,
  Loader2,
  ExternalLink,
  Eye,
  MoreVertical,
  Download,
  Copy,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { institutionAPI, credentialAPI } from "@/lib/api";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";

interface Student {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  status: "active" | "pending" | "inactive";
  enrollmentDate?: string;
  program?: string;
  phone?: string;
}

interface CredentialFormData {
  studentId: string;
  title: string;
  type: "degree" | "certificate" | "transcript" | "diploma";
  institution: string;
  issueDate: Date;
  description: string;
  metadata: {
    grade?: string;
    gpa?: number;
    credits?: number;
    program?: string;
    major?: string;
    [key: string]: any;
  };
}

interface RecentIssue {
  id: string;
  studentName: string;
  credentialTitle: string;
  txHash: string;
  timestamp: string;
}

export function InstitutionDashboard() {
  const { toast } = useToast();

  // State
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isIssuing, setIsIssuing] = useState(false);
  const [stats, setStats] = useState({
    totalIssued: 0,
    activeStudents: 0,
    todayIssues: 0,
    verificationRate: 0,
  });
  const [recentIssues, setRecentIssues] = useState<RecentIssue[]>([]);

  // Credential form state
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [credentialForm, setCredentialForm] = useState<CredentialFormData>({
    studentId: "",
    title: "",
    type: "degree",
    institution: "Massachusetts Institute of Technology",
    issueDate: new Date(),
    description: "",
    metadata: {
      grade: "",
      gpa: 0,
      credits: 0,
      program: "",
      major: "",
    },
  });

  // Load data
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchQuery]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch students
      const studentsResponse = await institutionAPI.getStudents();
      setStudents(studentsResponse.data);
      setFilteredStudents(studentsResponse.data);

      // Fetch stats
      const statsResponse = await institutionAPI.getStats();
      setStats(statsResponse.data);

      // Fetch recent issues (would need a real endpoint)
      // For now, use mock data
      setRecentIssues([
        {
          id: "1",
          studentName: "John Doe",
          credentialTitle: "PhD in Computer Science",
          txHash:
            "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          studentName: "Jane Smith",
          credentialTitle: "Master of Data Science",
          txHash:
            "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          studentName: "Bob Johnson",
          credentialTitle: "Bachelor of Engineering",
          txHash:
            "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
          timestamp: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ]);
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Error",
        description: error.userMessage || "Failed to load institution data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.walletAddress.toLowerCase().includes(query) ||
        student.program?.toLowerCase().includes(query),
    );

    setFilteredStudents(filtered);
  };

  const handleIssueCredential = async (student: Student) => {
    setSelectedStudent(student);
    setCredentialForm({
      ...credentialForm,
      studentId: student.id,
      institution: "Massachusetts Institute of Technology", // Default to MIT
    });
    setShowIssueDialog(true);
  };

  const submitCredential = async () => {
    if (!selectedStudent) return;

    try {
      setIsIssuing(true);

      // Prepare credential data
      const credentialData = {
        studentId: selectedStudent.id,
        studentWallet: selectedStudent.walletAddress,
        title: credentialForm.title,
        type: credentialForm.type,
        institution: credentialForm.institution,
        description: credentialForm.description,
        metadata: credentialForm.metadata,
        issueDate: credentialForm.issueDate.toISOString(),
      };

      // Call the API to issue credential
      const response = await institutionAPI.issueCredential(credentialData);

      toast({
        title: "Success!",
        description: `Credential "${credentialForm.title}" issued to ${selectedStudent.name}`,
      });

      // Reset form and close dialog
      setShowIssueDialog(false);
      setSelectedStudent(null);
      setCredentialForm({
        studentId: "",
        title: "",
        type: "degree",
        institution: "Massachusetts Institute of Technology",
        issueDate: new Date(),
        description: "",
        metadata: {
          grade: "",
          gpa: 0,
          credits: 0,
          program: "",
          major: "",
        },
      });

      // Refresh data
      fetchData();
    } catch (error: any) {
      console.error("Issue credential error:", error);
      toast({
        title: "Error",
        description: error.userMessage || "Failed to issue credential",
        variant: "destructive",
      });
    } finally {
      setIsIssuing(false);
    }
  };

  const handleBulkUpload = async () => {
    // In a real app, you would:
    // 1. Show file picker for CSV/Excel
    // 2. Parse the file
    // 3. Upload to backend for batch processing
    toast({
      title: "Bulk Upload",
      description: "Select a CSV file with student credential data",
    });

    // Mock file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.xlsx,.json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("file", file);

        toast({
          title: "Uploading...",
          description: "Processing bulk upload",
        });

        // Would call: await institutionAPI.bulkUpload(formData);
        // Mock success
        await new Promise((resolve) => setTimeout(resolve, 2000));

        toast({
          title: "Success!",
          description: `Uploaded ${file.name}. Processing 25 credentials...`,
        });

        fetchData();
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to process bulk upload",
          variant: "destructive",
        });
      }
    };
    input.click();
  };

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description,
    });
  };

  const getStatusBadge = (status: Student["status"]) => {
    const config = {
      active: {
        label: "Active",
        className: "bg-success/10 text-success border-success/20",
      },
      pending: {
        label: "Pending",
        className: "bg-pending/10 text-pending border-pending/20",
      },
      inactive: {
        label: "Inactive",
        className: "bg-muted text-muted-foreground border-border",
      },
    };
    return config[status];
  };

  const getCredentialTypeIcon = (type: CredentialFormData["type"]) => {
    const icons = {
      degree: GraduationCap,
      certificate: Award,
      transcript: FileText,
      diploma: ScrollText,
    };
    return icons[type];
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return format(date, "MMM d");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Loading institution dashboard...
            </span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">🏛️ MIT Admin Portal</h1>
                <p className="text-muted-foreground">
                  Issue and manage academic credentials on the blockchain
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleBulkUpload}
            >
              <Upload className="h-4 w-4" />
              Bulk Upload
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Issued"
            value={stats.totalIssued.toLocaleString()}
            icon={FileText}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Active Students"
            value={stats.activeStudents.toLocaleString()}
            icon={Users}
            variant="success"
          />
          <StatsCard
            title="Today's Issues"
            value={stats.todayIssues.toString()}
            icon={BarChart3}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Verification Rate"
            value={`${stats.verificationRate}%`}
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Student Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Student Management</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {students.length} students
                    </Badge>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-3 w-3" />
                      Add Student
                    </Button>
                  </div>
                </div>

                <div className="mb-6 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, wallet, or program..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Student</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Wallet</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-muted-foreground"
                          >
                            {searchQuery
                              ? "No students match your search"
                              : "No students found"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudents.map((student) => {
                          const statusBadge = getStatusBadge(student.status);
                          return (
                            <TableRow
                              key={student.id}
                              className="group hover:bg-muted/50"
                            >
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Users className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {student.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {student.program ||
                                        "No program specified"}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">
                                    {student.email}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Wallet className="h-3 w-3 text-muted-foreground" />
                                  <code className="text-xs font-mono text-muted-foreground">
                                    {student.walletAddress.slice(0, 8)}...
                                    {student.walletAddress.slice(-6)}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() =>
                                      copyToClipboard(
                                        student.walletAddress,
                                        "Wallet address copied",
                                      )
                                    }
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={statusBadge.className}
                                >
                                  {statusBadge.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    className="gap-1"
                                    onClick={() =>
                                      handleIssueCredential(student)
                                    }
                                  >
                                    <Award className="h-3 w-3" />
                                    Issue
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>
                                        Actions
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="gap-2">
                                        <Eye className="h-4 w-4" />
                                        View Profile
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="gap-2">
                                        <FileText className="h-4 w-4" />
                                        View Credentials
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="gap-2">
                                        <Mail className="h-4 w-4" />
                                        Send Email
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="gap-2 text-destructive">
                                        <Users className="h-4 w-4" />
                                        Deactivate
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>

                {filteredStudents.length > 0 && (
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                      Showing {filteredStudents.length} of {students.length}{" "}
                      students
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="ghost" size="sm">
                        Next
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handleBulkUpload}
                  >
                    <Upload className="h-4 w-4" />
                    Bulk Upload Credentials
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      toast({
                        title: "Export Started",
                        description: "Generating reports...",
                      });
                    }}
                  >
                    <FileText className="h-4 w-4" />
                    Generate Reports
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      toast({
                        title: "Analytics",
                        description: "Opening analytics dashboard...",
                      });
                    }}
                  >
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      // Would open student import modal
                      toast({
                        title: "Import Students",
                        description: "Open student import interface",
                      });
                    }}
                  >
                    <Users className="h-4 w-4" />
                    Import Students
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Issues */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Recent Issues</h3>
                  <Badge variant="outline" className="text-xs">
                    {recentIssues.length} today
                  </Badge>
                </div>
                <div className="space-y-4">
                  {recentIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0 group"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium line-clamp-1">
                              {issue.studentName}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {issue.credentialTitle}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0 ml-2">
                            {formatTimeAgo(issue.timestamp)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <code className="text-xs font-mono text-muted-foreground">
                            {issue.txHash.slice(0, 12)}...
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() =>
                              copyToClipboard(
                                issue.txHash,
                                "Transaction hash copied",
                              )
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() =>
                              window.open(
                                `https://sepolia.etherscan.io/tx/${issue.txHash}`,
                                "_blank",
                              )
                            }
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-sm">
                  View All Issues
                </Button>
              </CardContent>
            </Card>

            {/* Blockchain Status */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Blockchain Status</h3>
                    <p className="text-xs text-muted-foreground">
                      Sepolia Testnet
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network</span>
                    <span className="font-medium">Sepolia</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issuer Wallet</span>
                    <code className="font-mono text-xs">0x742d...b045</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contract</span>
                    <span className="font-medium text-success">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gas Price</span>
                    <span className="font-medium">12.5 Gwei</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View on Etherscan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Issue Credential Dialog */}
      <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Issue New Credential
            </DialogTitle>
            <DialogDescription>
              Create and issue a blockchain-verified credential to{" "}
              {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="p-4 rounded-lg bg-muted border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{selectedStudent.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {selectedStudent.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Wallet className="h-3 w-3" />
                          {selectedStudent.walletAddress.slice(0, 10)}...
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusBadge(selectedStudent.status).className}
                  >
                    {getStatusBadge(selectedStudent.status).label}
                  </Badge>
                </div>
              </div>

              {/* Credential Form */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="credential-title">Credential Title *</Label>
                    <Input
                      id="credential-title"
                      placeholder="e.g., Bachelor of Computer Science"
                      value={credentialForm.title}
                      onChange={(e) =>
                        setCredentialForm({
                          ...credentialForm,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credential-type">Credential Type *</Label>
                    <Select
                      value={credentialForm.type}
                      onValueChange={(value: CredentialFormData["type"]) =>
                        setCredentialForm({ ...credentialForm, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="degree">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Degree
                          </div>
                        </SelectItem>
                        <SelectItem value="certificate">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Certificate
                          </div>
                        </SelectItem>
                        <SelectItem value="transcript">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Transcript
                          </div>
                        </SelectItem>
                        <SelectItem value="diploma">
                          <div className="flex items-center gap-2">
                            <ScrollText className="h-4 w-4" />
                            Diploma
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution *</Label>
                    <Input
                      id="institution"
                      value={credentialForm.institution}
                      onChange={(e) =>
                        setCredentialForm({
                          ...credentialForm,
                          institution: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue-date">Issue Date *</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="issue-date"
                        type="date"
                        value={format(credentialForm.issueDate, "yyyy-MM-dd")}
                        onChange={(e) =>
                          setCredentialForm({
                            ...credentialForm,
                            issueDate: new Date(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the credential, achievements, etc."
                      rows={3}
                      value={credentialForm.description}
                      onChange={(e) =>
                        setCredentialForm({
                          ...credentialForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Additional Metadata</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="grade" className="text-xs">
                          Grade
                        </Label>
                        <Input
                          id="grade"
                          placeholder="A+, B, etc."
                          value={credentialForm.metadata.grade}
                          onChange={(e) =>
                            setCredentialForm({
                              ...credentialForm,
                              metadata: {
                                ...credentialForm.metadata,
                                grade: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gpa" className="text-xs">
                          GPA
                        </Label>
                        <Input
                          id="gpa"
                          type="number"
                          step="0.01"
                          placeholder="4.0"
                          value={credentialForm.metadata.gpa}
                          onChange={(e) =>
                            setCredentialForm({
                              ...credentialForm,
                              metadata: {
                                ...credentialForm.metadata,
                                gpa: parseFloat(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="credits" className="text-xs">
                          Credits
                        </Label>
                        <Input
                          id="credits"
                          type="number"
                          placeholder="120"
                          value={credentialForm.metadata.credits}
                          onChange={(e) =>
                            setCredentialForm({
                              ...credentialForm,
                              metadata: {
                                ...credentialForm.metadata,
                                credits: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="program" className="text-xs">
                          Program
                        </Label>
                        <Input
                          id="program"
                          placeholder="Computer Science"
                          value={credentialForm.metadata.program}
                          onChange={(e) =>
                            setCredentialForm({
                              ...credentialForm,
                              metadata: {
                                ...credentialForm.metadata,
                                program: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <h4 className="font-semibold mb-3">Preview</h4>
                <div className="flex items-start gap-4">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      credentialForm.type === "degree"
                        ? "bg-primary/10 text-primary"
                        : credentialForm.type === "certificate"
                          ? "bg-amber-500/10 text-amber-600"
                          : credentialForm.type === "transcript"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-purple-500/10 text-purple-600"
                    }`}
                  >
                    {(() => {
                      const Icon = getCredentialTypeIcon(credentialForm.type);
                      return <Icon className="h-6 w-6" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold">
                      {credentialForm.title || "Credential Title"}
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {credentialForm.institution}
                    </p>
                    <p className="text-sm mt-2">
                      {credentialForm.description ||
                        "Description will appear here"}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(credentialForm.issueDate, "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {selectedStudent.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blockchain Info */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary mb-1">
                      Blockchain Verification
                    </h4>
                    <p className="text-sm text-primary/80">
                      This credential will be permanently stored on the Ethereum
                      blockchain. Once issued, it cannot be altered or deleted.
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <Wallet className="h-3 w-3" />
                        Issuer: 0x742d...b045
                      </span>
                      <span className="flex items-center gap-1">
                        <Wallet className="h-3 w-3" />
                        Student: {selectedStudent.walletAddress.slice(0, 10)}...
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowIssueDialog(false)}
                  disabled={isIssuing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitCredential}
                  disabled={
                    !credentialForm.title ||
                    !credentialForm.description ||
                    isIssuing
                  }
                  className="gap-2"
                >
                  {isIssuing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Issuing on Blockchain...
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4" />
                      Issue Credential
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
