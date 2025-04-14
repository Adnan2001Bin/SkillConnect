// src/App.jsx
import { useEffect } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import AdminLayout from "./pages/Admin-View/Layout";
import AdminDashboard from "./pages/Admin-View/Dashboard";
import TalentManagement from "./pages/Admin-View/Talent/Management";
import AddTalent from "./pages/Admin-View/Talent/Add";
import UserManagement from "./pages/Admin-View/User/Management";
import TalentLayout from "./pages/Talent-View/Layout";
import TalentDashboard from "./pages/Talent-View/Dashboard";
import UserLayout from "./pages/User/Layout";
import AuthLayout from "./pages/Auth/Layout";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import { useAuthStore } from "./store/authStore";
import ProtectedRoute from "./components/CheckAuth";
import Loader from "./components/Loader/Loader";
import Home from "./pages/User/Home";
import Talent from "./pages/User/Talent";

function App() {
  const { user, isLoading, checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check authentication status when the app loads
    checkAuth();
  }, [checkAuth]);

  const router = createBrowserRouter([
    {
      path: "/auth",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
          <AuthLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "talent-management", element: <TalentManagement /> },
        { path: "add-talent", element: <AddTalent /> },
        { path: "user-management", element: <UserManagement /> },
      ],
    },
    {
      path: "/talent",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
          <TalentLayout />
        </ProtectedRoute>
      ),
      children: [{ path: "dashboard", element: <TalentDashboard /> }],
    },
    {
      path: "/",
      element: <UserLayout />,
      children: [
        { 
          path: "/", element: <Home />,
         }, 
         {
          path: "talentlist", element: <Talent />
         }
      ],
    },
  ]);

  if (isLoading) {
    return <Loader text="Checking authentication..." />;
  }

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
