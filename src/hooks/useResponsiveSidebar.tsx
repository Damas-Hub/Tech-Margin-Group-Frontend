// hooks/useResponsiveSidebar.tsx
import { useState, useEffect } from "react";

const useResponsiveSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [manuallyToggled, setManuallyToggled] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    setManuallyToggled(true);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }

      if (!mobile && !isSidebarOpen && !manuallyToggled) {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Call initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen, manuallyToggled]);

  return { isSidebarOpen, isMobile, toggleSidebar, setIsSidebarOpen };
};

export default useResponsiveSidebar;
