// frontend/src/pages/institution/UploadCredential.tsx
import React, { useState, useRef } from "react";
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
}

export function UploadCredential() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedHash, setGeneratedHash] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
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
  React.useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await institutionAPI.getStudents();
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to load students:", error);
    }
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

    // Simulate file processing
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          // Generate mock hash (in production, this would come from backend)
          const mockHash = `0x${Math.random().toString(16).slice(2, 66)}`;
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
      const mockTxHash = `0x${Math.random().toString(16).slice(2, 66)}`;
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

  const confirmOnBlockchain = async () => {
    try {
      setIsConfirming(true);

      // Call backend to issue credential on blockchain
      const credentialData = {
        studentId: selectedStudent?.id,
        studentWallet: selectedStudent?.walletAddress,
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
      };

      const response = await institutionAPI.issueCredential(credentialData);

      toast({
        title: "Success!",
        description: "Credential issued on blockchain",
      });

      // Reset form
      reset();
      setSelectedStudent(null);
      setGeneratedHash("");
      setTxHash("");
      setShowPreview(false);
    } catch (error) {
      console.error("Blockchain confirmation error:", error);
      toast({
        title: "Confirmation failed",
        description: "Failed to issue credential on blockchain",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
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
                {/* Student Selection */}
                <div className="space-y-4">
                  <Label>Select Student *</Label>
                  <div className="grid gap-4">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                          selectedStudent?.id === student.id
                            ? "border-primary bg-primary/5"
                            : "border-border",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {student.email}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {student.program}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <code className="text-xs font-mono text-muted-foreground">
                              {student.walletAddress.slice(0, 10)}...
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                        onValueChange={(value) =>
                          // Handle type change
                          console.log(value)
                        }
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
                    rows={3}
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
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      className="hidden"
                    />

                    {isUploading ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <span>Processing document...</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
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
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
                  disabled={isUploading || !selectedStudent}
                  className="w-full gap-2"
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
                    <p className="font-medium">{formValues.title || "Title"}</p>
                    <p className="text-sm text-muted-foreground">
                      {formValues.type
                        ? formValues.type.charAt(0).toUpperCase() +
                          formValues.type.slice(1)
                        : "Type"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Institution</span>
                    <span className="font-medium">
                      {formValues.institution}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Issue Date</span>
                    <span className="font-medium">
                      {formValues.issueDate
                        ? new Date(formValues.issueDate).toLocaleDateString()
                        : "Not set"}
                    </span>
                  </div>
                  {selectedStudent && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Student</span>
                      <span className="font-medium">
                        {selectedStudent.name}
                      </span>
                    </div>
                  )}
                </div>

                {formValues.description && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-1">
                      Description
                    </p>
                    <p className="text-sm line-clamp-3">
                      {formValues.description}
                    </p>
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
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">
                    1
                  </div>
                  <p>Select student and fill credential details</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">
                    2
                  </div>
                  <p>Upload supporting document (optional)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">
                    3
                  </div>
                  <p>Generate cryptographic hash</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">
                    4
                  </div>
                  <p>Issue credential on blockchain</p>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-muted-foreground/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-pending shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Once issued on blockchain, credentials cannot be altered or
                    deleted. Please review carefully.
                  </p>
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student</span>
                  <span className="font-medium">{selectedStudent?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issue Date</span>
                  <span className="font-medium">
                    {new Date(formValues.issueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Document Hash</span>
                  <code className="font-mono text-xs">
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
                    This will create a permanent record on the Ethereum
                    blockchain. Estimated gas fee: 0.0015 ETH
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
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
