import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, QrCode, Download, Calendar, Shield } from "lucide-react";
import QRCode from "qrcode.react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credential: {
    id: string;
    title: string;
    institution: string;
    txHash: string;
  };
}

export function ShareDialog({
  open,
  onOpenChange,
  credential,
}: ShareDialogProps) {
  const { toast } = useToast();
  const [expiry, setExpiry] = useState("30");

  const verificationUrl = `https://academichain.io/verify/${credential.txHash.slice(0, 16)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    toast({
      title: "Link copied",
      description: "Verification link copied to clipboard",
    });
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${credential.title.replace(/\s+/g, "-")}-qr.png`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share "{credential.title}"</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Verification Link */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Verification Link
            </label>
            <div className="flex gap-2">
              <Input
                value={verificationUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={copyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Security Settings</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Link expires in</span>
              <select
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>

          {/* QR Code */}
          <div className="border rounded-lg p-4 flex flex-col items-center">
            <QRCode
              id="qr-code"
              value={verificationUrl}
              size={160}
              level="H"
              includeMargin
            />
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 gap-2"
              onClick={downloadQR}
            >
              <Download className="h-4 w-4" />
              Download QR Code
            </Button>
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1 gap-2">
              <QrCode className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
