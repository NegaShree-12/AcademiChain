// frontend/src/pages/VerifyCredential.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertCircle,
  Award,
  Calendar,
  User,
  Building,
  Hash,
  ExternalLink,
  Shield,
  Copy,
  Share2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { verificationAPI } from "@/lib/api";

export function VerifyCredential() {
  const { hash } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [credential, setCredential] = useState<any>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (hash) {
      verifyCredential();
    }
  }, [hash]);

  const verifyCredential = async () => {
    try {
      setLoading(true);
      const response = await verificationAPI.verifyByHash(hash!);

      if (response.data.success) {
        setIsValid(response.data.isValid);
        setCredential(response.data.credential);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Error",
        description: "Failed to verify credential",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-3xl">
        <Card className="overflow-hidden">
          {/* Verification Status Banner */}
          <div
            className={`p-6 ${isValid ? "bg-success/10" : "bg-destructive/10"}`}
          >
            <div className="flex items-center gap-4">
              {isValid ? (
                <>
                  <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-success">
                      ✓ Verified
                    </h1>
                    <p className="text-muted-foreground">
                      This credential is authentic and verified on the
                      blockchain
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-destructive">
                      Not Verified
                    </h1>
                    <p className="text-muted-foreground">
                      This credential could not be verified on the blockchain
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {isValid && credential && (
            <>
              {/* Credential Details */}
              <CardContent className="p-6 space-y-6">
                <div className="text-center border-b pb-6">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/10 mb-4">
                    <Award className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{credential.title}</h2>
                  <p className="text-muted-foreground">
                    {credential.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Student Info */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Student Information
                    </h3>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        {credential.studentName}
                      </p>
                      {credential.studentEmail && (
                        <p>
                          <span className="text-muted-foreground">Email:</span>{" "}
                          {credential.studentEmail}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Institution Info */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Issuing Institution
                    </h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p>{credential.institutionName}</p>
                    </div>
                  </div>

                  {/* Credential Details */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Issue Details
                    </h3>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p>
                        <span className="text-muted-foreground">Date:</span>{" "}
                        {new Date(credential.issueDate).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Type:</span>{" "}
                        <Badge variant="outline">
                          {credential.credentialType}
                        </Badge>
                      </p>
                      {credential.metadata?.grade && (
                        <p>
                          <span className="text-muted-foreground">Grade:</span>{" "}
                          {credential.metadata.grade}
                        </p>
                      )}
                      {credential.metadata?.gpa && (
                        <p>
                          <span className="text-muted-foreground">GPA:</span>{" "}
                          {credential.metadata.gpa}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Blockchain Proof */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Blockchain Proof
                    </h3>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p className="text-xs font-mono break-all">{hash}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                          navigator.clipboard.writeText(hash!);
                          toast({ title: "Hash copied!" });
                        }}
                      >
                        <Copy className="h-3 w-3" />
                        Copy Hash
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Blockchain Verified</p>
                    <p className="text-xs text-muted-foreground">
                      This credential is permanently stored on Ethereum Sepolia
                    </p>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({ title: "Link copied to clipboard" });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => {
                      window.open(
                        `https://twitter.com/intent/tweet?text=🎓 Verified credential from ${credential.institutionName}&url=${window.location.href}`,
                        "_blank",
                      );
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      window.open(
                        `https://sepolia.etherscan.io/tx/${hash}`,
                        "_blank",
                      );
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
