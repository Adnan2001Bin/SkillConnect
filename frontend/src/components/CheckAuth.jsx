// src/components/CheckAuth.jsx
import { Navigate, useLocation } from "react-router"; // Fixed import typo

function ProtectedRoute({ isAuthenticated, user, children }) {
  const location = useLocation();

  // Debug log (optional, remove in production)
  console.log("ProtectedRoute:", { isAuthenticated, role: user?.role, pathname: location.pathname });

  // If not authenticated and trying to access protected routes, redirect to login
  if (
    !isAuthenticated &&
    (location.pathname.includes("/admin") || location.pathname.includes("/talent"))
  ) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Optionally protect root route if it's a dashboard
  if (!isAuthenticated && location.pathname === "/") {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If authenticated and trying to access auth routes, redirect based on role
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") || location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === "talent") {
      return <Navigate to="/talent/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <div>{children}</div>;
}

export default ProtectedRoute;