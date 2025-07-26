import React, { FC, useState, useEffect } from "react";
import RequestsBox from "../components/RequestsBox";
import PreviousRequests from "../components/PreviousRequests";
import Carousel from "../components/Carousel";

const HomePage: FC = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1280);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");

    const handleResize = (e: MediaQueryListEvent) => {
      setIsLargeScreen(e.matches);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const mobileContent = (
    <div className='w-full max-h-[600px]'>
      <Carousel titles={["Make Request", "Player", "Previous Requests"]}>
        <div className='h-full w-full max-h-[600px] flex items-center justify-center p-4'>
          <RequestsBox />
        </div>
        <div className='h-full w-full max-h-[600px] flex items-center justify-center p-4'>
          <div
            id='player-portal'
            className='aspect-[2/3] max-h-[600px] flex items-center justify-center'
          >
            {/* Player will be portalled here */}
          </div>
        </div>
        <div className='h-full w-full max-h-[600px] flex items-center justify-center p-4'>
          <PreviousRequests />
        </div>
      </Carousel>
    </div>
  );

  const desktopContent = (
    <div className='flex flex-row justify-center items-start gap-4 mx-auto container'>
      <div className='w-1/3 relative z-0 h-[366px]'>
        <RequestsBox />
      </div>
      <div
        id='player-portal'
        className='w-1/3 flex justify-center z-10 h-[600px]'
      >
        {/* Player will be portalled here */}
      </div>
      <div className='w-1/3 relative z-0 h-[366px]'>
        <PreviousRequests />
      </div>
    </div>
  );

  return (
    <div className='w-full'>
      {isLargeScreen ? desktopContent : mobileContent}
    </div>
  );
};

export default HomePage;
