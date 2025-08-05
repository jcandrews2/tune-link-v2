import React, { FC } from "react";
import RequestsBox from "../components/RequestsBox";
import PreviousRequests from "../components/PreviousRequests";
import Carousel from "../components/Carousel";
import { useDocumentSize } from "../hooks/useDocumentSize";

const HomePage: FC = () => {
  const { width } = useDocumentSize();

  const mobileContent = (
    <Carousel
      titles={["Make Request", "Player", "Previous Requests"]}
      isHomePage
    >
      <div className='h-full w-full flex items-center justify-center'>
        <RequestsBox />
      </div>
      <div className='h-full w-full flex items-center justify-center'>
        <div
          id='player-portal'
          className='h-full w-full flex items-center justify-center'
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
    <div className='flex flex-row justify-center items-start gap-4 mx-auto container h-[600px]'>
      <div className='w-1/3 relative z-0 h-3/5'>
        <RequestsBox />
      </div>
      <div id='player-portal' className='w-1/3 flex justify-center z-10 h-full'>
        {/* Player will be portalled here */}
      </div>
      <div className='w-1/3 relative z-0 h-3/5'>
        <PreviousRequests />
      </div>
    </div>
  );

  return width >= 1280 ? desktopContent : mobileContent;
};

export default HomePage;
