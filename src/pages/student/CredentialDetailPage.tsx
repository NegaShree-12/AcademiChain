import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Calendar,
  Copy,
  ExternalLink,
  Share2,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Hash,
  Building,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockCredentials } from "@/data/mockData";
import { format } from "date-fns";

export function CredentialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [credential, setCredential] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find credential from mock data
    const found = mockCredentials.find((c) => c.id === id || c.txHash === id);
    if (found) {
      setCredential(found);
    }
    setIsLoading(false);
  }, [id]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "verified":
        return {
          icon: CheckCircle2,
          label: "Verified",
          className: "bg-success/10 text-success border-success/20",
        };
      case "pending":
        return {
          icon: Clock,
          label: "Pending",
          className: "bg-pending/10 text-pending border-pending/20",
        };
      case "revoked":
        return {
          icon: AlertCircle,
          label: "Revoked",
          className: "bg-destructive/10 text-destructive border-destructive/20",
        };
      default:
        return {
          icon: AlertCircle,
          label: status,
          className: "bg-muted text-muted-foreground",
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "degree":
        return Award;
      case "certificate":
        return Award;
      case "transcript":
        return FileText;
      case "diploma":
        return Award;
      default:
        return FileText;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 flex justify-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <Shield className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Credential Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The credential you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/student")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusConfig(credential.status).icon;
  const TypeIcon = getTypeIcon(credential.type);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/student")}
        >
          ← Back to Dashboard
        </Button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <div
              className={`h-16 w-16 rounded-xl flex items-center justify-center ${
                credential.type === "degree"
                  ? "bg-primary/10 text-primary"
                  : credential.type === "certificate"
                    ? "bg-amber-500/10 text-amber-600"
                    : credential.type === "transcript"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-purple-500/10 text-purple-600"
              }`}
            >
              <TypeIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{credential.title}</h1>
              <p className="text-xl text-muted-foreground mt-1">
                {credential.institution}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Badge
                  variant="outline"
                  className={getStatusConfig(credential.status).className}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {getStatusConfig(credential.status).label}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {credential.type}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left column - Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div className="rounded-lg border p-6">
              <h2 className="font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground">
                {credential.description || "No description provided."}
              </p>
            </div>

            {/* Metadata */}
            <div className="rounded-lg border p-6">
              <h2 className="font-semibold mb-4">Credential Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Issue Date</span>
                  <span className="font-medium">
                    {format(new Date(credential.issueDate), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Credential ID</span>
                  <span className="font-mono text-sm">{credential.id}</span>
                </div>
                {credential.metadata?.grade && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Grade</span>
                    <span className="font-medium">
                      {credential.metadata.grade}
                    </span>
                  </div>
                )}
                {credential.metadata?.gpa && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">GPA</span>
                    <span className="font-medium">
                      {credential.metadata.gpa}
                    </span>
                  </div>
                )}
                {credential.metadata?.credits && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Credits</span>
                    <span className="font-medium">
                      {credential.metadata.credits}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Blockchain */}
          <div className="space-y-6">
            <div className="rounded-lg border p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Blockchain Proof
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Transaction Hash
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs break-all bg-muted p-2 rounded flex-1">
                      {credential.txHash}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() =>
                        copyToClipboard(credential.txHash, "Transaction hash")
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Block Number
                  </p>
                  <p className="font-mono text-sm">
                    #{credential.blockNumber.toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() =>
                    window.open(
                      `https://sepolia.etherscan.io/tx/${credential.txHash}`,
                      "_blank",
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Etherscan
                </Button>
              </div>
            </div>

            <div className="rounded-lg border p-6 bg-primary/5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-primary">
                    Blockchain Verified
                  </h3>
                  <p className="text-sm text-primary/80 mt-1">
                    This credential is permanently stored on the Ethereum
                    blockchain and cannot be altered.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
