import React, { FC, useState } from "react";
import useStore from "../store";
import { submitMusicRequest } from "../api/userApi";

const RequestsBox: FC = () => {
  const [request, setRequest] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser, setSpotifyPlayer } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!request.trim() || !user.userId) return;

    setIsLoading(true);

    try {
      const recommendations = await submitMusicRequest(
        user.userId,
        request.trim()
      );
      console.log("Recommendations received:", recommendations);
      setUser({ recommendedSongs: recommendations });
      console.log("Request submitted and recommendations updated.");
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setIsLoading(false);
      setRequest("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    if (input.length <= 100) {
      setRequest(input);
    }
  };

  return (
    <div className='w-full p-4 bg-black border border-gray-700 rounded-lg'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='relative'>
          <textarea
            value={request}
            onChange={handleChange}
            placeholder='I want to hear old indie rock songs with heavy guitar riffs.'
            maxLength={100}
            className='w-full h-[200px] p-3 bg-black text-white rounded-lg resize-none 
                     border border-gray-600 focus:border-white focus:outline-none
                     placeholder:text-gray-400'
            disabled={isLoading}
          />
          <div className='absolute bottom-2 right-2 text-sm text-gray-400'>
            {request.length}/100
          </div>
        </div>
        <button
          type='submit'
          disabled={isLoading || !request.trim()}
          className='w-full py-2 px-4 bg-white text-black rounded-full
                  disabled:bg-gray-600 disabled:cursor-not-allowed'
        >
          {isLoading ? "Getting recommendations..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default RequestsBox;
