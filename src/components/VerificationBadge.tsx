import { CheckCircle2, Shield, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  size?: "sm" | "md" | "lg";
  showAnimation?: boolean;
  className?: string;
}

export function VerificationBadge({
  size = "md",
  showAnimation = true,
  className,
}: VerificationBadgeProps) {
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      {/* Outer ring with pulse animation */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-success/20",
          showAnimation && "animate-ping"
        )}
        style={{ animationDuration: "2s" }}
      />

      {/* Inner glowing circle */}
      <div className="absolute inset-2 rounded-full bg-gradient-success shadow-lg verified-glow" />

      {/* Checkmark icon */}
      <CheckCircle2
        className={cn(
          "relative text-success-foreground z-10",
          iconSizes[size],
          showAnimation && "verify-check"
        )}
      />
    </div>
  );
}

interface BlockchainBadgeProps {
  confirmations: number;
  className?: string;
}

export function BlockchainBadge({ confirmations, className }: BlockchainBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl bg-blockchain-light px-4 py-3",
        className
      )}
    >
      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blockchain text-primary-foreground">
        <Link2 className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">Blockchain Verified</p>
        <p className="text-xs text-muted-foreground">
          {confirmations.toLocaleString()} block confirmations
        </p>
      </div>
    </div>
  );
}

interface TrustBadgeProps {
  institution: string;
  verified?: boolean;
  className?: string;
}

export function TrustBadge({ institution, verified = true, className }: TrustBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center h-10 w-10 rounded-lg",
          verified ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
        )}
      >
        <Shield className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{institution}</p>
        <p className="text-xs text-muted-foreground">
          {verified ? "Verified Issuer" : "Unverified Issuer"}
        </p>
      </div>
    </div>
  );
}
