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
  Heart,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";

interface AboutProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const About = ({ isAuthenticated, onLogout }: AboutProps) => {
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
      description:
        "Interactive map focused on Yangon metropolitan area with real-time incident mapping and proximity alerts.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "No GPS tracking, no personal data collection. Your location is processed locally and never stored on servers.",
    },
    {
      icon: AlertTriangle,
      title: "Safety Focus",
      description:
        "Humanitarian and public safety oriented reporting, designed to keep communities informed and prepared.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Community Driven",
      description:
        "Built by the community, for the community. Every report contributes to collective safety awareness.",
    },
    {
      icon: Globe,
      title: "Open & Transparent",
      description:
        "All safety data is publicly accessible. We believe transparency is the foundation of trust.",
    },
    {
      icon: Users,
      title: "Inclusive Design",
      description:
        "Accessible to everyone regardless of technical expertise. Simple, intuitive, and multilingual-ready.",
    },
  ];

  return (
    <Layout isAuthenticated={isAuthenticated} onLogout={onLogout}>
      {/* Page Header */}
      <section className="border-b border-border bg-card px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            About This Platform
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Learn how our community safety system works, what principles guide
            us, and how you can stay informed about hazards in your area.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-semibold text-foreground md:text-3xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground">
              Three simple steps to stay aware of safety conditions around you.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="relative overflow-hidden transition-shadow hover:shadow-md"
              >
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

      {/* Built for Safety & Privacy */}
      <section className="bg-card px-4 py-16 md:py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-semibold text-foreground md:text-3xl">
              Built for Safety & Privacy
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground">
              Every design decision prioritizes your security and anonymity.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-xl bg-background p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-semibold text-foreground md:text-3xl">
              Our Values
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground">
              The principles that shape how we build and maintain this platform.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value, index) => (
              <Card key={index} className="transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ethical Guidelines */}
      <section className="bg-card px-4 py-16 md:py-20">
        <div className="container mx-auto">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="py-10">
              <div className="mx-auto max-w-3xl text-center">
                <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  Ethical Guidelines
                </h3>
                <p className="leading-relaxed text-muted-foreground">
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

      {/* Ready to Explore CTA */}
      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-2xl font-semibold text-foreground md:text-3xl">
            Ready to Explore?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            View the interactive map to see reported safety concerns in your
            area, or check out the dashboard for community-wide analytics.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/map">
              <Button size="lg" className="gap-2">
                <MapPin className="h-5 w-5" />
                Explore the Map
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
    </Layout>
  );
};

export default About;
