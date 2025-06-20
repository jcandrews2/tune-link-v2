import React, { FC, useEffect } from "react";
import useStore from "../store";
import { getPreviousRequests } from "../api/userApi";

const PreviousRequests: FC = () => {
  const { user, setUser } = useStore();

  useEffect(() => {
    const fetchPreviousRequests = async () => {
      try {
        const requests = await getPreviousRequests(user.userId);
        setUser({ previousRequests: requests });
      } catch (error) {
        console.error("Error fetching previous requests:", error);
      }
    };

    if (user.userId) {
      fetchPreviousRequests();
    }
  }, [user.userId]);

  return (
    <div className='w-full py-4 pl-4 pr-2 border border-gray-700 rounded-lg h-[332px] flex flex-col'>
      <h2 className='text-xl font-semibold text-white mb-4'>
        Previous Requests
      </h2>
      <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 pr-2'>
        {user.previousRequests?.length === 0 ? (
          <p className='text-gray-400 text-center'>No previous requests yet.</p>
        ) : (
          <div className='space-y-4'>
            {user.previousRequests?.map((request) => (
              <div
                key={request.id}
                className='p-3 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors'
              >
                <p className='text-white mb-2'>{request.text}</p>
                <p className='text-sm text-gray-400'>
                  {new Date(request.timestamp).toLocaleDateString()} at{" "}
                  {new Date(request.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousRequests;
