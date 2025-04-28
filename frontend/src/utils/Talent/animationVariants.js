// Main content animation
export const mainVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  // Header animation
  export const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  
  // Sidebar animation
  export const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "5.8rem" },
  };
  
  // Navigation link animations
  export const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" },
    }),
    hover: {
      scale: 1.01,
      backgroundColor: "rgba(196, 222, 218, 0.2)", // Very light teal with opacity
      boxShadow: "0 0 15px rgba(77, 165, 155, 0.5)", // Teal glow
      color: "#4da59b", // Teal for text/icon
      textShadow: "0 0 10px rgba(77, 165, 155, 0.8)",
      transition: { duration: 0.3 },
    },
    active: {
      scale: 1.01,
      backgroundColor: "rgba(196, 222, 218, 0.2)", // Same as hover
      boxShadow: "0 0 15px rgba(77, 165, 155, 0.5)", // Same as hover
      color: "#4da59b", // Same as hover
      textShadow: "0 0 10px rgba(77, 165, 155, 0.8)", // Same as hover
      transition: { duration: 0.3 },
    },
  };
  
  // Button animations
  export const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
  };