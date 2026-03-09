// frontend/src/pages/institution/StudentPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Plus,
  Mail,
  Wallet,
  GraduationCap,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  Download,
  Copy,
  CheckCircle2,
  Clock,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { institutionAPI } from "@/lib/api";
import { format } from "date-fns";

interface Student {
  _id: string;
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  status: "active" | "pending" | "inactive";
  program: string;
  enrollmentDate: string;
  phone?: string;
  credentials: number;
  studentId?: string;
}

export function StudentsPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New student form
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    walletAddress: "",
    program: "",
    phone: "",
  });

  // Load students from API on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchQuery]);

  // In your fetchStudents function, update the data transformation:
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      console.log("📋 Fetching students from API...");

      const response = await institutionAPI.getStudents();
      console.log("📋 API Response:", response);

      // The response structure from your API is { success: true, data: [...] }
      let studentList = [];
      if (response.data?.success && Array.isArray(response.data.data)) {
        studentList = response.data.data;
      } else if (Array.isArray(response.data)) {
        studentList = response.data;
      } else if (response.data?.data) {
        studentList = response.data.data;
      } else {
        studentList = response.data || [];
      }

      console.log("📋 Student list:", studentList);
      setStudents(studentList);
    } catch (error) {
      console.error("❌ Failed to fetch students:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load students",
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
        student.program.toLowerCase().includes(query) ||
        (student.walletAddress &&
          student.walletAddress.toLowerCase().includes(query)),
    );
    setFilteredStudents(filtered);
  };

  const handleAddStudent = async () => {
    // Validate required fields
    if (!newStudent.name || !newStudent.email) {
      toast({
        title: "Error",
        description: "Name and Email are required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStudent.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const studentData = {
        name: newStudent.name,
        email: newStudent.email,
        walletAddress:
          newStudent.walletAddress ||
          `0x${Math.random().toString(36).substring(2, 15)}`,
        program: newStudent.program || "Undeclared",
        phone: newStudent.phone,
        status: "pending",
      };

      console.log("📤 Adding student:", studentData);

      const response = await institutionAPI.addStudent(studentData);
      console.log("✅ Student added:", response.data);

      // Refresh the student list
      await fetchStudents();

      // Reset form and close dialog
      setShowAddDialog(false);
      setNewStudent({
        name: "",
        email: "",
        walletAddress: "",
        program: "",
        phone: "",
      });

      toast({
        title: "Success",
        description: "Student added successfully",
      });
    } catch (error: any) {
      console.error("❌ Failed to add student:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add student",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStudent = async () => {
    if (!selectedStudent) return;

    try {
      setIsSubmitting(true);

      const updateData = {
        name: selectedStudent.name,
        email: selectedStudent.email,
        program: selectedStudent.program,
        status: selectedStudent.status,
      };

      console.log("📤 Updating student:", selectedStudent._id, updateData);

      const response = await institutionAPI.updateStudent(
        selectedStudent._id,
        updateData,
      );
      console.log("✅ Student updated:", response.data);

      // Refresh the student list
      await fetchStudents();

      setShowEditDialog(false);
      setSelectedStudent(null);

      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    } catch (error: any) {
      console.error("❌ Failed to update student:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update student",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this student? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      console.log("📤 Deleting student:", id);

      await institutionAPI.deleteStudent(id);
      console.log("✅ Student deleted");

      // Refresh the student list
      await fetchStudents();

      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    } catch (error: any) {
      console.error("❌ Failed to delete student:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete student",
        variant: "destructive",
      });
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
        icon: CheckCircle2,
        className: "bg-success/10 text-success border-success/20",
      },
      pending: {
        label: "Pending",
        icon: Clock,
        className: "bg-pending/10 text-pending border-pending/20",
      },
      inactive: {
        label: "Inactive",
        icon: Clock,
        className: "bg-muted text-muted-foreground border-border",
      },
    };
    return config[status] || config.pending;
  };

  const exportStudents = () => {
    const data = students.map((s) => ({
      Name: s.name,
      Email: s.email,
      Program: s.program,
      Status: s.status,
      "Wallet Address": s.walletAddress,
      "Enrollment Date": format(new Date(s.enrollmentDate), "PPP"),
      Credentials: s.credentials,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Started",
      description: "Students data exported successfully",
    });
  };

  // Calculate stats
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "active").length;
  const pendingStudents = students.filter((s) => s.status === "pending").length;
  const totalCredentials = students.reduce(
    (acc, s) => acc + (s.credentials || 0),
    0,
  );

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all enrolled students
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={fetchStudents}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2" onClick={exportStudents}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold mt-2">{totalStudents}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold mt-2 text-success">
                  {activeStudents}
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
                  {pendingStudents}
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
                <p className="text-sm text-muted-foreground">
                  Total Credentials
                </p>
                <p className="text-3xl font-bold mt-2">{totalCredentials}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <GraduationCap className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, program, or wallet address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Wallet Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Credentials</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium mb-1">
                      No students found
                    </p>
                    <p className="text-sm">
                      {searchQuery
                        ? "Try a different search term"
                        : "Add your first student to get started"}
                    </p>
                    {!searchQuery && (
                      <Button
                        variant="link"
                        className="mt-4"
                        onClick={() => setShowAddDialog(true)}
                      >
                        Add Student
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => {
                  const StatusBadge = getStatusBadge(student.status);
                  const StatusIcon = StatusBadge.icon;
                  return (
                    <TableRow
                      key={student._id || student.id}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Mail className="h-3 w-3" />
                            {student.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{student.program}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wallet className="h-3 w-3 text-muted-foreground" />
                          <code className="text-xs font-mono">
                            {student.walletAddress
                              ? `${student.walletAddress.slice(0, 8)}...${student.walletAddress.slice(-6)}`
                              : "N/A"}
                          </code>
                          {student.walletAddress && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                copyToClipboard(
                                  student.walletAddress!,
                                  "Wallet address copied",
                                )
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
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
                        <Badge variant="secondary" className="font-mono">
                          {student.credentials || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(
                          new Date(student.enrollmentDate),
                          "MMM d, yyyy",
                        )}
                      </TableCell>
                      <TableCell className="text-right">
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowEditDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive"
                              onClick={() =>
                                handleDeleteStudent(student._id || student.id)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Student Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter the student's details to add them to the system.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@mit.edu"
                value={newStudent.email}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, email: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input
                id="wallet"
                placeholder="0x..."
                value={newStudent.walletAddress}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    walletAddress: e.target.value,
                  })
                }
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Optional - can be added later
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Input
                id="program"
                placeholder="Computer Science"
                value={newStudent.program}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, program: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                placeholder="+1 234 567 8900"
                value={newStudent.phone}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, phone: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleAddStudent} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Student"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student's information.
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={selectedStudent.name}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      name: e.target.value,
                    })
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedStudent.email}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      email: e.target.value,
                    })
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-program">Program</Label>
                <Input
                  id="edit-program"
                  value={selectedStudent.program}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      program: e.target.value,
                    })
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={selectedStudent.status}
                  onValueChange={(value: "active" | "pending" | "inactive") =>
                    setSelectedStudent({ ...selectedStudent, status: value })
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-wallet">Wallet Address</Label>
                <Input
                  id="edit-wallet"
                  value={selectedStudent.walletAddress || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      walletAddress: e.target.value,
                    })
                  }
                  disabled={isSubmitting}
                  placeholder="0x..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleEditStudent} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
