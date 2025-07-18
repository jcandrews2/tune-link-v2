import React, { FC } from "react";
import RequestsBox from "../components/RequestsBox";
import PreviousRequests from "../components/PreviousRequests";

const HomePage: FC = () => {
  return (
    <div className=''>
      <div className='container mx-auto'>
        <div className='flex justify-center items-start gap-4 relative'>
          <div className='w-1/3 relative z-0'>
            <RequestsBox />
          </div>
          <div id='player-portal' className='w-1/3 flex justify-center z-10'>
            {/* Player will be portalled here */}
          </div>
          <div className='w-1/3 relative z-0'>
            <PreviousRequests />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
