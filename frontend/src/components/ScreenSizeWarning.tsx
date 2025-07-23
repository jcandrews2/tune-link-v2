import React, { FC, useEffect, useState } from "react";

const ScreenSizeWarning: FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    // Check on mount
    checkScreenSize();

    // Check on resize
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isSmallScreen) return null;

  return (
    <div className='fixed inset-0 z-[9999] bg-black flex items-center justify-center p-6'>
      <div className='max-w-md text-center'>
        <h2 className='text-2xl font-bold text-white mb-4'>
          Screen Size Not Supported
        </h2>
        <p className='text-gray-400'>
          This website is currently optimized for desktop computers and large
          tablets only. Please use a device with a larger screen for the best
          experience.
        </p>
      </div>
    </div>
  );
};

export default ScreenSizeWarning;
