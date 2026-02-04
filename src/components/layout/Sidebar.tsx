import { useLogoutMutation } from "@/app/features/auth/auth.api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  ChevronLeft,
  ChevronRight,
  Container,
  FileBarChart,
  FileText,
  LayoutDashboard,
  LogOut,
  ScrollText,
  Settings,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Admin Control", path: "/" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Truck, label: "Load Monitoring", path: "/loads" },
  { icon: Users, label: "Drivers", path: "/drivers" },
  { icon: Container, label: "Assets", path: "/assets" },
  { icon: ScrollText, label: "Interaction Logs", path: "/interaction-logs" },
  { icon: Brain, label: "AI Logs", path: "/ai-logs" },
  { icon: FileText, label: "Templates", path: "/templates" },
  { icon: AlertTriangle, label: "Exceptions", path: "/exceptions", badge: 3 },
  { icon: FileBarChart, label: "Reports", path: "/reports" },
];

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { collapsed, toggleCollapsed } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleNavClick = (item: NavItem) => {
    navigate(item.path);
    onTabChange?.(item.path.replace("/", "") || "admin");
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/login");
    } catch {
      // Even if API fails, redirect to login (tokens are cleared by the mutation)
      navigate("/login");
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg gradient-text">ProStatus</span>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", collapsed && "hidden")}
          onClick={toggleCollapsed}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              <Icon
                className={cn("h-5 w-5 shrink-0", isActive && "text-primary")}
              />
              {!collapsed && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle when collapsed - positioned above settings */}
      {collapsed && (
        <div className="absolute bottom-16 left-0 right-0 flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleCollapsed}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Settings and Logout at bottom */}
      {!collapsed && (
        <div className="absolute bottom-4 left-0 right-0 px-3 space-y-1">
          <button
            onClick={() => navigate("/settings")}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-200 relative",
              location.pathname === "/settings"
                ? "bg-primary/10 text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            {location.pathname === "/settings" && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
            )}
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
          <button
            onClick={() => setLogoutDialogOpen(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-200 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
      {collapsed && (
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1">
          <button
            onClick={() => navigate("/settings")}
            className={cn(
              "p-2.5 rounded-lg transition-all duration-200",
              location.pathname === "/settings"
                ? "bg-primary/10 text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={() => setLogoutDialogOpen(true)}
            className="p-2.5 rounded-lg transition-all duration-200 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to login again to
              access the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoggingOut ? "Logging out..." : "Yes, Logout"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
