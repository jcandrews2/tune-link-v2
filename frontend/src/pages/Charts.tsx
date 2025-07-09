import React, { FC, useEffect } from "react";
import useStore from "../store";
import { getDislikedSongs, getLikedSongs, getTopArtists } from "../api/userApi";
import type { Song } from "../types";
import MarqueeText from "../components/MarqueeText";

const Charts: FC = () => {
  const { user, setUser } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!user.userId) return;

      try {
        const [likedSongsData, dislikedSongsData, topArtistsData] =
          await Promise.all([
            getLikedSongs(user.userId),
            getDislikedSongs(user.userId),
            getTopArtists(user.userId),
          ]);

        setUser({
          ...user,
          likedSongs: likedSongsData,
          dislikedSongs: dislikedSongsData,
          topArtists: topArtistsData,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setUser({
          ...user,
          likedSongs: [],
          dislikedSongs: [],
          topArtists: [],
        });
      }
    };

    fetchData();
  }, [user.userId]);

  return (
    <div id='mini-player-portal' className='h-full'>
      <div className='container mx-auto h-full flex flex-col p-4 gap-4'>
        <div className='flex gap-4 h-[332px]'>
          {/* Liked Songs Section */}
          <div className='w-1/3'>
            <div className='w-full py-4 pl-4 pr-2 border border-gray-700 rounded-lg h-full flex flex-col'>
              <div className='flex justify-between items-center mb-4 pr-2'>
                <h2 className='text-xl font-semibold'>Liked Songs</h2>
              </div>
              <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 pr-2'>
                <div className='space-y-4'>
                  {user.likedSongs?.map((song: Song) => (
                    <div
                      key={`${song.name}-${song.artist}`}
                      className='flex items-center justify-between border border-gray-700 rounded p-3 hover:border-gray-600 transition-colors cursor-pointer'
                    >
                      <div className='flex-1 min-w-0'>
                        <MarqueeText text={song.name} className='font-medium' />
                        <MarqueeText
                          text={song.artist}
                          className='text-sm text-gray-400'
                        />
                      </div>
                      <span className='text-gray-400 ml-2 flex-shrink-0'>
                        {song.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Artists Section */}
          <div className='w-1/3'>
            <div className='w-full py-4 pl-4 pr-2 border border-gray-700 rounded-lg h-full flex flex-col'>
              <div className='flex justify-between items-center mb-4 pr-2'>
                <h2 className='text-xl font-semibold'>Top Artists</h2>
              </div>
              <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 pr-2'>
                <div className='space-y-4'>
                  {user.topArtists?.map((artist, index) => (
                    <div
                      key={artist}
                      className='flex items-center justify-between border border-gray-700 rounded p-3 hover:border-gray-600 transition-colors cursor-pointer'
                    >
                      <div className='flex-1 min-w-0'>
                        <MarqueeText text={artist} className='font-medium' />
                        <p className='text-sm text-gray-400'>#{index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Disliked Songs Section */}
          <div className='w-1/3'>
            <div className='w-full py-4 pl-4 pr-2 border border-gray-700 rounded-lg h-full flex flex-col'>
              <div className='flex justify-between items-center mb-4 pr-2'>
                <h2 className='text-xl font-semibold'>Disliked Songs</h2>
              </div>
              <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 pr-2'>
                <div className='space-y-4'>
                  {user.dislikedSongs?.map((song: Song) => (
                    <div
                      key={`${song.name}-${song.artist}`}
                      className='flex items-center justify-between border border-gray-700 rounded p-3 hover:border-gray-600 transition-colors cursor-pointer'
                    >
                      <div className='flex-1 min-w-0'>
                        <MarqueeText text={song.name} className='font-medium' />
                        <MarqueeText
                          text={song.artist}
                          className='text-sm text-gray-400'
                        />
                      </div>
                      <span className='text-gray-400 ml-2 flex-shrink-0'>
                        {song.duration}
                      </span>
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

export default Charts;
