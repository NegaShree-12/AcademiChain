import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { studentAPI } from "../../lib/api";
import { RecordCard } from "@/components/RecordCard";
import { useToast } from "../../hooks/use-toast";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await studentAPI.getCredentials();
      // Transform the API data to match what RecordCard expects
      const transformedData = (response.data.data || []).map((cred: any) => ({
        id: cred.credentialId || cred.id,
        title: cred.title,
        type: cred.credentialType || "certificate", // Map credentialType to type
        institution: cred.institutionName,
        issueDate: cred.issueDate,
        txHash: cred.blockchainTxHash,
        blockNumber: cred.blockNumber || 0,
        status: cred.blockchainStatus || "pending", // Map blockchainStatus to status
        description: cred.description,
      }));
      setCredentials(transformedData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Credentials</h1>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Request Credential
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : credentials.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No credentials found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {credentials.map((cred: any) => (
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
