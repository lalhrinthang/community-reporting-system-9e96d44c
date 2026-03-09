import { useState, useEffect, useCallback, useRef } from "react";
import { Report } from "@/types/report";
import { haversineDistance } from "@/lib/haversine";
import { useGeolocation } from "./useGeolocation";
import { formatDistanceToNow } from "date-fns";

export interface ProximityAlert {
  report: Report;
  distance: number; // in meters
  timestamp: Date;
}

export interface ProximitySettings {
  enabled: boolean;
  radius: number; // in meters
  pushEnabled: boolean;
}

const SETTINGS_KEY = "proximity-alert-settings";
const ALERTED_KEY = "proximity-alerted-ids";

function loadSettings(): ProximitySettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { enabled: false, radius: 1000, pushEnabled: false };
}

function saveSettings(settings: ProximitySettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function useProximityAlerts(reports: Report[]) {
  const [settings, setSettings] = useState<ProximitySettings>(loadSettings);
  const [alerts, setAlerts] = useState<ProximityAlert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const alertedIdsRef = useRef<Set<string>>(new Set());

  const geo = useGeolocation(settings.enabled, 30000);

  // Load previously alerted IDs to avoid duplicate notifications
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ALERTED_KEY);
      if (stored) alertedIdsRef.current = new Set(JSON.parse(stored));
    } catch {}
  }, []);

  const updateSettings = useCallback((partial: Partial<ProximitySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }, []);

  const dismissAlert = useCallback((reportId: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(reportId));
  }, []);

  const dismissAll = useCallback(() => {
    setDismissedAlerts(new Set(alerts.map((a) => a.report.id)));
  }, [alerts]);

  // Check proximity whenever location or reports change
  useEffect(() => {
    if (!settings.enabled || geo.latitude === null || geo.longitude === null) {
      setAlerts([]);
      return;
    }

    const nearbyAlerts: ProximityAlert[] = [];

    for (const report of reports) {
      if (report.status === "archived") continue;

      const distance = haversineDistance(
        geo.latitude,
        geo.longitude,
        report.latitude,
        report.longitude
      );

      if (distance <= settings.radius) {
        nearbyAlerts.push({
          report,
          distance,
          timestamp: new Date(),
        });

        // Send push notification for newly detected reports
        if (settings.pushEnabled && !alertedIdsRef.current.has(report.id)) {
          alertedIdsRef.current.add(report.id);
          sendPushNotification(report, distance);
        }
      }
    }

    // Sort by distance
    nearbyAlerts.sort((a, b) => a.distance - b.distance);
    setAlerts(nearbyAlerts);

    // Save alerted IDs
    localStorage.setItem(
      ALERTED_KEY,
      JSON.stringify([...alertedIdsRef.current])
    );
  }, [geo.latitude, geo.longitude, reports, settings.enabled, settings.radius, settings.pushEnabled]);

  const activeAlerts = alerts.filter((a) => !dismissedAlerts.has(a.report.id));

  return {
    settings,
    updateSettings,
    alerts: activeAlerts,
    allAlerts: alerts,
    dismissAlert,
    dismissAll,
    geolocation: geo,
  };
}

async function sendPushNotification(report: Report, distance: number) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    const reg = await navigator.serviceWorker?.ready;
    if (reg) {
      reg.showNotification("🚨 Nearby Safety Alert", {
        body: `${report.title} - ${Math.round(distance)}m away in ${report.township}. Reported ${formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}.`,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: `proximity-${report.id}`,
        data: { reportId: report.id },
      });
    }
  } catch {
    // Fallback to regular notification
    new Notification("🚨 Nearby Safety Alert", {
      body: `${report.title} - ${Math.round(distance)}m away in ${report.township}.`,
      icon: "/favicon.ico",
      tag: `proximity-${report.id}`,
    });
  }
}
