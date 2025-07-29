import React, { FC, useEffect } from "react";
import RequestsBox from "../components/RequestsBox";
import PreviousRequests from "../components/PreviousRequests";
import Carousel from "../components/Carousel";
import { useDocumentSize } from "../hooks/useDocumentSize";

const HomePage: FC = () => {
  const { width } = useDocumentSize();

  const mobileContent = (
    <Carousel titles={["Make Request", "Player", "Previous Requests"]}>
      <div className='h-full w-full flex items-center justify-center'>
        <RequestsBox />
      </div>
      <div className='h-full w-full flex items-center justify-center'>
        <div
          id='player-portal'
          className='flex items-center justify-center h-full w-full max-w-[350px] xl-max-width-1/3'
        >
          {/* Player will be portalled here */}
        </div>
      </div>
      <div className='h-full w-full flex items-center justify-center'>
        <PreviousRequests />
      </div>
    </Carousel>
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

  return width >= 1280 ? desktopContent : mobileContent;
};

export default HomePage;
