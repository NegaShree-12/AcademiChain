import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Users,
  FileText,
  Plus,
  Search,
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
  Copy,
  X,
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { institutionAPI } from "@/lib/api";
import { format } from "date-fns";

interface Student {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  status: "active" | "pending";
  program?: string;
}

interface CredentialFormData {
  studentId: string;
  title: string;
  type: "degree" | "certificate" | "transcript" | "diploma";
  issueDate: Date;
  description: string;
  grade?: string;
}

export function InstitutionDashboard() {
  const { toast } = useToast();

  // State
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@mit.edu",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45",
      status: "active",
      program: "Computer Science",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@mit.edu",
      walletAddress: "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f",
      status: "active",
      program: "Data Science",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob.j@mit.edu",
      walletAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      status: "pending",
      program: "Engineering",
    },
  ]);

  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);

  const [stats, setStats] = useState({
    totalIssued: 156,
    activeStudents: 3,
    pendingIssuance: 2,
    verifiedToday: 5,
  });

  // Credential form state
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [credentialForm, setCredentialForm] = useState<CredentialFormData>({
    studentId: "",
    title: "",
    type: "degree",
    issueDate: new Date(),
    description: "",
    grade: "",
  });

  // Filter students based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.program?.toLowerCase().includes(query),
    );

    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  const handleIssueCredential = (student: Student) => {
    setSelectedStudent(student);
    setCredentialForm({
      ...credentialForm,
      studentId: student.id,
    });
    setShowIssueDialog(true);
  };

  const submitCredential = async () => {
    if (!selectedStudent) return;

    try {
      setIsIssuing(true);

      // Mock successful issuance
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockTxHash = "0x" + Math.random().toString(16).slice(2, 66);

      toast({
        title: "✅ Credential Issued!",
        description: `Successfully issued to ${selectedStudent.name}`,
      });

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalIssued: prev.totalIssued + 1,
        pendingIssuance: prev.pendingIssuance + 1,
      }));

      setShowIssueDialog(false);
      setSelectedStudent(null);
      setCredentialForm({
        studentId: "",
        title: "",
        type: "degree",
        issueDate: new Date(),
        description: "",
        grade: "",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to issue credential",
        variant: "destructive",
      });
    } finally {
      setIsIssuing(false);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading institution dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Institution Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Issue and manage blockchain-verified academic credentials
          </p>
        </div>
        <Link to="/institution/upload">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Bulk Upload
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Issued"
          value={stats.totalIssued}
          icon={Award}
          variant="primary"
        />
        <StatsCard
          title="Active Students"
          value={stats.activeStudents}
          icon={Users}
          variant="success"
        />
        <StatsCard
          title="Pending Issuance"
          value={stats.pendingIssuance}
          icon={FileText}
          variant="warning"
        />
        <StatsCard
          title="Verified Today"
          value={stats.verifiedToday}
          icon={CheckCircle2}
          variant="default"
        />
      </div>

      {/* Main Content - Student Management */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Students</h2>
            <Badge variant="outline" className="text-xs">
              {students.length} total
            </Badge>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, email, or program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Students Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Program</TableHead>
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
                      No students found
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
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {student.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{student.program || "—"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Wallet className="h-3 w-3 text-muted-foreground" />
                            <code className="text-xs font-mono">
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
                          <Button
                            size="sm"
                            onClick={() => handleIssueCredential(student)}
                            className="gap-1"
                          >
                            <Award className="h-3 w-3" />
                            Issue
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Issue Credential Dialog */}
      <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Issue Credential
            </DialogTitle>
            <DialogDescription>
              Issue a blockchain-verified credential to {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4">
              {/* Student Summary */}
              <div className="p-3 rounded-lg bg-muted border text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedStudent.name}</span>
                  <span className="text-muted-foreground">•</span>
                  <code className="text-xs font-mono">
                    {selectedStudent.walletAddress.slice(0, 10)}...
                  </code>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Credential Title *</Label>
                  <Input
                    id="title"
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
                  <Label htmlFor="type">Credential Type *</Label>
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
                      <SelectItem value="degree">Degree</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="transcript">Transcript</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Issue Date *</Label>
                    <Input
                      id="issueDate"
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
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade (Optional)</Label>
                    <Input
                      id="grade"
                      placeholder="e.g., A+, First Class"
                      value={credentialForm.grade}
                      onChange={(e) =>
                        setCredentialForm({
                          ...credentialForm,
                          grade: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

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
              </div>

              {/* Blockchain Warning */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                  <div className="text-primary/80">
                    <p className="font-medium text-primary">
                      Blockchain Verification
                    </p>
                    <p className="text-xs mt-1">
                      This credential will be permanently stored on Ethereum
                      Sepolia. Once issued, it cannot be altered or deleted.
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
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
                      Issuing...
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
