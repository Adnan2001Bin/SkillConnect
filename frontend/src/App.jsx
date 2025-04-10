import { useEffect, useState } from "react";
import './App.css'
import { Button } from "./components/ui/button";
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

function App() {
  const [count, setCount] = useState(0);
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status when the app loads
    checkAuth();
  }, [checkAuth]);

  console.log("user:", user);
    
  

  const router = createBrowserRouter([

    {
      path:"auth",
      element:(<AuthLayout />),

      children:[
        {path:"register" , element:<Register />},
        {path:"login" , element:<Login />},
      ]
    },

    {
      path: "admin",
      element:(
        <AdminLayout />
      ),
      children: [
        {path:"dashboard" , element:<AdminDashboard />},
        {path:"talent-management" , element:<TalentManagement />},
        {path:"add-talent" , element:<AddTalent />},
        {path:"user-management" , element:<UserManagement />},
        
      ]
    },

    {
      path: "talent",
      element:(
        <TalentLayout />
      ),
      children: [
        {path:"dashboard" , element:<TalentDashboard />},
        
      ]
    },

    {
      path: "/",
      element:(
        <UserLayout />
      ),
      children: [
        {path:"dashboard" , element:<TalentDashboard />},
        
      ]
    },

  ])

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
