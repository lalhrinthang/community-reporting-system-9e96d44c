import { ReactNode } from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";

interface LayoutProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  hideNav?: boolean;
}

const Layout = ({
  children,
  isAuthenticated = false,
  onLogout,
  hideNav = false,
}: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {!hideNav && (
        <Header isAuthenticated={isAuthenticated} onLogout={onLogout} />
      )}
      <main className={hideNav ? "" : "pb-20 md:pb-0"}>{children}</main>
      {!hideNav && <MobileNav isAuthenticated={isAuthenticated} />}
    </div>
  );
};

export default Layout;
