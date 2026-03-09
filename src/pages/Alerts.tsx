import { useState, useMemo } from "react";
import { Bell, MapPin, AlertTriangle, Clock, Filter, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import { useProximityAlerts } from "@/hooks/useProximityAlerts";
import { mockReports } from "@/data/mockReports";
import { CATEGORY_LABELS, ReportCategory } from "@/types/report";
import { formatDistanceToNow, format } from "date-fns";

interface AlertsProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

const severityColor = (category: ReportCategory) => {
  if (category === "safety") return "destructive";
  if (category === "health") return "destructive";
  return "secondary" as const;
};

const Alerts = ({ isAuthenticated = false, onLogout }: AlertsProps) => {
  const { allAlerts, settings, geolocation } = useProximityAlerts(mockReports);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredAlerts = useMemo(() => {
    if (categoryFilter === "all") return allAlerts;
    return allAlerts.filter((a) => a.report.category === categoryFilter);
  }, [allAlerts, categoryFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={isAuthenticated} onLogout={onLogout} />

      <main className="container py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              Proximity Alerts
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {settings.enabled
                ? `Monitoring hazards within ${settings.radius >= 1000 ? `${settings.radius / 1000}km` : `${settings.radius}m`} of your location`
                : "Enable proximity alerts on the Map page to start receiving notifications"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Card */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{allAlerts.length}</p>
                <p className="text-xs text-muted-foreground">Active Alerts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {settings.radius >= 1000 ? `${settings.radius / 1000}km` : `${settings.radius}m`}
                </p>
                <p className="text-xs text-muted-foreground">Alert Radius</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {settings.enabled ? "Active" : "Disabled"}
                </p>
                <p className="text-xs text-muted-foreground">Monitoring Status</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert List */}
        {!settings.enabled ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Alerts Not Enabled</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Go to the Map page and enable Proximity Alerts in the settings panel to start receiving notifications about nearby hazards.
              </p>
              <Button variant="default" className="mt-4" asChild>
                <a href="/map">Go to Map</a>
              </Button>
            </CardContent>
          </Card>
        ) : filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No Alerts</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {categoryFilter !== "all"
                  ? "No alerts match the selected filter."
                  : "No hazards detected within your alert radius. Stay safe!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <Card key={alert.report.id} className="transition-colors hover:bg-muted/30">
                <CardContent className="flex items-start gap-4 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 mt-0.5">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground leading-tight">
                        {alert.report.title}
                      </h3>
                      <Badge variant={severityColor(alert.report.category)} className="shrink-0">
                        {formatDistance(alert.distance)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {alert.report.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Badge variant="outline" className="text-xs">
                        {CATEGORY_LABELS[alert.report.category]}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alert.report.township}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(alert.report.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Privacy Note */}
        <p className="text-xs text-muted-foreground text-center pt-4">
          Your location is processed locally to determine proximity. No location data is stored or transmitted.
        </p>
      </main>
    </div>
  );
};

export default Alerts;
