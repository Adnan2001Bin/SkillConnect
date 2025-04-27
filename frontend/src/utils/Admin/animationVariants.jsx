export const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };
  
  export const navItemVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };
  
  export const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };
  
  export const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.9 }
  };
  
  export const mainVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        delay: 0.2
      }
    }
  };