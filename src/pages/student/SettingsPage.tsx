import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Wallet,
  Bell,
  Shield,
  Moon,
  Globe,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMetaMask } from "@/hooks/useMetaMask";
import { useNavigate } from "react-router-dom";

export function SettingsPage() {
  const { user, logout, updateUser } = useAuth();
  const { account, disconnect } = useMetaMask();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form state
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    institution: user?.institution || "",
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailVerifications: true,
    shareLinkViews: true,
    newCredentials: true,
    verificationRequests: false,
    marketingEmails: false,
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: "system",
    compactMode: false,
    animations: true,
  });

  const copyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Update user profile
      updateUser({
        name: profile.name,
        email: profile.email,
        institution: profile.institution,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      disconnect();
      logout();
      navigate("/");
      toast({
        title: "Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {user?.name?.charAt(0) ||
                        user?.walletAddress?.slice(2, 4) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {user?.name || "User"}
                    </h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {user?.role || "student"}
                      </Badge>
                      <span>•</span>
                      <span>Joined {new Date().toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                          }
                          className="pl-10"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        className="pl-10"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {user?.role === "student" && (
                    <div className="grid gap-2">
                      <Label htmlFor="institution">
                        Institution / University
                      </Label>
                      <Input
                        id="institution"
                        value={profile.institution}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            institution: e.target.value,
                          })
                        }
                        placeholder="e.g., MIT, Stanford"
                      />
                    </div>
                  )}

                  <div className="pt-4 flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-destructive mb-1">
                      Delete Account
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Wallet Connection
                </h2>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        <span className="font-medium">Connected Wallet</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-success/10 text-success border-success/20"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <code className="font-mono text-sm bg-background p-2 rounded flex-1">
                        {user?.walletAddress || account}
                      </code>
                      <Button variant="ghost" size="icon" onClick={copyAddress}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>
                        Network:{" "}
                        <span className="font-medium text-foreground">
                          Sepolia Testnet
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-warning mb-1">
                          Switch Networks
                        </h4>
                        <p className="text-sm text-warning/80">
                          Make sure you're connected to Sepolia testnet for
                          credential verification.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      variant="outline"
                      className="gap-2 text-destructive hover:text-destructive"
                      onClick={handleDisconnectWallet}
                    >
                      <LogOut className="h-4 w-4" />
                      Disconnect Wallet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Verifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email when your credentials are verified
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailVerifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          emailVerifications: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-0.5">
                      <Label className="text-base">Share Link Views</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone views your shared credentials
                      </p>
                    </div>
                    <Switch
                      checked={notifications.shareLinkViews}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          shareLinkViews: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-0.5">
                      <Label className="text-base">New Credentials</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert me when new credentials are issued to me
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newCredentials}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          newCredentials: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-0.5">
                      <Label className="text-base">Verification Requests</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify me when employers request verification
                      </p>
                    </div>
                    <Switch
                      checked={notifications.verificationRequests}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          verificationRequests: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label className="text-base">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features and offers
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          marketingEmails: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Appearance Settings
                </h2>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={appearance.theme}
                      onValueChange={(value) =>
                        setAppearance({ ...appearance, theme: value })
                      }
                    >
                      <SelectTrigger id="theme" className="w-full md:w-[200px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-0.5">
                      <Label className="text-base">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use compact layout for denser information display
                      </p>
                    </div>
                    <Switch
                      checked={appearance.compactMode}
                      onCheckedChange={(checked) =>
                        setAppearance({ ...appearance, compactMode: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label className="text-base">Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable smooth animations and transitions
                      </p>
                    </div>
                    <Switch
                      checked={appearance.animations}
                      onCheckedChange={(checked) =>
                        setAppearance({ ...appearance, animations: checked })
                      }
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Button>Save Appearance</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
