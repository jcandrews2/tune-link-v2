import React, { FC, useState, useEffect } from "react";
import useStore from "../store";
import { userAxios } from "../utils/axiosUtils";
import { endpoints } from "../config/endpoints";
import { getLikedSongs } from "../api/userApi";
import type { Song } from "../types";

const RecommendationsPage: FC = () => {
  const { user, setUser } = useStore();

  // Placeholder data for artists
  const artists = [
    "Taylor Swift",
    "The Weeknd",
    "Drake",
    "Ed Sheeran",
    "Beyoncé",
    "Post Malone",
    "Ariana Grande",
    "Bad Bunny",
  ];

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const likedSongsData = await getLikedSongs(user.userId);
        setUser({ ...user, likedSongs: likedSongsData });
      } catch (error) {
        console.error("Failed to fetch liked songs:", error);
        setUser({ ...user, likedSongs: [] });
      }
    };

    if (user.userId) {
      fetchLikedSongs();
    }
    console.log("HERE", user.likedSongs);
  }, [user.userId, user.recommendedSongs]);

  return (
    <div id='mini-player-portal' className='h-full'>
      <div className='container mx-auto h-full flex flex-col p-4'>
        <div className='flex gap-4 h-[332px]'>
          {/* Top Artists Section */}
          <div className='w-1/2'>
            <div className='w-full py-4 pl-4 pr-2 border border-gray-700 rounded-lg h-full flex flex-col'>
              <div className='flex justify-between items-center mb-4 pr-2'>
                <h2 className='text-xl font-semibold'>Top Artists</h2>
              </div>
              <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 pr-2'>
                <div className='space-y-4'>
                  {artists.map((artist, index) => (
                    <div
                      key={artist}
                      className='flex items-center justify-between border border-gray-700 rounded p-3 hover:border-gray-600 transition-colors cursor-pointer'
                    >
                      <div>
                        <p className='font-medium'>{artist}</p>
                        <p className='text-sm text-gray-400'>#{index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Liked Songs Section */}
          <div className='w-1/2'>
            <div className='w-full py-4 pl-4 pr-2 border border-gray-700 rounded-lg h-full flex flex-col'>
              <h2 className='text-xl font-semibold mb-4'>Liked Songs</h2>
              <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 pr-2'>
                <div className='space-y-4'>
                  {user.likedSongs.map((song: Song) => (
                    <div
                      key={`${song.name}-${song.artist}`}
                      className='flex items-center justify-between border border-gray-700 rounded p-3 hover:border-gray-600 transition-colors cursor-pointer'
                    >
                      <div className='flex gap-2'>
                        <p className='font-medium'>{song.name}</p>
                        <p className='text-sm text-gray-400'>{song.artist}</p>
                      </div>
                      <span className='text-gray-400'>{song.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
