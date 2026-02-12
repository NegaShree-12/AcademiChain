import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GraduationCap, Building, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface RoleSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletAddress: string;
}

export function RoleSelector({
  open,
  onOpenChange,
  walletAddress,
}: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<
    "student" | "institution" | "verifier" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserRole } = useAuth();
  const { toast } = useToast();

  const handleSelectRole = async () => {
    if (!selectedRole) return;

    try {
      setIsLoading(true);
      console.log("🎭 Selecting role:", selectedRole);

      // Call API to update role in MongoDB
      const result = await updateUserRole(selectedRole);
      console.log("🎭 Role update result:", result);

      toast({
        title: "✅ Role Selected",
        description: `You are now logged in as a ${selectedRole}`,
      });

      // Close dialog
      onOpenChange(false);

      // 🔧 CRITICAL FIX: Force a complete page reload to the role-specific URL
      // This ensures everything re-initializes with the new role
      setTimeout(() => {
        console.log("🔄 Forcing hard reload to:", `/${selectedRole}`);
        window.location.href = `/${selectedRole}`;
      }, 500);
    } catch (error: any) {
      console.error("❌ Failed to set role:", error);
      toast({
        title: "❌ Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to set role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to AcademiChain!</DialogTitle>
          <DialogDescription>
            Please select your role to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Button
            variant={selectedRole === "student" ? "default" : "outline"}
            className="w-full justify-start gap-4 h-auto py-4"
            onClick={() => setSelectedRole("student")}
            disabled={isLoading}
          >
            <GraduationCap className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">I am a Student</div>
              <div className="text-xs text-muted-foreground">
                View and share your academic credentials
              </div>
            </div>
          </Button>
          <Button
            variant={selectedRole === "institution" ? "default" : "outline"}
            className="w-full justify-start gap-4 h-auto py-4"
            onClick={() => setSelectedRole("institution")}
            disabled={isLoading}
          >
            <Building className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">I am an Institution</div>
              <div className="text-xs text-muted-foreground">
                Issue and manage credentials for students
              </div>
            </div>
          </Button>
          <Button
            variant={selectedRole === "verifier" ? "default" : "outline"}
            className="w-full justify-start gap-4 h-auto py-4"
            onClick={() => setSelectedRole("verifier")}
            disabled={isLoading}
          >
            <Shield className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">I am a Verifier</div>
              <div className="text-xs text-muted-foreground">
                Verify credentials for hiring or admissions
              </div>
            </div>
          </Button>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSelectRole}
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
