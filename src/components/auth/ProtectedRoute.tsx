import { Navigate, useLocation } from "react-router-dom";

const ACCESS_TOKEN_KEY = "accessToken";

// Check auth directly from localStorage to avoid Redux timing issues
const checkIsAuthenticated = (): boolean => {
  try {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return false;
  }
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = checkIsAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login page, saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Redirect authenticated users away from auth pages
interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const location = useLocation();
  const isAuthenticated = checkIsAuthenticated();

  if (isAuthenticated) {
    // Redirect to the page they tried to visit or home
    const from =
      (location.state as { from?: { pathname: string } })?.from?.pathname ||
      "/";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
