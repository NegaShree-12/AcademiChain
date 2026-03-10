// frontend/src/pages/student/CredentialsPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { studentAPI } from "../../lib/api";
import { RecordCard } from "@/components/RecordCard";
import { useToast } from "../../hooks/use-toast";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, GraduationCap } from "lucide-react";

interface Credential {
  id: string;
  credentialId: string;
  title: string;
  type: string;
  institution: string;
  issueDate: string;
  txHash: string;
  blockNumber: number;
  status: string;
  description?: string;
}

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getCredentials();
      console.log("📋 Student credentials:", response.data);

      let credentialsList = [];
      if (response.data?.data) {
        credentialsList = response.data.data;
      } else if (Array.isArray(response.data)) {
        credentialsList = response.data;
      } else {
        credentialsList = response.data || [];
      }

      // Transform to match RecordCard props
      const transformed = credentialsList.map((cred: any) => ({
        id: cred.credentialId || cred._id,
        credentialId: cred.credentialId,
        title: cred.title,
        type: cred.credentialType || "certificate",
        institution: cred.institutionName,
        issueDate: cred.issueDate,
        txHash: cred.blockchainTxHash,
        blockNumber: cred.blockNumber || 0,
        status: cred.blockchainStatus || "pending",
        description: cred.description || "",
      }));

      setCredentials(transformed);
    } catch (error) {
      console.error("❌ Error fetching credentials:", error);
      toast({
        title: "Error",
        description: "Failed to load credentials",
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Credentials</h1>
        </div>

        {credentials.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No credentials found</p>
            <p className="text-sm text-muted-foreground">
              Credentials issued to you will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {credentials.map((cred) => (
              <Link key={cred.id} to={`/student/credentials/${cred.id}`}>
                <RecordCard credential={cred} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
