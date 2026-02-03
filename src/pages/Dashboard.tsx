import { Header } from "@/components/Header";
import { RecordCard } from "@/components/RecordCard";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockCredentials, mockStats, mockRecentActivity } from "@/data/mockData";
import {
  Award,
  CheckCircle2,
  Clock,
  Link2,
  Activity,
  Search,
  Filter,
  Plus,
  ExternalLink,
  QrCode,
  Copy,
  Eye,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredCredentials = mockCredentials.filter(
    (cred) =>
      cred.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = (credId: string) => {
    setSelectedCredential(credId);
    setShareDialogOpen(true);
  };

  const handleView = (credId: string) => {
    setSelectedCredential(credId);
    setViewDialogOpen(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `https://academichain.io/verify/0x8f7d3a2c...`
    );
    toast({
      title: "Link Copied",
      description: "Verification link copied to clipboard.",
    });
  };

  const selectedCred = mockCredentials.find((c) => c.id === selectedCredential);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Credentials</h1>
            <p className="text-muted-foreground">
              Manage and share your verified academic records
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Request Credential
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Credentials"
            value={mockStats.totalCredentials}
            icon={Award}
            variant="primary"
          />
          <StatsCard
            title="Verified"
            value={mockStats.verifiedCredentials}
            icon={CheckCircle2}
            variant="success"
          />
          <StatsCard
            title="Pending"
            value={mockStats.pendingVerifications}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Verification Requests"
            value={mockStats.verificationRequests}
            icon={Eye}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Credentials List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search credentials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Credentials Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredCredentials.map((credential) => (
                <RecordCard
                  key={credential.id}
                  credential={credential}
                  onShare={() => handleShare(credential.id)}
                  onView={() => handleView(credential.id)}
                />
              ))}
            </div>
          </div>

          {/* Sidebar - Recent Activity */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Recent Activity</h2>
              </div>

              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        activity.type === "verification"
                          ? "bg-success/10 text-success"
                          : activity.type === "share"
                          ? "bg-primary/10 text-primary"
                          : "bg-pending/10 text-pending"
                      }`}
                    >
                      {activity.type === "verification" && (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      {activity.type === "share" && (
                        <Link2 className="h-4 w-4" />
                      )}
                      {activity.type === "issue" && (
                        <Award className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm line-clamp-2">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                      {activity.txHash && (
                        <Badge variant="secondary" className="mt-2 font-mono text-xs">
                          {activity.txHash}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-4 text-muted-foreground">
                View All Activity
              </Button>
            </div>

            {/* Quick Share */}
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Quick Share</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a QR code to share your credentials in person.
              </p>
              <Button variant="outline" className="w-full gap-2">
                <QrCode className="h-4 w-4" />
                Generate QR Code
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Credential</DialogTitle>
            <DialogDescription>
              Generate a secure verification link for your credential.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedCred && (
              <div className="p-4 rounded-lg bg-muted">
                <p className="font-medium">{selectedCred.title}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedCred.institution}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Verification Link</label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value="https://academichain.io/verify/0x8f7d3a2c..."
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="icon" onClick={copyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <QrCode className="h-4 w-4" />
                Generate QR
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <ExternalLink className="h-4 w-4" />
                Open Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Credential Details</DialogTitle>
          </DialogHeader>

          {selectedCred && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedCred.title}</h3>
                  <p className="text-muted-foreground">
                    {selectedCred.institution}
                  </p>
                  <Badge
                    variant="secondary"
                    className="mt-2 bg-success/10 text-success border-success/20"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified on Blockchain
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Issue Date</p>
                  <p className="font-medium">
                    {new Date(selectedCred.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Block Number</p>
                  <p className="font-mono">
                    #{selectedCred.blockNumber.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">
                  Transaction Hash
                </p>
                <p className="font-mono text-sm break-all">{selectedCred.txHash}</p>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2" onClick={() => handleShare(selectedCred.id)}>
                  <Link2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View on Explorer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
