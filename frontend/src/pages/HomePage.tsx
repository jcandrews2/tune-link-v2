import React, { FC } from 'react';
import Player from '../components/Player';
import RequestsBox from '../components/RequestsBox';

const HomePage: FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-start gap-4">
          <div className="w-[400px]">
            <RequestsBox />
          </div>
          <div className="w-[400px] flex justify-center">
            <Player />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 