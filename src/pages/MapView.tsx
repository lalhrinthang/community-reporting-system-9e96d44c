import { useState, useMemo } from "react";
import { Filter, X, Info, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import YangonMap from "@/components/map/YangonMap";
import { mockReports } from "@/data/mockReports";
import { Report, CATEGORY_LABELS, ReportCategory } from "@/types/report";
import { formatDistanceToNow } from "date-fns";

interface MapViewProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const MapView = ({ isAuthenticated, onLogout }: MapViewProps) => {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filteredReports = useMemo(() => {
    return mockReports.filter((report) => {
      // Category filter
      if (categoryFilter !== "all" && report.category !== categoryFilter) {
        return false;
      }

      // Time filter
      if (timeFilter !== "all") {
        const reportDate = new Date(report.createdAt);
        const now = new Date();
        const daysDiff = Math.floor(
          (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        switch (timeFilter) {
          case "7days":
            if (daysDiff > 7) return false;
            break;
          case "30days":
            if (daysDiff > 30) return false;
            break;
          case "90days":
            if (daysDiff > 90) return false;
            break;
        }
      }

      return true;
    });
  }, [categoryFilter, timeFilter]);

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
  };

  const getStatusBadgeVariant = (status: Report["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "verified":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Layout isAuthenticated={isAuthenticated} onLogout={onLogout}>
      <div className="relative h-[calc(100vh-64px-80px)] md:h-[calc(100vh-64px)]">
        {/* Filter Controls */}
        <div className="absolute left-4 right-4 top-4 z-10 flex items-center gap-2 md:left-auto md:right-4 md:w-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2 shadow-md">
                <Filter className="h-4 w-4" />
                Filters
                {(categoryFilter !== "all" || timeFilter !== "all") && (
                  <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    !
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Filter Reports</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Range</label>
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setCategoryFilter("all");
                    setTimeFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="rounded-lg bg-card px-3 py-2 text-sm shadow-md">
            <span className="font-medium">{filteredReports.length}</span>{" "}
            <span className="text-muted-foreground">reports</span>
          </div>
        </div>

        {/* Map */}
        <YangonMap
          reports={filteredReports}
          onReportClick={handleReportClick}
          className="h-full w-full"
        />

        {/* Report Detail Card */}
        {selectedReport && (
          <Card className="absolute bottom-4 left-4 right-4 z-10 md:bottom-8 md:left-auto md:right-8 md:w-96">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{selectedReport.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setSelectedReport(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{selectedReport.township}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(selectedReport.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedReport.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {CATEGORY_LABELS[selectedReport.category]}
                </Badge>
                <Badge variant={getStatusBadgeVariant(selectedReport.status)}>
                  {selectedReport.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 hidden rounded-lg bg-card/95 p-3 shadow-md backdrop-blur md:block">
          <div className="mb-2 flex items-center gap-1 text-xs font-medium">
            <Info className="h-3 w-3" />
            Legend
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full border border-border"
                  style={{
                    backgroundColor: `hsl(var(--chart-${
                      Object.keys(CATEGORY_LABELS).indexOf(key) + 1
                    }))`,
                  }}
                />
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapView;
