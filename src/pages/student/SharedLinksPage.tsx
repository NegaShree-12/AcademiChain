import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import QRCode from "react-qr-code";
import {
  Share2,
  Link2,
  Copy,
  Download,
  ExternalLink,
  QrCode,
  MoreVertical,
  Trash2,
  Clock,
  Eye,
  Users,
  Calendar,
  Search,
  Filter,
  X,
  CheckCircle2,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockCredentials } from "@/data/mockData";
import { format, formatDistance } from "date-fns";

// Mock shared links data
const mockSharedLinks = [
  {
    id: "share_1",
    credentialId: "1",
    credentialTitle: "Bachelor of Computer Science",
    institution: "MIT",
    link: "https://academichain.com/verify/0x8f7d3a...",
    shortCode: "0x8f7d3a",
    createdAt: "2024-01-15T10:30:00Z",
    expiresAt: "2024-02-14T10:30:00Z",
    views: 3,
    uniqueViewers: 2,
    lastViewedAt: "2024-01-16T14:30:00Z",
    status: "active",
    settings: {
      requiresPassword: false,
      allowDownload: true,
      maxViews: null,
    },
  },
  {
    id: "share_2",
    credentialId: "2",
    credentialTitle: "Master of Data Science",
    institution: "Stanford University",
    link: "https://academichain.com/verify/0x1a2b3c...",
    shortCode: "0x1a2b3c",
    createdAt: "2024-01-10T09:15:00Z",
    expiresAt: "2024-02-09T09:15:00Z",
    views: 7,
    uniqueViewers: 5,
    lastViewedAt: "2024-01-17T11:20:00Z",
    status: "active",
    settings: {
      requiresPassword: true,
      allowDownload: false,
      maxViews: 10,
    },
  },
  {
    id: "share_3",
    credentialId: "3",
    credentialTitle: "AWS Solutions Architect",
    institution: "Amazon Web Services",
    link: "https://academichain.com/verify/0x2b3c4d...",
    shortCode: "0x2b3c4d",
    createdAt: "2024-01-05T14:45:00Z",
    expiresAt: "2024-01-19T14:45:00Z",
    views: 12,
    uniqueViewers: 8,
    lastViewedAt: "2024-01-18T09:45:00Z",
    status: "expired",
    settings: {
      requiresPassword: false,
      allowDownload: true,
      maxViews: null,
    },
  },
  {
    id: "share_4",
    credentialId: "4",
    credentialTitle: "Official Academic Transcript",
    institution: "MIT",
    link: "https://academichain.com/verify/0x3c4d5e...",
    shortCode: "0x3c4d5e",
    createdAt: "2024-01-18T16:20:00Z",
    expiresAt: null,
    views: 0,
    uniqueViewers: 0,
    lastViewedAt: null,
    status: "active",
    settings: {
      requiresPassword: false,
      allowDownload: true,
      maxViews: null,
    },
  },
];

export function SharedLinksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sharedLinks, setSharedLinks] = useState(mockSharedLinks);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [expiryDays, setExpiryDays] = useState("30");
  const { toast } = useToast();

  // Filter links based on search and status
  const filteredLinks = sharedLinks.filter((link) => {
    const matchesSearch =
      link.credentialTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.shortCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || link.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeLinks = sharedLinks.filter((l) => l.status === "active").length;
  const totalViews = sharedLinks.reduce((sum, l) => sum + l.views, 0);
  const expiringSoon = sharedLinks.filter((l) => {
    if (!l.expiresAt) return false;
    const daysLeft = Math.ceil(
      (new Date(l.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return daysLeft <= 3 && daysLeft > 0;
  }).length;

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Verification link copied to clipboard.",
    });
  };

  const revokeLink = (linkId: string) => {
    setSharedLinks((prev) =>
      prev.map((link) =>
        link.id === linkId ? { ...link, status: "revoked" } : link,
      ),
    );
    setDeleteDialogOpen(false);
    toast({
      title: "Link Revoked",
      description: "The share link has been revoked successfully.",
    });
  };

  const updateLinkSettings = (linkId: string, newExpiry: string) => {
    let expiresAt = null;
    if (newExpiry !== "never") {
      expiresAt = new Date(
        Date.now() + parseInt(newExpiry) * 24 * 60 * 60 * 1000,
      ).toISOString();
    }

    setSharedLinks((prev) =>
      prev.map((link) =>
        link.id === linkId ? { ...link, expiresAt, status: "active" } : link,
      ),
    );
    setEditDialogOpen(false);
    toast({
      title: "Link Updated",
      description: `Link settings have been updated.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "Active",
          className: "bg-success/10 text-success border-success/20",
          icon: CheckCircle2,
        };
      case "expired":
        return {
          label: "Expired",
          className: "bg-muted text-muted-foreground border-border",
          icon: Clock,
        };
      case "revoked":
        return {
          label: "Revoked",
          className: "bg-destructive/10 text-destructive border-destructive/20",
          icon: AlertCircle,
        };
      default:
        return {
          label: status,
          className: "bg-muted text-muted-foreground",
          icon: AlertCircle,
        };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Shared Links</h1>
            <p className="text-muted-foreground">
              Manage and track your shared credential links
            </p>
          </div>
          <Button className="gap-2">
            <Share2 className="h-4 w-4" />
            Create New Link
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Link2 className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{sharedLinks.length}</p>
                <p className="text-sm text-muted-foreground">Total Links</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{activeLinks}</p>
                <p className="text-sm text-muted-foreground">Active Links</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{totalViews}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{expiringSoon}</p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by credential, institution, or link..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Shared Links Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Credential</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-1">
                        No shared links found
                      </p>
                      <p className="text-sm">
                        {searchQuery
                          ? "Try adjusting your search filters"
                          : "Share a credential to create your first link"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLinks.map((link) => {
                    const status = getStatusBadge(link.status);
                    const StatusIcon = status.icon;
                    const credential = mockCredentials.find(
                      (c) => c.id === link.credentialId,
                    );

                    return (
                      <TableRow key={link.id} className="group">
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {link.credentialTitle}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {link.institution}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-muted-foreground">
                              {link.shortCode}...
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => copyLink(link.link)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(link.createdAt), "MMM d, yyyy")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistance(
                              new Date(link.createdAt),
                              new Date(),
                              { addSuffix: true },
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {link.expiresAt ? (
                            <div className="text-sm">
                              {format(new Date(link.expiresAt), "MMM d, yyyy")}
                            </div>
                          ) : (
                            <span className="text-sm">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Eye className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{link.views}</span>
                            <span className="text-xs text-muted-foreground">
                              ({link.uniqueViewers} unique)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status.className}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setSelectedLink(link);
                                setQrDialogOpen(true);
                              }}
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
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
                                    setSelectedLink(link);
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Clock className="h-4 w-4" />
                                  Extend Expiry
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="gap-2"
                                  onClick={() => copyLink(link.link)}
                                >
                                  <Copy className="h-4 w-4" />
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="gap-2"
                                  onClick={() =>
                                    window.open(link.link, "_blank")
                                  }
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Open Link
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="gap-2 text-destructive"
                                  onClick={() => {
                                    setSelectedLink(link);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Revoke Link
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* QR Code Dialog */}
        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Share QR Code
              </DialogTitle>
              <DialogDescription>
                Scan this QR code to verify the credential instantly.
              </DialogDescription>
            </DialogHeader>
            {selectedLink && (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-muted border">
                  <p className="font-medium">{selectedLink.credentialTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedLink.institution}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl border">
                  <div className="p-4 bg-white rounded-lg">
                    <QRCode
                      value={selectedLink.link}
                      size={200}
                      level="H"
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <Badge
                      variant={
                        selectedLink.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedLink.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {selectedLink.views} views • Expires{" "}
                      {selectedLink.expiresAt
                        ? format(
                            new Date(selectedLink.expiresAt),
                            "MMM d, yyyy",
                          )
                        : "never"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => {
                      const svg = document.querySelector("#qr-code");
                      // Download logic here
                      toast({
                        title: "QR Code Downloaded",
                        description: "QR code saved to your device",
                      });
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download QR
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => copyLink(selectedLink.link)}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Link Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Link Settings</DialogTitle>
              <DialogDescription>
                Extend the expiry date or modify link settings.
              </DialogDescription>
            </DialogHeader>
            {selectedLink && (
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Select value={expiryDays} onValueChange={setExpiryDays}>
                    <SelectTrigger id="expiry">
                      <SelectValue placeholder="Select expiry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      updateLinkSettings(selectedLink.id, expiryDays)
                    }
                  >
                    Update Link
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete/Revoke Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-destructive">
                Revoke Share Link
              </DialogTitle>
              <DialogDescription>
                This will permanently deactivate the link. Anyone with the link
                will no longer be able to verify the credential.
              </DialogDescription>
            </DialogHeader>
            {selectedLink && (
              <div className="py-4">
                <div className="p-4 rounded-lg bg-muted border">
                  <p className="font-medium">{selectedLink.credentialTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedLink.institution}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className={getStatusBadge(selectedLink.status).className}
                    >
                      {selectedLink.status}
                    </Badge>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => revokeLink(selectedLink.id)}
                  >
                    Revoke Link
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
