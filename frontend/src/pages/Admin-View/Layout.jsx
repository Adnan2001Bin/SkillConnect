import AdminHeader from '../../components/Admin-View/Header';
import AdminSideBar from '../../components/Admin-View/SideBar';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router';
import { mainVariants } from '@/utils/Admin/animationVariants';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-700">
      <AdminHeader />
      <AdminSideBar />
      
      <motion.main
        initial="hidden"
        animate="visible"
        variants={mainVariants}
        className="ml-64 pt-16 p-6 min-h-screen"
      >
        <div className="max-w-7xl mx-auto mt-10">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default AdminLayout;