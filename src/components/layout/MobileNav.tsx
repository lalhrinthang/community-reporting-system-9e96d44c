import { Link, useLocation } from "react-router-dom";
import { MapPin, BarChart3, Home, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isAuthenticated?: boolean;
}

const MobileNav = ({ isAuthenticated = false }: MobileNavProps) => {
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/map", label: "Map", icon: MapPin },
    { href: "/dashboard", label: "Stats", icon: BarChart3 },
    ...(isAuthenticated
      ? [{ href: "/admin", label: "Admin", icon: Settings }]
      : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors",
              isActive(item.href)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5",
                isActive(item.href) && "text-primary"
              )}
            />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
