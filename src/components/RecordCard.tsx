import { Credential } from "@/types/credential";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Award,
  FileText,
  ScrollText,
  Eye,
  Share2,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordCardProps {
  credential: Credential;
  onView?: () => void;
  onShare?: () => void;
}

const typeIcons = {
  degree: GraduationCap,
  certificate: Award,
  transcript: FileText,
  diploma: ScrollText,
};

const typeColors = {
  degree: "bg-primary/10 text-primary",
  certificate: "bg-amber-500/10 text-amber-600",
  transcript: "bg-emerald-500/10 text-emerald-600",
  diploma: "bg-purple-500/10 text-purple-600",
};

const statusConfig = {
  verified: {
    icon: CheckCircle2,
    label: "Verified",
    className: "bg-success/10 text-success border-success/20",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    className: "bg-pending/10 text-pending border-pending/20",
  },
  revoked: {
    icon: AlertCircle,
    label: "Revoked",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function RecordCard({ credential, onView, onShare }: RecordCardProps) {
  const Icon = typeIcons[credential.type];
  const status = statusConfig[credential.status];
  const StatusIcon = status.icon;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <Card className="group card-hover overflow-hidden border-border/50 bg-card">
      <CardContent className="p-0">
        {/* Header with type icon */}
        <div className="relative p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className={cn("rounded-xl p-3", typeColors[credential.type])}>
              <Icon className="h-6 w-6" />
            </div>
            <Badge variant="outline" className={cn("gap-1", status.className)}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
          </div>

          {/* Title and institution */}
          <div className="mt-4 space-y-1">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
              {credential.title}
            </h3>
            <p className="text-sm text-muted-foreground">{credential.institution}</p>
          </div>

          {/* Issue date */}
          <p className="mt-2 text-xs text-muted-foreground">
            Issued on {formatDate(credential.issueDate)}
          </p>
        </div>

        {/* Transaction info */}
        <div className="border-t border-border/50 bg-muted/30 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Transaction Hash</p>
              <p className="font-mono text-xs text-hash">
                {truncateHash(credential.txHash)}
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xs text-muted-foreground">Block</p>
              <p className="font-mono text-xs text-hash">
                #{credential.blockNumber.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex border-t border-border/50">
          <Button
            variant="ghost"
            className="flex-1 rounded-none h-12 gap-2 text-muted-foreground hover:text-foreground"
            onClick={onView}
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          <div className="w-px bg-border/50" />
          <Button
            variant="ghost"
            className="flex-1 rounded-none h-12 gap-2 text-muted-foreground hover:text-foreground"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <div className="w-px bg-border/50" />
          <Button
            variant="ghost"
            className="flex-1 rounded-none h-12 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            Verify
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
