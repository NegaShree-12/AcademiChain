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
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelectRole = async () => {
    if (!selectedRole) return;

    try {
      // Update user with selected role
      updateUser({ role: selectedRole });

      // DIRECT localStorage update to ensure it's set
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.role = selectedRole;
        localStorage.setItem("user", JSON.stringify(user));

        // Log to verify
        console.log("✅ Role updated in localStorage:", user);
      }

      toast({
        title: "Role Selected",
        description: `You are now logged in as a ${selectedRole}`,
      });

      // Close dialog
      onOpenChange(false);

      // Small delay to ensure state updates
      setTimeout(() => {
        // Redirect based on role
        switch (selectedRole) {
          case "student":
            navigate("/student", { replace: true });
            break;
          case "institution":
            navigate("/institution", { replace: true });
            break;
          case "verifier":
            navigate("/verifier", { replace: true });
            break;
        }
      }, 100);
    } catch (error) {
      console.error("Failed to set role:", error);
      toast({
        title: "Error",
        description: "Failed to set role",
        variant: "destructive",
      });
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelectRole} disabled={!selectedRole}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
