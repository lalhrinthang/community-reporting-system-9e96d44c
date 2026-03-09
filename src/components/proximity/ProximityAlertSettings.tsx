import { Bell, BellOff, MapPin, Radar, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ProximitySettings, ProximityAlert } from "@/hooks/useProximityAlerts";
import { GeolocationState } from "@/hooks/useGeolocation";

interface ProximityAlertSettingsProps {
  settings: ProximitySettings;
  onUpdateSettings: (partial: Partial<ProximitySettings>) => void;
  geolocation: GeolocationState;
  alertCount: number;
}

const RADIUS_OPTIONS = [
  { value: "500", label: "500 meters" },
  { value: "1000", label: "1 kilometer" },
  { value: "2000", label: "2 kilometers" },
  { value: "5000", label: "5 kilometers" },
];

const ProximityAlertSettings = ({
  settings,
  onUpdateSettings,
  geolocation,
  alertCount,
}: ProximityAlertSettingsProps) => {
  const handleEnableToggle = (checked: boolean) => {
    onUpdateSettings({ enabled: checked });
  };

  const handlePushToggle = async (checked: boolean) => {
    if (checked && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        onUpdateSettings({ pushEnabled: true });
      }
    } else {
      onUpdateSettings({ pushEnabled: checked });
    }
  };

  const getLocationStatus = () => {
    if (!settings.enabled) return null;
    if (geolocation.loading) return { text: "Locating...", variant: "secondary" as const };
    if (geolocation.permission === "denied") return { text: "Location denied", variant: "destructive" as const };
    if (geolocation.permission === "unsupported") return { text: "Not supported", variant: "destructive" as const };
    if (geolocation.latitude !== null) return { text: "Active", variant: "default" as const };
    return { text: "Waiting", variant: "secondary" as const };
  };

  const locationStatus = getLocationStatus();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Radar className="h-5 w-5 text-primary" />
            Proximity Alerts
          </CardTitle>
          {alertCount > 0 && settings.enabled && (
            <Badge variant="destructive" className="animate-pulse">
              {alertCount} nearby
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings.enabled ? (
              <Bell className="h-4 w-4 text-primary" />
            ) : (
              <BellOff className="h-4 w-4 text-muted-foreground" />
            )}
            <Label htmlFor="proximity-enabled" className="cursor-pointer">
              Enable nearby alerts
            </Label>
          </div>
          <Switch
            id="proximity-enabled"
            checked={settings.enabled}
            onCheckedChange={handleEnableToggle}
          />
        </div>

        {settings.enabled && (
          <>
            {/* Location Status */}
            {locationStatus && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <Badge variant={locationStatus.variant} className="text-xs">
                  {locationStatus.text}
                </Badge>
              </div>
            )}

            {/* Alert Radius */}
            <div className="space-y-2">
              <Label className="text-sm">Alert radius</Label>
              <Select
                value={String(settings.radius)}
                onValueChange={(v) => onUpdateSettings({ radius: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RADIUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="push-enabled" className="cursor-pointer text-sm">
                  Push notifications
                </Label>
              </div>
              <Switch
                id="push-enabled"
                checked={settings.pushEnabled}
                onCheckedChange={handlePushToggle}
              />
            </div>

            {/* Privacy Notice */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your location is processed locally to determine proximity to reported hazards.
              The system does not store or transmit persistent location history, ensuring
              your anonymity and safety.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProximityAlertSettings;
