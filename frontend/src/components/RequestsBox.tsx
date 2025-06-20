import React, { FC, useState } from "react";
import useStore from "../store";
import {
  submitMusicRequest,
  addPreviousRequest,
  getPreviousRequests,
} from "../api/userApi";
import Loading from "./Loading";

const RequestsBox: FC = () => {
  const [requestText, setRequestText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser, setSpotifyPlayer } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requestText.trim() || !user.userId) return;

    setIsLoading(true);
    const trimmedRequest = requestText.trim();

    try {
      const recommendations = await submitMusicRequest(
        user.userId,
        trimmedRequest
      );
      console.log("Recommendations received:", recommendations);

      await addPreviousRequest(user.userId, trimmedRequest);

      const previousRequests = await getPreviousRequests(user.userId);
      setUser({
        recommendedSongs: recommendations,
        previousRequests,
      });
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setIsLoading(false);
      setRequestText("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    if (input.length <= 100) {
      setRequestText(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (requestText.trim() && !isLoading) {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className='w-full p-4 border border-gray-700 rounded-lg'>
      <h2 className='text-xl font-semibold text-white mb-4'> Make Request</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='relative'>
          <textarea
            value={requestText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder='I want to hear old indie rock songs with heavy guitar riffs.'
            maxLength={100}
            className='w-full h-[200px] p-3  text-white rounded-lg resize-none 
                     border border-gray-600 focus:border-white focus:outline-none
                     placeholder:text-gray-400 bg-black'
            disabled={isLoading}
          />
          <div className='absolute bottom-2 right-2 text-sm text-gray-400'>
            {requestText.length}/100
          </div>
        </div>
        <button
          type='submit'
          disabled={isLoading || !requestText.trim()}
          className='w-full py-2 px-4 bg-white text-black rounded-full
                  disabled:bg-gray-600 disabled:cursor-not-allowed'
        >
          {isLoading ? <Loading /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default RequestsBox;
