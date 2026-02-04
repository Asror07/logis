import { useState, useEffect } from 'react';
import { Bell, Search, User, Maximize, Minimize, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useGetProfileQuery } from '@/app/features/auth/auth.api';

export function Header() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { data: user, isLoading } = useGetProfileQuery();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search loads, carriers, or messages..."
            className="w-full h-10 pl-10 pr-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-full">
            <span className="h-2 w-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-success">System Online</span>
          </div>

          {/* Fullscreen Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <Link to="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                7
              </span>
            </Button>
          </Link>

          {/* User */}
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">
                    {user ? `${user.first_name} ${user.last_name || ''}`.trim() : 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role || 'User'}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-foreground">
                    {user ? user.first_name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
