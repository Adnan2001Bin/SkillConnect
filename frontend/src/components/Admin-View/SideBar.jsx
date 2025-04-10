import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaUsers, 
  FaUserPlus, 
  FaChartBar, 
  FaCog 
} from 'react-icons/fa';
import { NavLink } from 'react-router';
import { sidebarVariants,navItemVariants } from '@/utils/Admin/animationVariants';
import logo from "../../assets/logo.png"


const AdminSideBar = () => {
  const navItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <FaUserPlus />, label: "Add Talent", path: "/admin/add-talent" },
    { icon: <FaUsers />, label: "Users", path: "/admin/user-management" },
    { icon: <FaChartBar />, label: "Analytics", path: "/admin/analytics" },
    { icon: <FaCog />, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 p-4 z-50"
    >
      <div className="mb-8 ">
        <div>
          <img className='w-[10rem]' src={logo} alt="" />
        </div>
        
      </div>

      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg text-gray-300 transition-colors duration-200 ${
                isActive ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                variants={navItemVariants}
                whileHover="hover"
                whileTap="tap"
                className="flex items-center gap-3 w-full"
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};

export default AdminSideBar;