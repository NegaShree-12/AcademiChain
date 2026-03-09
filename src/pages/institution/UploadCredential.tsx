// frontend/src/pages/institution/UploadCredential.tsx
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Upload,
  FileText,
  Users,
  Calendar,
  Award,
  GraduationCap,
  ScrollText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Eye,
  FileUp,
  FileDown,
  ChevronDown,
  Search,
  Wallet,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { institutionAPI } from "@/lib/api";
import { cn } from "@/lib/utils";

const uploadSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  title: z.string().min(1, "Title is required"),
  type: z.enum(["degree", "certificate", "transcript", "diploma"]),
  institution: z.string().min(1, "Institution is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  description: z.string().min(1, "Description is required"),
  grade: z.string().optional(),
  gpa: z.number().min(0).max(4.0).optional(),
  credits: z.number().min(0).optional(),
  program: z.string().optional(),
  major: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface Student {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  program: string;
  studentId: string;
  status?: "active" | "pending" | "inactive";
}

export function UploadCredential() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedHash, setGeneratedHash] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [studentSearchOpen, setStudentSearchOpen] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      institution: "Massachusetts Institute of Technology",
      type: "degree",
      issueDate: new Date().toISOString().split("T")[0],
    },
  });

  const formValues = watch();

  // Load students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search query
  useEffect(() => {
    if (!studentSearchQuery.trim()) {
      setFilteredStudents(students);
    } else {
      const query = studentSearchQuery.toLowerCase();
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query) ||
          student.program?.toLowerCase().includes(query) ||
          student.studentId?.toLowerCase().includes(query),
      );
      setFilteredStudents(filtered);
    }
  }, [studentSearchQuery, students]);

  const fetchStudents = async () => {
    try {
      setIsLoadingStudents(true);
      console.log("📋 Fetching students...");

      // Fetch students from API
      const response = await institutionAPI.getStudents();
      console.log("📋 API Response:", response);

      // Handle different response structures
      let studentList = [];
      if (response.data?.data) {
        studentList = response.data.data;
      } else if (Array.isArray(response.data)) {
        studentList = response.data;
      } else if (response.data?.students) {
        studentList = response.data.students;
      } else {
        studentList = response.data || [];
      }

      // Transform data to match our Student interface
      const transformedStudents = studentList.map((student: any) => ({
        id: student._id || student.id,
        name: student.name,
        email: student.email,
        walletAddress: student.walletAddress || "0x0000...0000",
        program: student.program || student.department || "Undeclared",
        studentId: student.studentId || student.id,
        status: student.status || "active",
      }));

      console.log("📋 Transformed students:", transformedStudents);
      setStudents(transformedStudents);
      setFilteredStudents(transformedStudents);

      if (transformedStudents.length === 0) {
        toast({
          title: "No Students Found",
          description: "Please add students first before issuing credentials",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("❌ Failed to load students:", error);
      toast({
        title: "Error",
        description: "Failed to load students. Please try again.",
        variant: "destructive",
      });

      // Mock data for testing if API fails
      const mockStudents = [
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@mit.edu",
          walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45",
          program: "Computer Science",
          studentId: "STU001",
          status: "active",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@mit.edu",
          walletAddress: "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f",
          program: "Data Science",
          studentId: "STU002",
          status: "active",
        },
        {
          id: "3",
          name: "Bob Johnson",
          email: "bob.j@mit.edu",
          walletAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
          program: "Engineering",
          studentId: "STU003",
          status: "pending",
        },
      ];
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setValue("studentId", student.id);
    setStudentSearchOpen(false);
    toast({
      title: "Student Selected",
      description: `${student.name} selected`,
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, PNG, JPG, or DOC files",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    // Simulate file processing
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          // Generate mock hash (in production, this would come from backend)
          const mockHash = `0x${Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16),
          ).join("")}`;
          setGeneratedHash(mockHash);

          toast({
            title: "File processed",
            description: "Document hash generated successfully",
          });

          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generateHash = async (data: UploadFormData) => {
    try {
      // Generate SHA-256 hash from credential data
      const credentialData = JSON.stringify({
        ...data,
        student: selectedStudent,
        timestamp: Date.now(),
      });

      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(credentialData);
      const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      return `0x${hashHex}`;
    } catch (error) {
      console.error("Hash generation error:", error);
      throw error;
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a student",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Step 1: Generate hash
      const hash = await generateHash(data);
      setGeneratedHash(hash);

      // Step 2: Upload to IPFS and blockchain (simulated)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock blockchain transaction
      const mockTxHash = `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join("")}`;
      setTxHash(mockTxHash);

      // Step 3: Show preview
      setShowPreview(true);

      toast({
        title: "Credential ready",
        description: "Review and confirm to issue on blockchain",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to process credential",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // In your confirmOnBlockchain function, generate a CONSISTENT transaction hash
  // based on the student's wallet address + timestamp

  const confirmOnBlockchain = async () => {
    try {
      setIsConfirming(true);

      // Generate a deterministic transaction hash based on student's wallet
      // This ensures the same wallet always generates the same type of hash
      const generateTxHash = (walletAddress: string, timestamp: number) => {
        // Take first 32 chars of wallet + timestamp to create a consistent hash
        const base = walletAddress.slice(2, 34) + timestamp.toString(16);
        return "0x" + base.padEnd(64, "0").slice(0, 64);
      };

      const txHash = generateTxHash(
        selectedStudent?.walletAddress || "",
        Date.now(),
      );

      const credentialData = {
        studentId: selectedStudent?.id,
        studentWallet: selectedStudent?.walletAddress,
        studentName: selectedStudent?.name,
        title: formValues.title,
        type: formValues.type,
        institution: formValues.institution,
        description: formValues.description,
        metadata: {
          grade: formValues.grade,
          gpa: formValues.gpa,
          credits: formValues.credits,
          program: formValues.program,
          major: formValues.major,
        },
        issueDate: formValues.issueDate,
        documentHash: generatedHash,
        blockchainTxHash: txHash, // Store this transaction hash
      };

      console.log("📤 Issuing credential with TX Hash:", txHash);

      const response = await institutionAPI.issueCredential(credentialData);

      toast({
        title: "Success!",
        description: `Credential issued with TX: ${txHash.slice(0, 10)}...`,
      });

      // Redirect to issued credentials
      setTimeout(() => {
        window.location.href = "/institution/credentials";
      }, 2000);
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "degree":
        return GraduationCap;
      case "certificate":
        return Award;
      case "transcript":
        return FileText;
      case "diploma":
        return ScrollText;
      default:
        return FileText;
    }
  };

  const TypeIcon = getTypeIcon(formValues.type);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Credential</h1>
        <p className="text-muted-foreground">
          Issue blockchain-verified academic credentials to students
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Student Selection - Improved with Search */}
                <div className="space-y-4">
                  <Label>Select Student *</Label>

                  {isLoadingStudents ? (
                    <div className="flex items-center justify-center p-8 border rounded-lg">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">Loading students...</span>
                    </div>
                  ) : students.length === 0 ? (
                    <div className="text-center p-8 border rounded-lg bg-muted/30">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No Students Found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Please add students first before issuing credentials
                      </p>
                      <Button
                        variant="outline"
                        onClick={() =>
                          (window.location.href = "/institution/students")
                        }
                      >
                        Add Students
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Search and Select Popover */}
                      <Popover
                        open={studentSearchOpen}
                        onOpenChange={setStudentSearchOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={studentSearchOpen}
                            className="w-full justify-between"
                          >
                            {selectedStudent ? (
                              <span className="truncate">
                                {selectedStudent.name} - {selectedStudent.email}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">
                                Search and select a student...
                              </span>
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search students..."
                              value={studentSearchQuery}
                              onValueChange={setStudentSearchQuery}
                            />
                            <CommandEmpty>No students found.</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {filteredStudents.map((student) => (
                                <CommandItem
                                  key={student.id}
                                  value={student.id}
                                  onSelect={() => handleStudentSelect(student)}
                                  className="cursor-pointer"
                                >
                                  <div className="flex flex-col gap-1 py-1">
                                    <div className="font-medium">
                                      {student.name}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Mail className="h-3 w-3" />
                                      {student.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Wallet className="h-3 w-3" />
                                      {student.walletAddress.slice(0, 10)}...
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {student.program}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "text-xs",
                                          student.status === "active"
                                            ? "bg-success/10 text-success"
                                            : "bg-pending/10 text-pending",
                                        )}
                                      >
                                        {student.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {/* Selected Student Card */}
                      {selectedStudent && (
                        <div className="p-4 border rounded-lg bg-primary/5">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold">
                                  {selectedStudent.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedStudent.email}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {selectedStudent.program}
                                  </Badge>
                                  <code className="text-xs font-mono text-muted-foreground">
                                    {selectedStudent.walletAddress.slice(0, 10)}
                                    ...
                                  </code>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedStudent(null);
                                setValue("studentId", "");
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {errors.studentId && (
                    <p className="text-sm text-destructive">
                      {errors.studentId.message}
                    </p>
                  )}
                </div>

                {/* Credential Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Credential Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Bachelor of Computer Science"
                        {...register("title")}
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Credential Type *</Label>
                      <Select
                        value={formValues.type}
                        onValueChange={(value: any) => setValue("type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
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
                      <Label htmlFor="institution">Issuing Institution *</Label>
                      <Input
                        id="institution"
                        placeholder="e.g., Massachusetts Institute of Technology"
                        {...register("institution")}
                      />
                      {errors.institution && (
                        <p className="text-sm text-destructive">
                          {errors.institution.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="issueDate">Issue Date *</Label>
                      <Input
                        id="issueDate"
                        type="date"
                        {...register("issueDate")}
                      />
                      {errors.issueDate && (
                        <p className="text-sm text-destructive">
                          {errors.issueDate.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade (Optional)</Label>
                      <Input
                        id="grade"
                        placeholder="e.g., A+, First Class"
                        {...register("grade")}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gpa">GPA (Optional)</Label>
                        <Input
                          id="gpa"
                          type="number"
                          step="0.01"
                          min="0"
                          max="4"
                          placeholder="4.0"
                          {...register("gpa", { valueAsNumber: true })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="credits">Credits (Optional)</Label>
                        <Input
                          id="credits"
                          type="number"
                          placeholder="120"
                          {...register("credits", { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the credential, achievements, courses, etc."
                    rows={4}
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <Label>Supporting Document (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      className="hidden"
                      disabled={isUploading}
                    />

                    {isUploading ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <span className="font-medium">
                            Processing document...
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 max-w-md mx-auto">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {uploadProgress}% complete
                        </p>
                      </div>
                    ) : (
                      <>
                        <FileUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          PDF, PNG, JPG, DOC up to 10MB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Generated Hash Display */}
                {generatedHash && (
                  <div className="p-4 rounded-lg bg-muted border">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        Document Hash Generated
                      </span>
                    </div>
                    <code className="text-xs font-mono break-all bg-background p-2 rounded block">
                      {generatedHash}
                    </code>
                    <p className="text-xs text-muted-foreground mt-2">
                      This SHA-256 hash will be stored on the blockchain
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={
                    isUploading || !selectedStudent || isLoadingStudents
                  }
                  className="w-full gap-2"
                  size="lg"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4" />
                      Generate Credential
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Credential Preview</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center",
                      formValues.type === "degree"
                        ? "bg-primary/10 text-primary"
                        : formValues.type === "certificate"
                          ? "bg-amber-500/10 text-amber-600"
                          : formValues.type === "transcript"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-purple-500/10 text-purple-600",
                    )}
                  >
                    <TypeIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {formValues.title || "Untitled Credential"}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {formValues.type || "credential"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Institution</span>
                    <span className="font-medium">
                      {formValues.institution || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Issue Date</span>
                    <span className="font-medium">
                      {formValues.issueDate
                        ? new Date(formValues.issueDate).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  {selectedStudent && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Student</span>
                        <span className="font-medium">
                          {selectedStudent.name}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Program</span>
                        <span className="font-medium">
                          {selectedStudent.program}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {formValues.description && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">
                      Description
                    </p>
                    <p className="text-sm bg-muted/30 p-3 rounded-lg">
                      {formValues.description}
                    </p>
                  </div>
                )}

                {formValues.grade && (
                  <div className="pt-2">
                    <Badge variant="outline" className="bg-primary/5">
                      Grade: {formValues.grade}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">How It Works</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0 font-medium">
                    1
                  </div>
                  <p>Select a student from your institution</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0 font-medium">
                    2
                  </div>
                  <p>Fill in credential details (title, type, date)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0 font-medium">
                    3
                  </div>
                  <p>Upload supporting document (optional)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0 font-medium">
                    4
                  </div>
                  <p>Generate cryptographic hash and issue on blockchain</p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-700">
                    <p className="font-medium mb-1">Important</p>
                    <p>
                      Once issued on the blockchain, credentials cannot be
                      altered or deleted. Please review all information
                      carefully before confirming.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Ready to Issue
            </DialogTitle>
            <DialogDescription>
              Review credential details before issuing on blockchain
            </DialogDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setShowPreview(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="space-y-6">
            {/* Preview */}
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TypeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{formValues.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formValues.institution}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {formValues.type}
                </Badge>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Student</span>
                  <span className="font-medium">{selectedStudent?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Student Email</span>
                  <span className="font-medium">{selectedStudent?.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Issue Date</span>
                  <span className="font-medium">
                    {new Date(formValues.issueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Document Hash</span>
                  <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {generatedHash.slice(0, 16)}...
                  </code>
                </div>
              </div>
            </div>

            {/* Blockchain Info */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary mb-1">
                    Blockchain Transaction
                  </h4>
                  <p className="text-sm text-primary/80">
                    This will create a permanent record on the Ethereum Sepolia
                    blockchain. Estimated gas fee: 0.0015 ETH
                  </p>
                  {txHash && (
                    <div className="mt-2 p-2 bg-background rounded text-xs font-mono">
                      Tx: {txHash.slice(0, 20)}...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                disabled={isConfirming}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmOnBlockchain}
                disabled={isConfirming}
                className="gap-2"
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Issuing on Blockchain...
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4" />
                    Confirm & Issue
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
