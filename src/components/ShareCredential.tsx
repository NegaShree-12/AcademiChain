// frontend/src/components/ShareCredentialModal.tsx

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Copy,
  Download,
  QrCode,
  Link2,
  Share2,
  ExternalLink,
  Wallet,
  Calendar,
  Award,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";
import { studentAPI } from "@/lib/api";

interface ShareCredentialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credential: {
    id: string;
    title: string;
    studentName: string;
    institutionName: string;
    issueDate: string;
    credentialType: string;
    blockchainTxHash: string;
  };
}

export function ShareCredentialModal({
  open,
  onOpenChange,
  credential,
}: ShareCredentialModalProps) {
  const { toast } = useToast();
  const [shareLink, setShareLink] = useState("");
  const [expiryDays, setExpiryDays] = useState("7");
  const [shareType, setShareType] = useState("public");
  const [maxAccess, setMaxAccess] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrValue, setQrValue] = useState("");

  // Generate share link via API
  // In ShareCredentialModal.tsx - update the generateShareLink function

  // In ShareCredentialModal.tsx - Update the generateShareLink function

  const generateShareLink = async () => {
    setIsGenerating(true);
    try {
      // Call the backend API to create a share link
      const response = await studentAPI.generateShareLink(credential.id, {
        shareType,
        expiresInDays: parseInt(expiryDays),
        maxAccess: maxAccess ? parseInt(maxAccess) : undefined,
      });

      console.log("Share link response:", response.data);

      // This should return a URL with the shareId that maps to this specific credential
      const shareUrl = response.data.data.shareUrl;
      setShareLink(shareUrl);

      // IMPORTANT: Generate QR code with the FULL URL including shareId
      // The URL should be something like: https://yourapp.com/verify?shareId=abc-123
      setQrValue(shareUrl);

      toast({
        title: "✅ Share Link Generated",
        description: "Your credential is ready to share",
      });
    } catch (error: any) {
      console.error("Error generating share link:", error);
      toast({
        title: "❌ Error",
        description:
          error.response?.data?.message || "Failed to generate share link",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  // Copy to clipboard
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "✅ Copied!",
      description: message,
    });
  };

  // Download QR code
  const downloadQRCode = () => {
    const svg = document.getElementById("share-qr-code");
    if (!svg) return;

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
      downloadLink.download = `credential-${credential.id}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast({
        title: "✅ QR Code Downloaded",
        description: "QR code saved to your device",
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // Share on social media
  const shareOnSocial = (platform: string) => {
    const text = `🎓 Verify my ${credential.title} from ${credential.institutionName} on the blockchain!`;
    const hashtags = "Blockchain,AcademicCredentials,Verification";

    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}&hashtags=${hashtags}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(text + " " + shareLink)}`;
        break;
      case "telegram":
        url = `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(text)}`;
        break;
      case "email":
        url = `mailto:?subject=${encodeURIComponent(`Verify my ${credential.title}`)}&body=${encodeURIComponent(text + "\n\n" + shareLink)}`;
        break;
    }

    if (url) {
      window.open(url, "_blank");
      toast({
        title: "✅ Shared",
        description: `Opening ${platform}...`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Share2 className="h-5 w-5 text-primary" />
            Share Credential
          </DialogTitle>
          <DialogDescription>
            Share your verified credential with employers, institutions, or
            anyone
          </DialogDescription>
        </DialogHeader>

        {/* Credential Preview */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{credential.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {credential.institutionName}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(credential.issueDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wallet className="h-3 w-3" />
                    {credential.studentName}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-2 py-1 bg-success/10 text-success text-xs rounded-full border border-success/20">
              Blockchain Verified
            </div>
          </div>
        </div>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link" className="gap-2">
              <Link2 className="h-4 w-4" />
              Share Link
            </TabsTrigger>
            <TabsTrigger value="qr" className="gap-2">
              <QrCode className="h-4 w-4" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Share2 className="h-4 w-4" />
              Social Media
            </TabsTrigger>
          </TabsList>

          {/* Link Tab */}
          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expires In</Label>
                  <Select value={expiryDays} onValueChange={setExpiryDays}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expiry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never expires</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Access Type</Label>
                  <Select value={shareType} onValueChange={setShareType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="one-time">One-time access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Max Accesses (Optional)</Label>
                <Input
                  type="number"
                  placeholder="Leave empty for unlimited"
                  value={maxAccess}
                  onChange={(e) => setMaxAccess(e.target.value)}
                  min="1"
                />
              </div>
              <Button
                onClick={generateShareLink}
                disabled={isGenerating}
                className="w-full gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" />
                    Generate Share Link
                  </>
                )}
              </Button>
              // In the return statement, after the QR code is generated:
              {shareLink && (
                <div className="space-y-2">
                  <Label>Shareable Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={shareLink}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        copyToClipboard(shareLink, "Link copied to clipboard")
                      }
                      title="Copy link"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(shareLink, "_blank")}
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Anyone with this link can verify your credential
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="space-y-4 mt-4">
            {!qrValue ? (
              <div className="text-center py-8">
                <Button onClick={generateShareLink} className="gap-2">
                  <QrCode className="h-4 w-4" />
                  Generate QR Code
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center p-6 bg-white rounded-xl border">
                  <QRCode
                    id="share-qr-code"
                    value={qrValue}
                    size={200}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={downloadQRCode}
                  >
                    <Download className="h-4 w-4" />
                    Download QR
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => window.open(qrValue, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Preview
                  </Button>
                </div>

                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-xs text-primary text-center">
                    Scan this QR code to instantly verify the credential
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-4 mt-4">
            {!shareLink ? (
              <div className="text-center py-8">
                <Button onClick={generateShareLink} className="gap-2">
                  <Link2 className="h-4 w-4" />
                  Generate Link First
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="gap-2 h-12"
                    onClick={() => shareOnSocial("twitter")}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 h-12"
                    onClick={() => shareOnSocial("linkedin")}
                  >
                    <Linkedin className="h-5 w-5" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 h-12"
                    onClick={() => shareOnSocial("facebook")}
                  >
                    <Facebook className="h-5 w-5" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 h-12"
                    onClick={() => shareOnSocial("whatsapp")}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.677-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
                    </svg>
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 h-12"
                    onClick={() => shareOnSocial("telegram")}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.941z" />
                    </svg>
                    Telegram
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 h-12 col-span-2"
                    onClick={() => shareOnSocial("email")}
                  >
                    <Mail className="h-5 w-5" />
                    Email
                  </Button>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground text-center">
                    Share your credential link on social media. Employers can
                    verify instantly!
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {shareLink && (
            <Button
              onClick={() => window.open(shareLink, "_blank")}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Verification Page
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
