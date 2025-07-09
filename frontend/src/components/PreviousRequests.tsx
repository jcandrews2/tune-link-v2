import React, { FC, useEffect, useState } from "react";
import useStore from "../store";
import Loading from "./Loading";
import { getPreviousRequests, submitMusicRequest } from "../api/userApi";

const PreviousRequests: FC = () => {
  const { user, setUser } = useStore();
  const [loadingRequestId, setLoadingRequestId] = useState<string | null>(null);

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

  const handleRequestClick = async (requestId: string, requestText: string) => {
    try {
      setLoadingRequestId(requestId);
      const recommendations = await submitMusicRequest(
        user.userId,
        requestText
      );
      setUser({ recommendedSongs: recommendations });
    } catch (error) {
      console.error("Error replaying request:", error);
    } finally {
      setLoadingRequestId(null);
    }
  };

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
                className='p-3 border border-gray-700 rounded-lg hover:border-white transition-colors cursor-pointer relative'
                onClick={() => handleRequestClick(request.id, request.text)}
              >
                {loadingRequestId === request.id ? (
                  <div className='absolute inset-0 bg-black bg-opacity-80 rounded-lg flex items-center justify-center'>
                    <Loading />
                  </div>
                ) : null}
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
