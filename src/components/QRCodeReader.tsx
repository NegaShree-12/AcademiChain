// In QRCodeReader.tsx - Update the onScanSuccess handler

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Camera, Upload, X, Loader2, Link2 } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { useToast } from "@/hooks/use-toast";
import { jsQR } from "jsqr";

interface QRCodeReaderProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

export function QRCodeReader({
  onScanSuccess,
  onScanError,
}: QRCodeReaderProps) {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualShareId, setManualShareId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const cameraContainerRef = useRef<HTMLDivElement>(null);

  const startCameraScan = async () => {
    setShowCamera(true);
    setIsScanning(true);

    setTimeout(async () => {
      if (!cameraContainerRef.current) {
        console.error("Camera container not found");
        return;
      }

      try {
        const scanner = new Html5Qrcode("qr-reader-camera");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText) => {
            console.log("✅ Raw QR code data:", decodedText);

            // Stop scanning immediately
            scanner.stop().catch(() => {});
            setShowCamera(false);
            setIsScanning(false);

            // IMPORTANT: Pass the EXACT decoded text to the parent
            // Don't modify it - let the parent component handle parsing
            onScanSuccess(decodedText);

            toast({
              title: "✅ QR Code Scanned",
              description: "Successfully read QR code",
            });
          },
          (errorMessage) => {
            console.debug("QR scan error:", errorMessage);
          },
        );
      } catch (error) {
        console.error("Failed to start camera:", error);
        toast({
          title: "Camera Error",
          description: "Could not access camera. Please check permissions.",
          variant: "destructive",
        });
        setShowCamera(false);
        setIsScanning(false);
      }
    }, 100);
  };

  const stopCameraScan = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setShowCamera(false);
    setIsScanning(false);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Try multiple QR reading methods
      let decodedText: string | null = null;

      // Method 1: Try with html5-qrcode
      try {
        const tempDivId = `qr-reader-temp-${Date.now()}`;
        const tempDiv = document.createElement("div");
        tempDiv.id = tempDivId;
        tempDiv.style.display = "none";
        document.body.appendChild(tempDiv);

        const html5QrCode = new Html5Qrcode(tempDivId);
        decodedText = await html5QrCode.scanFile(file, true);
        await html5QrCode.stop().catch(() => {});
        document.body.removeChild(tempDiv);
      } catch (e) {
        console.log("html5-qrcode failed, trying alternative method");
      }

      // Method 2: If html5-qrcode failed, try with canvas approach
      if (!decodedText) {
        decodedText = await readQRFromImage(file);
      }

      // Method 3: Check if filename contains share ID
      if (!decodedText) {
        const shareIdMatch = file.name.match(
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
        );
        if (shareIdMatch) {
          decodedText = `https://localhost:3000/verify?shareId=${shareIdMatch[0]}`;
        }
      }

      if (decodedText) {
        console.log("✅ Extracted QR data:", decodedText);
        // Pass the EXACT decoded text
        onScanSuccess(decodedText);
        toast({
          title: "✅ QR Code Read",
          description: "Successfully read QR code from image",
        });
        setSelectedImage(null);
      } else {
        setShowManualEntry(true);
        toast({
          title: "QR Code Not Detected",
          description:
            "Could not read QR code. You can enter the share ID manually below.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error reading QR code:", error);
      toast({
        title: "Error",
        description:
          "Could not read QR code from image. Please try a clearer image.",
        variant: "destructive",
      });
      setShowManualEntry(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Alternative QR code reader using jsQR (more reliable for images)
  const readQRFromImage = async (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          // Get image data
          const imageData = ctx?.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          );
          if (!imageData) {
            reject("Failed to get image data");
            return;
          }

          // Try to decode QR code
          try {
            if (typeof jsQR === "function") {
              const code = jsQR(imageData.data, canvas.width, canvas.height);
              if (code) {
                resolve(code.data);
                return;
              }
            }
            resolve(null);
          } catch (error) {
            reject(error);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleManualSubmit = () => {
    if (manualShareId.trim()) {
      // Pass the exact manual entry
      onScanSuccess(manualShareId);
      setShowManualEntry(false);
      setManualShareId("");
      toast({
        title: "✅ Manual Entry",
        description: "Share ID submitted for verification",
      });
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setShowManualEntry(false);
    setManualShareId("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {!showCamera && !selectedImage && !showManualEntry && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={startCameraScan}
                className="gap-2"
                disabled={isScanning}
              >
                <Camera className="h-4 w-4" />
                Use Camera
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
                disabled={isScanning}
              >
                <Upload className="h-4 w-4" />
                Upload QR
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowManualEntry(true)}
                className="gap-2"
              >
                <Link2 className="h-4 w-4" />
                Enter Manually
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      )}

      {showManualEntry && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Enter Share ID Manually</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowManualEntry(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter share ID or full URL"
              value={manualShareId}
              onChange={(e) => setManualShareId(e.target.value)}
            />
            <Button
              onClick={handleManualSubmit}
              disabled={!manualShareId.trim()}
            >
              Submit
            </Button>
          </div>
        </Card>
      )}

      {showCamera && (
        <Card className="p-4">
          <div className="flex justify-end mb-2">
            <Button variant="ghost" size="icon" onClick={stopCameraScan}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div
            id="qr-reader-camera"
            ref={cameraContainerRef}
            className="w-full aspect-square bg-black/5 rounded-lg"
          ></div>
          <p className="text-sm text-center mt-2 text-muted-foreground">
            Position QR code within the frame
          </p>
        </Card>
      )}

      {selectedImage && (
        <Card className="p-4">
          <div className="flex justify-end mb-2">
            <Button variant="ghost" size="icon" onClick={clearImage}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center">
            <img
              src={selectedImage}
              alt="Uploaded QR"
              className="max-h-64 rounded-lg border"
            />
          </div>
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Reading QR code...</span>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
