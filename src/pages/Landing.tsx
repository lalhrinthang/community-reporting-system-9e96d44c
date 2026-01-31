import { Link } from "react-router-dom";
import {
  Shield,
  MapPin,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";

interface LandingProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Landing = ({ isAuthenticated, onLogout }: LandingProps) => {
  const steps = [
    {
      icon: Eye,
      title: "View Reports",
      description:
        "Explore the interactive map to see reported safety concerns in Yangon",
    },
    {
      icon: BarChart3,
      title: "Analyze Trends",
      description:
        "Access public analytics to understand community safety patterns",
    },
    {
      icon: Users,
      title: "Stay Informed",
      description:
        "Make informed decisions about your surroundings with real-time data",
    },
  ];

  const features = [
    {
      icon: MapPin,
      title: "Location-Based",
      description: "Interactive map focused on Yangon metropolitan area",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "No GPS tracking, no personal data collection",
    },
    {
      icon: AlertTriangle,
      title: "Safety Focus",
      description: "Humanitarian and public safety oriented reporting",
    },
  ];

  return (
    <Layout isAuthenticated={isAuthenticated} onLogout={onLogout}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-card to-background px-4 py-16 md:py-24">
        <div className="container mx-auto text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Community Safety &<br />
            Hazard Reporting System
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            A transparent platform for viewing and understanding safety
            information in the Yangon metropolitan area. Empowering communities
            with accessible, location-based safety data.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/map">
              <Button size="lg" className="gap-2">
                <MapPin className="h-5 w-5" />
                Explore Map
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="gap-2">
                <BarChart3 className="h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-2xl font-semibold text-foreground md:text-3xl">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                    {index + 1}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-card px-4 py-16">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-2xl font-semibold text-foreground md:text-3xl">
            Built for Safety & Privacy
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-xl bg-background p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethical Disclaimer */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="py-8">
              <div className="mx-auto max-w-3xl text-center">
                <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  Ethical Guidelines
                </h3>
                <p className="text-muted-foreground">
                  This platform is strictly{" "}
                  <strong className="text-foreground">non-political</strong> and{" "}
                  <strong className="text-foreground">non-partisan</strong>. We
                  focus solely on humanitarian and public safety concerns. All
                  reports are reviewed for accuracy and appropriateness. We do
                  not collect personal data, request device location access, or
                  track user behavior. Your safety and privacy are our top
                  priorities.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary px-4 py-16">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-2xl font-semibold text-secondary-foreground md:text-3xl">
            Ready to Explore?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-secondary-foreground/80">
            View the interactive map to see reported safety concerns in your
            area, or check out the dashboard for community-wide analytics.
          </p>
          <Link to="/map">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-secondary-foreground/20 bg-secondary-foreground/10 text-secondary-foreground hover:bg-secondary-foreground/20"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
