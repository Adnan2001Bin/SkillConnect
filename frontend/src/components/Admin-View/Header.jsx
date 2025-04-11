// src/components/Admin/AdminHeader.jsx
import { motion } from 'framer-motion';
import { FaBell, FaSignOutAlt } from 'react-icons/fa';
import { headerVariants, buttonVariants } from '@/utils/Admin/animationVariants';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router';
import Loader from '../Loader/Loader';

const AdminHeader = () => {
  const { user, logout, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = () => {
    if (!user) return 'AD';
    if (user.name) {
      const names = user.name.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0].slice(0, 2).toUpperCase();
    }
    return user.email.slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return <Loader text="Logging out..." />;
  }
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
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center gap-2 text-gray-300 hover:text-white bg-gray-800 px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <FaSignOutAlt className="text-xl" />
            )}
            <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
          </motion.button>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white">{getInitials()}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;