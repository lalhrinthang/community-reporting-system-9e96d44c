import { useState, useEffect, useCallback, useRef } from "react";

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  permission: "prompt" | "granted" | "denied" | "unsupported";
  loading: boolean;
}

export function useGeolocation(enabled: boolean = false, intervalMs: number = 30000) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    permission: "prompt",
    loading: false,
  });
  const watchIdRef = useRef<number | null>(null);

  const requestPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, permission: "unsupported", error: "Geolocation not supported" }));
      return false;
    }

    // Check permission status if available
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: "geolocation" });
        if (result.state === "denied") {
          setState((s) => ({ ...s, permission: "denied", error: "Location access denied" }));
          return false;
        }
      } catch {
        // permissions API not supported for geolocation, continue
      }
    }

    return true;
  }, []);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) return;

    setState((s) => ({ ...s, loading: true }));

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          error: null,
          permission: "granted",
          loading: false,
        });
      },
      (err) => {
        setState((s) => ({
          ...s,
          error: err.message,
          permission: err.code === 1 ? "denied" : s.permission,
          loading: false,
        }));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );

    // Watch position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          error: null,
          permission: "granted",
          loading: false,
        });
      },
      (err) => {
        setState((s) => ({
          ...s,
          error: err.message,
          permission: err.code === 1 ? "denied" : s.permission,
          loading: false,
        }));
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: intervalMs }
    );
  }, [intervalMs]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      requestPermission().then((ok) => {
        if (ok) startWatching();
      });
    } else {
      stopWatching();
    }

    return () => stopWatching();
  }, [enabled, requestPermission, startWatching, stopWatching]);

  return state;
}
