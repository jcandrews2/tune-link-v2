import React, { FC, useState } from "react";

const RecommendationsPage: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    "genres" | "moods" | "artists"
  >("genres");

  const topGenres = ["Hip-Hop", "R&B", "Pop"];
  const topMoods = ["Energetic", "Chill", "Happy"];
  const topArtists = ["Artist 1", "Artist 2", "Artist 3"];
  const likedSongs = [
    { title: "Song 1", artist: "Artist 1", duration: "3:45" },
    { title: "Song 2", artist: "Artist 2", duration: "4:20" },
    { title: "Song 3", artist: "Artist 3", duration: "3:15" },
    { title: "Song 4", artist: "Artist 4", duration: "3:30" },
    { title: "Song 5", artist: "Artist 5", duration: "4:10" },
  ];

  const getCategoryData = () => {
    switch (selectedCategory) {
      case "genres":
        return { title: "Top Genres", data: topGenres };
      case "moods":
        return { title: "Top Moods", data: topMoods };
      case "artists":
        return { title: "Top Artists", data: topArtists };
    }
  };

  const { title, data } = getCategoryData();

  return (
    <div id='mini-player-portal' className='h-full'>
      <div className='container mx-auto h-full flex flex-col p-4'>
        <div className='flex gap-4 h-[332px]'>
          {/* Top Stats Section */}
          <div className='w-1/2'>
            <div className='w-full py-4 pl-4 pr-2 border border-gray-700 rounded-lg h-full flex flex-col'>
              <div className='flex justify-between items-center mb-4 pr-2'>
                <h2 className='text-xl font-semibold'>{title}</h2>
                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value as "genres" | "moods" | "artists"
                    )
                  }
                  className='bg-transparent border border-gray-700 rounded px-3 py-1 text-sm focus:outline-none focus:border-gray-500'
                >
                  <option value='genres'>Genres</option>
                  <option value='moods'>Moods</option>
                  <option value='artists'>Artists</option>
                </select>
              </div>
              <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 pr-2'>
                <div className='space-y-4'>
                  {data.map((item, index) => (
                    <div
                      key={item}
                      className='flex items-center justify-between border border-gray-700 rounded p-3 hover:border-gray-600 transition-colors cursor-pointer'
                    >
                      <div>
                        <p className='font-medium'>{item}</p>
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
                  {likedSongs.map((song) => (
                    <div
                      key={song.title}
                      className='flex items-center justify-between border border-gray-700 rounded p-3 hover:border-gray-600 transition-colors cursor-pointer'
                    >
                      <div>
                        <p className='font-medium'>{song.title}</p>
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
