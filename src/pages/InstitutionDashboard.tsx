import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Users,
  FileText,
  BarChart3,
  Plus,
  Search,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function InstitutionDashboard() {
  const { toast } = useToast();
  const [students] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@mit.edu",
      wallet: "0x742d...b045",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@mit.edu",
      wallet: "0x8f7d...e0f1",
      status: "active",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@mit.edu",
      wallet: "0x1a2b...2b3c",
      status: "pending",
    },
  ]);

  const handleUpload = () => {
    toast({
      title: "Upload credential",
      description: "This feature will be implemented with backend",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">🏛️ MIT Admin Portal</h1>
            <p className="text-muted-foreground">
              Issue and manage academic credentials
            </p>
          </div>
          <Button className="gap-2" onClick={handleUpload}>
            <Upload className="h-4 w-4" />
            Upload Credential
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Issued"
            value="15,432"
            icon={FileText}
            variant="primary"
          />
          <StatsCard
            title="Active Students"
            value="2,845"
            icon={Users}
            variant="success"
          />
          <StatsCard
            title="Today's Issues"
            value="23"
            icon={BarChart3}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Verified"
            value="99.8%"
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Student Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Student Management</h2>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Student
                  </Button>
                </div>

                <div className="mb-4 flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search students..." className="pl-10" />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {student.wallet}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              student.status === "active"
                                ? "bg-success/10 text-success"
                                : "bg-pending/10 text-pending"
                            }`}
                          >
                            {student.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Issue
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Bulk Upload
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Generate Reports
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Recent Issues</h3>
                <div className="space-y-4">
                  {[
                    {
                      student: "John Doe",
                      credential: "PhD Certificate",
                      time: "10:30 AM",
                    },
                    {
                      student: "Jane Smith",
                      credential: "Transcript",
                      time: "9:15 AM",
                    },
                    {
                      student: "CS101 Class",
                      credential: "150 Certificates",
                      time: "Yesterday",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.student}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.credential}
                        </p>
                      </div>
                      <div className="ml-auto text-xs text-muted-foreground">
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
