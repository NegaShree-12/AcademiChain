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

interface Student {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  status: "active" | "pending" | "inactive";
  program: string;
  enrollmentDate: string;
  phone?: string;
  credentials: number;
}

export function StudentsPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // New student form
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    walletAddress: "",
    program: "",
    phone: "",
  });

  // Load mock data
  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchQuery]);

  const loadStudents = () => {
    const mockStudents: Student[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@mit.edu",
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45",
        status: "active",
        program: "Computer Science",
        enrollmentDate: "2024-01-15",
        credentials: 3,
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@mit.edu",
        walletAddress: "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f",
        status: "active",
        program: "Data Science",
        enrollmentDate: "2024-01-20",
        credentials: 2,
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob.j@mit.edu",
        walletAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
        status: "pending",
        program: "Engineering",
        enrollmentDate: "2024-02-01",
        credentials: 0,
      },
      {
        id: "4",
        name: "Alice Williams",
        email: "alice.w@mit.edu",
        walletAddress: "0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d",
        status: "active",
        program: "Business Administration",
        enrollmentDate: "2024-01-10",
        credentials: 1,
      },
      {
        id: "5",
        name: "Charlie Brown",
        email: "charlie.b@mit.edu",
        walletAddress: "0x5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e",
        status: "inactive",
        program: "Physics",
        enrollmentDate: "2023-12-05",
        credentials: 2,
      },
    ];
    setStudents(mockStudents);
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
        student.walletAddress.toLowerCase().includes(query),
    );
    setFilteredStudents(filtered);
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.walletAddress) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name,
      email: newStudent.email,
      walletAddress: newStudent.walletAddress,
      program: newStudent.program || "Undeclared",
      status: "pending",
      enrollmentDate: new Date().toISOString().split("T")[0],
      credentials: 0,
      phone: newStudent.phone,
    };

    setStudents([...students, student]);
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
  };

  const handleEditStudent = () => {
    if (!selectedStudent) return;

    const updatedStudents = students.map((s) =>
      s.id === selectedStudent.id ? selectedStudent : s,
    );
    setStudents(updatedStudents);
    setShowEditDialog(false);

    toast({
      title: "Success",
      description: "Student updated successfully",
    });
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
    toast({
      title: "Success",
      description: "Student deleted successfully",
    });
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
    return config[status];
  };

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
          <Button variant="outline" className="gap-2">
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
                <p className="text-3xl font-bold mt-2">{students.length}</p>
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
                  {students.filter((s) => s.status === "active").length}
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
                  {students.filter((s) => s.status === "pending").length}
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
                <p className="text-3xl font-bold mt-2">
                  {students.reduce((acc, s) => acc + s.credentials, 0)}
                </p>
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
                      key={student.id}
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
                          className={StatusBadge.className}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {StatusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {student.credentials}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(student.enrollmentDate).toLocaleDateString()}
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
                              onClick={() => handleDeleteStudent(student.id)}
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address *</Label>
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
              />
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
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStudent}>Add Student</Button>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={selectedStudent.status}
                  onValueChange={(value: "active" | "pending" | "inactive") =>
                    setSelectedStudent({ ...selectedStudent, status: value })
                  }
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
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStudent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
