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
        className="pt-16 p-4 sm:p-6 lg:p-8 sm:ml-0 md:ml-48 lg:ml-64 min-h-screen"
      >
        <div className="max-w-full mx-auto mt-15">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default AdminLayout;