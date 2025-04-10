import { motion } from 'framer-motion';
import { FaBell, FaSignOutAlt } from 'react-icons/fa';
import { headerVariants, buttonVariants } from '@/utils/Admin/animationVariants';

const AdminHeader = () => {
  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className="fixed top-0 left-0 right-0 h-20 bg-gray-900 border-b border-gray-800 z-40"
    >
      <div className="flex items-center justify-between px-6 h-full ml-64">
        <h1 className="text-lg font-semibold text-white bg-black w-38 h-12 flex items-center justify-center rounded-3xl">
          Admin Panel
        </h1>
        
        <div className="flex items-center gap-4">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <FaBell className="text-xl" />
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-2 text-gray-300 hover:text-white bg-gray-800 px-3 py-2 rounded-lg transition-colors duration-200"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </motion.button>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white">AD</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;