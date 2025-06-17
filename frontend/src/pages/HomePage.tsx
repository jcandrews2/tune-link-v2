import React, { FC } from "react";
import RequestsBox from "../components/RequestsBox";
import PreviousRequests from "../components/PreviousRequests";

const HomePage: FC = () => {
  return (
    <div className=''>
      <div className='container mx-auto'>
        <div className='flex justify-center items-start gap-4'>
          <div className='w-[400px]'>
            <RequestsBox />
          </div>
          <div id='player-portal' className='w-[400px] flex justify-center'>
            {/* Player will be portalled here */}
          </div>
          <div className='w-[400px]'>
            <PreviousRequests />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
