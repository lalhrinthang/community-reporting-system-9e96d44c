export type ReportCategory =
  | "infrastructure"
  | "environmental"
  | "safety"
  | "health"
  | "traffic"
  | "other";

export type ReportStatus = "active" | "verified" | "archived";

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  latitude: number;
  longitude: number;
  township: string;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORY_LABELS: Record<ReportCategory, string> = {
  infrastructure: "Infrastructure",
  environmental: "Environmental",
  safety: "Safety Concern",
  health: "Health Hazard",
  traffic: "Traffic Issue",
  other: "Other",
};

export const CATEGORY_COLORS: Record<ReportCategory, string> = {
  infrastructure: "hsl(var(--chart-1))",
  environmental: "hsl(var(--chart-2))",
  safety: "hsl(var(--destructive))",
  health: "hsl(var(--chart-4))",
  traffic: "hsl(var(--chart-5))",
  other: "hsl(var(--muted))",
};
