// src/components/CheckAuth.jsx
import { Navigate, useLocation } from "react-router";

function ProtectedRoute({ isAuthenticated, user, children }) {
  const location = useLocation();

  // If not authenticated and trying to access protected routes, redirect to login
  if (
    !isAuthenticated &&
    (location.pathname.includes("/admin") || location.pathname.includes("/talent"))
  ) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated and trying to access auth routes, redirect to appropriate page
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") || location.pathname.includes("/register"))
  ) {
    // Redirect based on user role or to default route
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/"} replace />;
  }

  return <div>{children}</div>;
}

export default ProtectedRoute;