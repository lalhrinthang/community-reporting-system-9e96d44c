import { AlertTriangle, X, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProximityAlert } from "@/hooks/useProximityAlerts";
import { CATEGORY_LABELS } from "@/types/report";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProximityAlertBannerProps {
  alerts: ProximityAlert[];
  onDismiss: (reportId: string) => void;
  onDismissAll: () => void;
  onAlertClick?: (alert: ProximityAlert) => void;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

const ProximityAlertBanner = ({
  alerts,
  onDismiss,
  onDismissAll,
  onAlertClick,
}: ProximityAlertBannerProps) => {
  const [expanded, setExpanded] = useState(false);

  if (alerts.length === 0) return null;

  const topAlert = alerts[0];

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/10 shadow-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <AlertTriangle className="h-5 w-5 text-destructive shrink-0 animate-pulse" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            ⚠️ {alerts.length === 1 ? "Nearby Hazard Alert" : `${alerts.length} Nearby Hazards`}
          </p>
          {!expanded && (
            <p className="text-xs text-muted-foreground truncate">
              {topAlert.report.title} — {formatDistance(topAlert.distance)} away
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onDismissAll(); }}>
            <X className="h-4 w-4" />
          </Button>
          {alerts.length > 1 && (
            expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Alert List */}
      {expanded && (
        <div className="border-t border-destructive/20 max-h-60 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.report.id}
              className="flex items-start gap-3 px-4 py-3 border-b border-destructive/10 last:border-b-0 hover:bg-destructive/5 cursor-pointer transition-colors"
              onClick={() => onAlertClick?.(alert)}
            >
              <MapPin className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {alert.report.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {CATEGORY_LABELS[alert.report.category]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistance(alert.distance)} away
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · {alert.report.township}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Reported {formatDistanceToNow(new Date(alert.report.createdAt), { addSuffix: true })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={(e) => { e.stopPropagation(); onDismiss(alert.report.id); }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProximityAlertBanner;
