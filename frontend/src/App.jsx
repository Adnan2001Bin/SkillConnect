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


import TalentApplication from "./pages/User/TalentApplication";
import TalentApplications from "./pages/Admin-View/Talent/Applications";
import TalentProfile from "./pages/Talent-View/TalentProfile";
import TalentProjects from "./pages/Talent-View/Projects";
import TalentList from "./pages/User/Talent";
import TalentDetails from "./pages/User/TalentDetails";
import TalentMessages from "./pages/Talent-View/TalentMessages";
import UserMessages from "./pages/User/UserMessages";
import ForgotPassword from "./pages/Auth/ForgotPassword";

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
        { path: "forgot-password", element: <ForgotPassword /> },
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
        { path: "talent-applications", element: <TalentApplications /> },
      ],
    },
    {
      path: "/talent",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
          <TalentLayout />
        </ProtectedRoute>
      ),
      children: [{ path: "dashboard", element: <TalentDashboard /> },

        { path: "profile", element: <TalentProfile /> },
        { path: "projects", element: <TalentProjects /> },
        { path: "messages", element: <TalentMessages /> }
      ],
    },
    {
      path: "/",
      element: <UserLayout />,
      children: [
        { 
          path: "/", element: <Home />,
         }, 
         {
          path: "talentlist", element: <TalentList />
         },
         { path: "apply-talent", element: <TalentApplication /> },
         { path: "talentlist/:id", element: <TalentDetails /> },
         { path: "my-profile", element: <UserMessages /> },
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
