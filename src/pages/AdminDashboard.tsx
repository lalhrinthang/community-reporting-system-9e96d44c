import { useState, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Archive,
  Trash2,
  Map,
  Table,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import YangonMap from "@/components/map/YangonMap";
import { mockReports } from "@/data/mockReports";
import { Report, CATEGORY_LABELS, ReportStatus } from "@/types/report";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";

interface AdminDashboardProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const AdminDashboard = ({ isAuthenticated, onLogout }: AdminDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "map">("table");
  const [reports, setReports] = useState<Report[]>(mockReports);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !report.title.toLowerCase().includes(query) &&
          !report.township.toLowerCase().includes(query) &&
          !report.description.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && report.status !== statusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== "all" && report.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [reports, searchQuery, statusFilter, categoryFilter]);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      active: reports.filter((r) => r.status === "active").length,
      verified: reports.filter((r) => r.status === "verified").length,
      archived: reports.filter((r) => r.status === "archived").length,
    };
  }, [reports]);

  const handleStatusChange = (reportId: string, newStatus: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: newStatus, updatedAt: new Date().toISOString() }
          : r
      )
    );
    toast.success(`Report status updated to ${newStatus}`);
  };

  const handleArchive = (reportId: string) => {
    handleStatusChange(reportId, "archived");
  };

  const handleDelete = (reportId: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    toast.success("Report deleted");
  };

  const getStatusBadgeVariant = (status: Report["status"]) => {
    switch (status) {
      case "active":
        return "destructive";
      case "verified":
        return "default";
      case "archived":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Layout isAuthenticated={isAuthenticated} onLogout={onLogout}>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage and review community safety reports
            </p>
          </div>
          <Link to="/admin/new-report">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Report
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-bold">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/20">
                <CheckCircle className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-xl font-bold">{stats.verified}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Archived</p>
                <p className="text-xl font-bold">{stats.archived}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Toggle & Content */}
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as "table" | "map")}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredReports.length} of {reports.length} reports
            </p>
            <TabsList>
              <TabsTrigger value="table" className="gap-2">
                <Table className="h-4 w-4" />
                Table
              </TabsTrigger>
              <TabsTrigger value="map" className="gap-2">
                <Map className="h-4 w-4" />
                Map
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="table" className="mt-0">
            <Card>
              <div className="overflow-x-auto">
                <UITable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Township</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.slice(0, 20).map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="max-w-[200px] truncate font-medium">
                          {report.title}
                        </TableCell>
                        <TableCell>{report.township}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {CATEGORY_LABELS[report.category]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(report.status)}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(report.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Eye className="h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit Report
                              </DropdownMenuItem>
                              {report.status !== "verified" && (
                                <DropdownMenuItem
                                  className="gap-2"
                                  onClick={() =>
                                    handleStatusChange(report.id, "verified")
                                  }
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Mark Verified
                                </DropdownMenuItem>
                              )}
                              {report.status !== "archived" && (
                                <DropdownMenuItem
                                  className="gap-2"
                                  onClick={() => handleArchive(report.id)}
                                >
                                  <Archive className="h-4 w-4" />
                                  Archive
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="gap-2 text-destructive focus:text-destructive"
                                onClick={() => handleDelete(report.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredReports.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-12 text-center text-muted-foreground"
                        >
                          No reports found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </UITable>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="mt-0">
            <Card className="overflow-hidden">
              <div className="h-[500px]">
                <YangonMap reports={filteredReports} />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
