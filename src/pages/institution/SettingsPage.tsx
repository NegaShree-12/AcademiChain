import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Mail,
  Wallet,
  Bell,
  Shield,
  Globe,
  Copy,
  CheckCircle2,
  AlertCircle,
  Save,
  Key,
  Users,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InstitutionSettings {
  name: string;
  email: string;
  website: string;
  walletAddress: string;
  contractAddress: string;
  description: string;
}

interface NotificationSettings {
  emailVerifications: boolean;
  credentialIssued: boolean;
  credentialVerified: boolean;
  weeklyReports: boolean;
  securityAlerts: boolean;
}

export function InstitutionSettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Institution settings
  const [settings, setSettings] = useState<InstitutionSettings>({
    name: "Massachusetts Institute of Technology",
    email: "admin@mit.edu",
    website: "https://mit.edu",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45",
    contractAddress: "0xB6bBF827561e9004b6120B3777E6B8343EeF73c8",
    description:
      "World-leading institution in science and technology education.",
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailVerifications: true,
    credentialIssued: true,
    credentialVerified: true,
    weeklyReports: false,
    securityAlerts: true,
  });

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description,
    });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Settings Saved",
      description: "Your changes have been updated successfully.",
    });

    setIsSaving(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your institution profile and preferences
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{settings.name}</h2>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-success/10 text-success"
                    >
                      Verified Institution
                    </Badge>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Institution Name</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={(e) =>
                        setSettings({ ...settings, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) =>
                        setSettings({ ...settings, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={settings.website}
                      onChange={(e) =>
                        setSettings({ ...settings, website: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={settings.description}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
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
                      Receive email when credentials are verified
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
                    <Label className="text-base">Credential Issued</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new credentials are issued
                    </p>
                  </div>
                  <Switch
                    checked={notifications.credentialIssued}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        credentialIssued: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label className="text-base">Credential Verified</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when credentials are verified by third parties
                    </p>
                  </div>
                  <Switch
                    checked={notifications.credentialVerified}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        credentialVerified: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summary of activities
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        weeklyReports: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="space-y-0.5">
                    <Label className="text-base">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Important security notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.securityAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        securityAlerts: checked,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blockchain Tab */}
        <TabsContent value="blockchain" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Blockchain Configuration
              </h2>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <h3 className="font-medium">Network Status</h3>
                      <p className="text-sm text-muted-foreground">
                        Connected to Sepolia Testnet
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Wallet Address
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm font-mono bg-background p-2 rounded flex-1">
                          {settings.walletAddress}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() =>
                            copyToClipboard(
                              settings.walletAddress,
                              "Wallet address copied",
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Contract Address
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm font-mono bg-background p-2 rounded flex-1">
                          {settings.contractAddress}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() =>
                            copyToClipboard(
                              settings.contractAddress,
                              "Contract address copied",
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="p-3 rounded-lg bg-background border">
                        <p className="text-xs text-muted-foreground">Network</p>
                        <p className="font-medium">Sepolia</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background border">
                        <p className="text-xs text-muted-foreground">
                          Chain ID
                        </p>
                        <p className="font-medium">11155111</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background border">
                        <p className="text-xs text-muted-foreground">
                          Gas Price
                        </p>
                        <p className="font-medium">12.5 Gwei</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background border">
                        <p className="text-xs text-muted-foreground">
                          Block Height
                        </p>
                        <p className="font-medium">19,543,210</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-primary mb-1">
                        Network Information
                      </h4>
                      <p className="text-sm text-primary/80">
                        Make sure you have sufficient Sepolia ETH in your wallet
                        for gas fees. You can get free test ETH from Sepolia
                        faucets.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
