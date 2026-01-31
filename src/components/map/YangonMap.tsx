import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Report, CATEGORY_COLORS } from "@/types/report";

// Fix default marker icon issue with Leaflet + bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Yangon center and bounds
const YANGON_CENTER: L.LatLngTuple = [16.8661, 96.1951];
const YANGON_BOUNDS: L.LatLngBoundsExpression = [
  [16.65, 95.95], // Southwest
  [17.1, 96.4], // Northeast
];

interface YangonMapProps {
  reports: Report[];
  onReportClick?: (report: Report) => void;
  onMapClick?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  className?: string;
  interactive?: boolean;
}

const createCategoryIcon = (category: Report["category"]) => {
  const color = CATEGORY_COLORS[category];
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const createSelectedLocationIcon = () => {
  return L.divIcon({
    className: "selected-location-marker",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: hsl(var(--primary));
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        animation: pulse 1.5s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      </style>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const YangonMap = ({
  reports,
  onReportClick,
  onMapClick,
  selectedLocation,
  className = "h-full w-full",
  interactive = true,
}: YangonMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const selectedMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: YANGON_CENTER,
      zoom: 12,
      minZoom: 11,
      maxZoom: 18,
      maxBounds: YANGON_BOUNDS,
      maxBoundsViscosity: 1.0,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Handle map click for location selection
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !onMapClick) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [onMapClick]);

  // Update report markers
  useEffect(() => {
    const markersLayer = markersLayerRef.current;
    if (!markersLayer) return;

    markersLayer.clearLayers();

    reports
      .filter((r) => r.status !== "archived")
      .forEach((report) => {
        const marker = L.marker([report.latitude, report.longitude], {
          icon: createCategoryIcon(report.category),
        });

        const photoHtml = report.photoUrl
          ? `<img src="${report.photoUrl}" alt="Report photo" style="width: 100%; max-height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" />`
          : "";

        marker.bindPopup(`
          <div style="min-width: 200px; max-width: 280px;">
            ${photoHtml}
            <h3 style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px;">
              ${report.title}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
              ${report.township}
            </p>
            <span style="
              display: inline-block;
              padding: 2px 8px;
              font-size: 11px;
              border-radius: 9999px;
              background-color: ${CATEGORY_COLORS[report.category]};
              color: white;
            ">
              ${report.category}
            </span>
          </div>
        `);

        if (interactive && onReportClick) {
          marker.on("click", () => onReportClick(report));
        }

        marker.addTo(markersLayer);
      });
  }, [reports, interactive, onReportClick]);

  // Handle selected location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing selected marker
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.remove();
      selectedMarkerRef.current = null;
    }

    // Add new selected marker if location exists
    if (selectedLocation) {
      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        icon: createSelectedLocationIcon(),
      }).addTo(map);
      selectedMarkerRef.current = marker;
    }
  }, [selectedLocation]);

  return <div ref={mapRef} className={className} />;
};

export default YangonMap;
