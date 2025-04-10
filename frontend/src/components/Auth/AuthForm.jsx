import React, { useState } from "react";
import { motion } from "framer-motion";
import { containerVariants, childVariants} from "../../utils/Auth/animationVariants"

const AuthForm = ({
  logo,
  subtitle,
  onSubmit,
  buttonText,
  isLoading,
  error,
  children,
  footer,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 w-full max-w-md px-6 py-8"
    >
      <div className="bg-black/50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/30">
        <div className="px-8 py-10">
          {/* Header Section */}
          <motion.div variants={childVariants} className="text-center mb-8">
            {logo && (
              <div className="flex justify-center">
                {logo}
              </div>
            )}
            {subtitle && (
              <p className="text-gray-400">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Form Section */}
          <motion.form
            variants={containerVariants}
            onSubmit={onSubmit}
            className="space-y-6"
          >
            {error && (
              <motion.div
                variants={childVariants}
                className="p-3 bg-red-500/20 text-red-300 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Pass showPassword and toggleShowPassword to children */}
            {React.Children.map(children, (child) =>
              React.cloneElement(child, { showPassword, toggleShowPassword })
            )}

            <motion.div variants={childVariants}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                    Processing...
                  </>
                ) : (
                  buttonText
                )}
              </button>
            </motion.div>
          </motion.form>

          {footer && (
            <motion.div variants={childVariants} className="mt-6">
              {footer}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AuthForm;