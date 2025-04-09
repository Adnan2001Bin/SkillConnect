import { useState } from "react";
import { Button } from "./components/ui/button";
import { createBrowserRouter, RouterProvider } from "react-router";
import AdminLayout from "./pages/Admin-View/Layout";
import AdminDashboard from "./pages/Admin-View/Dashboard";
import TalentManagement from "./pages/Admin-View/Talent/Management";
import AddTalent from "./pages/Admin-View/Talent/Add";
import UserManagement from "./pages/Admin-View/User/Management";

function App() {
  const [count, setCount] = useState(0);

  const router = createBrowserRouter([
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
    }
  ])

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
