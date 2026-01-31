import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Save,
  X,
  Calendar,
  Clock,
  Image,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";
import YangonMap from "@/components/map/YangonMap";
import {
  CATEGORY_LABELS,
  ReportCategory,
  ReportStatus,
} from "@/types/report";
import { toast } from "sonner";

interface AddReportProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const YANGON_TOWNSHIPS = [
  "Dagon",
  "Botataung",
  "Pazundaung",
  "Kyauktada",
  "Lanmadaw",
  "Latha",
  "Tamwe",
  "Bahan",
  "Sanchaung",
  "Kamayut",
  "Hlaing",
  "Mayangone",
  "Insein",
  "Mingaladon",
  "Thaketa",
  "Dawbon",
  "North Okkalapa",
  "South Okkalapa",
  "Thingangyun",
  "Yankin",
];

const AddReport = ({ isAuthenticated, onLogout }: AddReportProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as ReportCategory | "",
    township: "",
    status: "active" as ReportStatus,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
  });

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setErrors((prev) => ({ ...prev, location: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.township) {
      newErrors.township = "Township is required";
    }

    if (!selectedLocation) {
      newErrors.location = "Please click on the map to select a location";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Report created successfully!");
    navigate("/admin");
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <Layout isAuthenticated={isAuthenticated} onLogout={onLogout}>
      <div className="container max-w-4xl py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/admin"
            className="mb-4 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Add New Report
          </h1>
          <p className="text-muted-foreground">
            Create a new safety or hazard report for the Yangon area
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
              <CardDescription>
                Enter the basic information about the incident
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Brief summary of the issue"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: value as ReportCategory,
                      }))
                    }
                  >
                    <SelectTrigger
                      className={errors.category ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: value as ReportStatus,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Provide additional details about the incident..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, time: e.target.value }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
              <CardDescription>
                Click on the map to select the exact location within Yangon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="township">
                  Township <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.township}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, township: value }))
                  }
                >
                  <SelectTrigger
                    className={errors.township ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select township" />
                  </SelectTrigger>
                  <SelectContent>
                    {YANGON_TOWNSHIPS.map((township) => (
                      <SelectItem key={township} value={township}>
                        {township}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.township && (
                  <p className="text-sm text-destructive">{errors.township}</p>
                )}
              </div>

              {errors.location && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.location}</AlertDescription>
                </Alert>
              )}

              <div className="overflow-hidden rounded-lg border border-border">
                <div className="h-[300px]">
                  <YangonMap
                    reports={[]}
                    onMapClick={handleMapClick}
                    selectedLocation={selectedLocation}
                  />
                </div>
              </div>

              {selectedLocation && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm font-medium">Selected Coordinates</p>
                  <p className="text-sm text-muted-foreground">
                    Lat: {selectedLocation.lat.toFixed(6)}, Lng:{" "}
                    {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photo Upload (Optional) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Photo (Optional)
              </CardTitle>
              <CardDescription>
                Upload a photo of the incident. Metadata will be stripped for
                privacy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50">
                <div className="text-center">
                  <Image className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop an image, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Max file size: 5MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Report"}
            </Button>
          </div>
        </form>

        {/* Security Notice */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Privacy Notice:</strong> This
              form does not collect any personal information. All reports are
              anonymous. Uploaded images will have metadata (including location
              data) automatically removed.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddReport;
