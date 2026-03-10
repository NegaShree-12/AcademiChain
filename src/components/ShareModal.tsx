// frontend/src/components/ShareModal.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { Copy, Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credentialId: string;
  shareUrl: string;
}

export function ShareModal({ open, onOpenChange, credentialId, shareUrl }: ShareModalProps) {
  const { toast } = useToast();

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Copied!", description: "Share link copied to clipboard" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Share Credential</h3>
            <p className="text-sm text-muted-foreground">
              Scan QR code or copy link to verify
            </p>
          </div>

          <div className="flex justify-center p-6 bg-white rounded-xl">
            <QRCode
              value={shareUrl}
              size={200}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium">Share Link</p>
            <div className="flex gap-2">
              <code className="flex-1 text-xs bg-muted p-2 rounded truncate">
                {shareUrl}
              </code>
              <Button size="sm" variant="outline" onClick={copyLink}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => window.open(shareUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}