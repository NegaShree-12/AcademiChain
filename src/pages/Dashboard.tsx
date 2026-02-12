import { Header } from "@/components/Header";
import { RecordCard } from "@/components/RecordCard";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  mockCredentials,
  mockStats,
  mockRecentActivity,
} from "@/data/mockData";
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
  Download,
  Calendar,
  Info,
  X,
  Share2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { useToast } from "@/hooks/use-toast";
import { credentialAPI } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<string | null>(
    null,
  );
  const [qrData, setQrData] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [expiryDays, setExpiryDays] = useState("30");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const qrRef = useRef<HTMLDivElement>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await credentialAPI.getAll();
      setCredentials(response.data);
    } catch (error) {
      console.error("Failed to fetch credentials:", error);
      toast({
        title: "Error",
        description: "Failed to load credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter credentials based on search and filters
  const filteredCredentials = mockCredentials.filter((cred) => {
    const matchesSearch =
      cred.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.institution.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "all" || cred.type === selectedType;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "verified" && cred.status === "verified") ||
      (activeTab === "pending" && cred.status === "pending");

    return matchesSearch && matchesType && matchesTab;
  });

  const generateShareLink = async (credentialId: string) => {
    setIsGeneratingLink(true);

    try {
      // Calculate expiry date
      let expiresAt: Date | null = null;
      if (expiryDays !== "never") {
        expiresAt = new Date(
          Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000,
        );
      }

      // In production, call the real API:
      // const response = await credentialAPI.share(credentialId, { expiresAt });
      // const link = response.data.link;

      // For now, generate mock link
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/verify/${credentialId}`;
      const mockResponse = {
        data: {
          link,
          shareId: `share_${credentialId}_${Date.now()}`,
          expiresAt,
        },
      };

      setShareLink(mockResponse.data.link);
      setQrData(mockResponse.data.link);

      toast({
        title: "Share link generated",
        description: `Link will ${expiryDays === "never" ? "never expire" : `expire in ${expiryDays} days`}`,
      });
    } catch (error) {
      console.error("Failed to generate share link:", error);
      toast({
        title: "Error",
        description: "Failed to generate share link",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleShare = (credId: string) => {
    setSelectedCredential(credId);
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/verify/${credId}`;
    setShareLink(link);
    setQrData(link);
    setShareDialogOpen(true);
  };

  const handleView = (credId: string) => {
    setSelectedCredential(credId);
    setViewDialogOpen(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link Copied",
      description: "Verification link copied to clipboard.",
    });
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) {
      toast({
        title: "Error",
        description: "QR code not found",
        variant: "destructive",
      });
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `credential-${selectedCredential}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast({
        title: "QR Code Downloaded",
        description: "QR code saved to your device",
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const shareToSocial = (platform: string) => {
    const text = `Check out my verified credential on AcademiChain: ${shareLink}`;
    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      case "email":
        url = `mailto:?subject=My Verified Credential&body=${encodeURIComponent(text)}`;
        break;
    }

    if (url) {
      window.open(url, "_blank");
      toast({
        title: "Shared",
        description: `Opening ${platform}...`,
      });
    }
  };

  const selectedCred = mockCredentials.find((c) => c.id === selectedCredential);

  // Reset when dialog closes
  useEffect(() => {
    if (!shareDialogOpen) {
      setIsGeneratingLink(false);
    }
  }, [shareDialogOpen]);

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

        {/* Filter and Search Section */}
        <div className="mb-8">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
              <TabsTrigger value="all">All Credentials</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-3">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="degree">Degrees</SelectItem>
                  <SelectItem value="certificate">Certificates</SelectItem>
                  <SelectItem value="transcript">Transcripts</SelectItem>
                  <SelectItem value="diploma">Diplomas</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Credentials List */}
          <div className="lg:col-span-2">
            {filteredCredentials.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-2xl">
                <Award className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No credentials found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try a different search term"
                    : "No credentials to display"}
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Request Your First Credential
                </Button>
              </div>
            ) : (
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
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Recent Activity</h2>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {mockRecentActivity.length} activities
                </Badge>
              </div>

              <div className="space-y-4">
                {mockRecentActivity.slice(0, 3).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0 group hover:bg-muted/50 p-2 rounded-lg transition-colors"
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
                    <div className="min-w-0 flex-1">
                      <p className="text-sm line-clamp-2">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                className="w-full mt-4 text-muted-foreground hover:text-foreground"
              >
                View All Activity
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <h2 className="font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    if (filteredCredentials.length > 0) {
                      handleShare(filteredCredentials[0].id);
                    } else {
                      toast({
                        title: "No credentials",
                        description:
                          "You need credentials to generate a QR code",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <QrCode className="h-4 w-4" />
                  Generate QR Code
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    // Export all credentials
                    const data = JSON.stringify(filteredCredentials, null, 2);
                    const blob = new Blob([data], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `credentials-export-${new Date().toISOString().split("T")[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);

                    toast({
                      title: "Export Started",
                      description: "Your credentials are being downloaded",
                    });
                  }}
                >
                  <Download className="h-4 w-4" />
                  Export All Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "Analytics dashboard is under development",
                    });
                  }}
                >
                  <Activity className="h-4 w-4" />
                  View Analytics
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Credential
            </DialogTitle>
            <DialogDescription>
              Generate a secure verification link for your credential.
            </DialogDescription>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>

          <div className="space-y-6">
            {/* Credential Preview */}
            {selectedCred && (
              <div className="p-4 rounded-lg bg-muted border">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{selectedCred.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedCred.institution}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {selectedCred.type}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          selectedCred.status === "verified"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-pending/10 text-pending border-pending/20"
                        }`}
                      >
                        {selectedCred.status}
                      </Badge>
                    </div>
                  </div>
                  <Award className="h-8 w-8 text-primary/60" />
                </div>
              </div>
            )}

            {/* QR Code Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>QR Code</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadQRCode}
                  className="gap-1 text-xs"
                >
                  <Download className="h-3 w-3" />
                  Download
                </Button>
              </div>

              <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl border">
                <div ref={qrRef} className="p-4 bg-white rounded-lg">
                  <QRCode
                    id="qr-code"
                    value={qrData}
                    size={200}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                    includeMargin={true}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center max-w-xs">
                  Scan this QR code with any smartphone camera to verify the
                  credential instantly
                </p>
              </div>
            </div>

            {/* Share Link Section */}
            <div className="space-y-4">
              <Label>Shareable Link</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={shareLink}
                  className="font-mono text-sm flex-1"
                />
                <Button variant="outline" size="icon" onClick={copyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareToSocial("twitter")}
                  className="gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareToSocial("linkedin")}
                  className="gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareToSocial("whatsapp")}
                  className="gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.677-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
                  </svg>
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareToSocial("email")}
                  className="gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email
                </Button>
              </div>
            </div>

            {/* Settings Section */}
            <div className="space-y-4">
              <Label>Link Settings</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry" className="text-sm">
                    Expiry
                  </Label>
                  <Select value={expiryDays} onValueChange={setExpiryDays}>
                    <SelectTrigger id="expiry">
                      <SelectValue placeholder="Select expiry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="access" className="text-sm">
                    Access
                  </Label>
                  <Select defaultValue="public">
                    <SelectTrigger id="access">
                      <SelectValue placeholder="Select access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="password">
                        Password Protected
                      </SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Info className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-xs text-primary">
                  Anyone with this link can verify your credential. Set a
                  password for extra security.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                className="flex-1 gap-2"
                onClick={() => {
                  if (selectedCredential) {
                    generateShareLink(selectedCredential);
                  }
                }}
                disabled={isGeneratingLink}
              >
                {isGeneratingLink ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" />
                    Update Link
                  </>
                )}
              </Button>


              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => window.open(shareLink, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                Preview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Credential Details
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>

          {selectedCred && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div
                  className={`h-16 w-16 rounded-xl flex items-center justify-center ${
                    selectedCred.type === "degree"
                      ? "bg-primary/10 text-primary"
                      : selectedCred.type === "certificate"
                        ? "bg-amber-500/10 text-amber-600"
                        : selectedCred.type === "transcript"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-purple-500/10 text-purple-600"
                  }`}
                >
                  <Award className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {selectedCred.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedCred.institution}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="secondary"
                      className={`${
                        selectedCred.status === "verified"
                          ? "bg-success/10 text-success border-success/20"
                          : selectedCred.status === "pending"
                            ? "bg-pending/10 text-pending border-pending/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                      }`}
                    >
                      {selectedCred.status === "verified" && (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      )}
                      {selectedCred.status.charAt(0).toUpperCase() +
                        selectedCred.status.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {selectedCred.type}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground mb-1">
                      Issue Date
                    </p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedCred.issueDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground mb-1">
                      Block Number
                    </p>
                    <p className="font-mono font-medium">
                      #{selectedCred.blockNumber.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground mb-1">
                      Transaction Hash
                    </p>
                    <p className="font-mono text-sm break-all">
                      {selectedCred.txHash}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 gap-1 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedCred.txHash);
                        toast({ title: "Hash copied!" });
                      }}
                    >
                      <Copy className="h-3 w-3" />
                      Copy Hash
                    </Button>
                  </div>

                  {selectedCred.description && (
                    <div className="p-4 rounded-lg bg-muted">
                      <p className="text-sm text-muted-foreground mb-1">
                        Description
                      </p>
                      <p className="text-sm">{selectedCred.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Blockchain Verification */}
              <div className="p-4 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Blockchain Verified</p>
                    <p className="text-sm text-muted-foreground">
                      This credential is permanently stored on the Ethereum
                      blockchain
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  className="flex-1 gap-2"
                  onClick={() => {
                    setViewDialogOpen(false);
                    setTimeout(() => handleShare(selectedCred.id), 100);
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => {
                    window.open(
                      `https://sepolia.etherscan.io/tx/${selectedCred.txHash}`,
                      "_blank",
                    );
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Explorer
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    // Download credential as PDF
                    toast({
                      title: "Coming Soon",
                      description: "PDF export feature is under development",
                    });
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
