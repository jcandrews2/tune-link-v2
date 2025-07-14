import React, { FC } from "react";
import RequestsBox from "../components/RequestsBox";
import PreviousRequests from "../components/PreviousRequests";

const HomePage: FC = () => {
  return (
    <div className=''>
      <div className='container mx-auto'>
        <div className='flex justify-center items-start gap-4 relative'>
          <div className='w-[400px] relative z-10'>
            <RequestsBox />
          </div>
          <div id='player-portal' className='w-[400px] flex justify-center z-0'>
            {/* Player will be portalled here */}
          </div>
          <div className='w-[400px] relative z-10'>
            <PreviousRequests />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
