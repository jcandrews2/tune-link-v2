import React, { FC, useEffect, useState } from "react";
import useStore from "../store";
import { getDislikedSongs, getLikedSongs, getTopArtists } from "../api/userApi";
import { getTrackDetails, getArtistDetails } from "../api/spotifyApi";
import type { Song, Artist } from "../types";
import MarqueeText from "../components/MarqueeText";
import Loading from "../components/Loading";

const Charts: FC = () => {
  const { user, setUser } = useStore();
  const [selectedItem, setSelectedItem] = useState<{
    type: "track" | "artist";
    id: string;
    details: any;
  } | null>(null);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

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

  const handleTrackClick = async (song: Song) => {
    try {
      setLoadingItemId(song.spotifyId);
      const details = await getTrackDetails(song.spotifyId);
      setSelectedItem({
        type: "track",
        id: song.spotifyId,
        details,
      });
    } catch (error) {
      console.error("Error fetching track details:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleArtistClick = async (artistId: string, artistName: string) => {
    try {
      setLoadingItemId(artistId);
      const details = await getArtistDetails(artistId);
      setSelectedItem({
        type: "artist",
        id: artistId,
        details,
      });
    } catch (error) {
      console.error("Error fetching artist details:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  useEffect(() => {
    console.log(selectedItem);
  }, [selectedItem]);

  const renderDetails = () => {
    if (!selectedItem) return null;

    return (
      <div className='w-full max-w-[33.333%] py-4 pl-4 pr-2 border border-gray-700 rounded-lg'>
        <div className='space-y-4'>
          {selectedItem.type === "track" && (
            <>
              <div className='flex items-start gap-4'>
                <img
                  src={selectedItem.details.album.images[0].url}
                  alt={selectedItem.details.name}
                  className='w-32 h-32 rounded-lg'
                />
                <div>
                  <h3 className='text-xl font-semibold'>
                    {selectedItem.details.name}
                  </h3>
                  <div
                    className='text-gray-400 hover:text-white cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArtistClick(
                        selectedItem.details.artists[0].id,
                        selectedItem.details.artists[0].name
                      );
                    }}
                  >
                    <MarqueeText
                      text={selectedItem.details.artists[0].name}
                      className='text-sm'
                    />
                  </div>
                  <p className='text-gray-400'>
                    {selectedItem.details.album.name}
                  </p>
                </div>
              </div>
            </>
          )}
          {selectedItem.type === "artist" && (
            <>
              <div className='flex items-start gap-4'>
                {selectedItem.details.images?.[0]?.url && (
                  <img
                    src={selectedItem.details.images[0].url}
                    alt={selectedItem.details.name}
                    className='w-32 h-32 rounded-lg'
                  />
                )}
                <div>
                  <h3 className='text-xl font-semibold'>
                    {selectedItem.details.name}
                  </h3>
                  <p className='text-gray-400'>
                    Followers:{" "}
                    {selectedItem.details.followers.total.toLocaleString()}
                  </p>

                  <div className='flex flex-wrap gap-2 mt-2'>
                    {selectedItem.details.genres.map((genre: string) => (
                      <span
                        key={genre}
                        className='px-2 py-1 text-sm bg-gray-800 rounded-full'
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

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
                      key={`${song.name}-${song.artist.name}`}
                      className='flex items-center justify-between border border-gray-700 rounded p-3 hover:border-white transition-colors cursor-pointer relative'
                      onClick={() => handleTrackClick(song)}
                    >
                      <div className='flex-1 min-w-0'>
                        <MarqueeText text={song.name} className='font-medium' />
                        <div
                          className='text-gray-400 hover:text-white cursor-pointer'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArtistClick(
                              song.artist.spotifyId,
                              song.artist.name
                            );
                          }}
                        >
                          <MarqueeText
                            text={song.artist.name}
                            className='text-sm'
                          />
                        </div>
                      </div>
                      <span className='text-gray-400 ml-2 flex-shrink-0'>
                        {song.duration}
                      </span>
                      {loadingItemId === song.spotifyId && (
                        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded'>
                          <Loading />
                        </div>
                      )}
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
                      key={artist.spotifyId}
                      className='flex items-center justify-between border border-gray-700 rounded p-3 hover:border-white transition-colors cursor-pointer relative'
                      onClick={() =>
                        handleArtistClick(artist.spotifyId, artist.name)
                      }
                    >
                      <div className='flex-1 min-w-0'>
                        <MarqueeText
                          text={artist.name}
                          className='font-medium'
                        />
                        <p className='text-sm text-gray-400'>#{index + 1}</p>
                      </div>
                      {loadingItemId === artist.spotifyId && (
                        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded'>
                          <Loading />
                        </div>
                      )}
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
                      key={`${song.name}-${song.artist.name}`}
                      className='flex items-center justify-between border border-gray-700 rounded p-3 hover:border-white transition-colors cursor-pointer relative'
                      onClick={() => handleTrackClick(song)}
                    >
                      <div className='flex-1 min-w-0'>
                        <MarqueeText text={song.name} className='font-medium' />
                        <div
                          className='text-gray-400 hover:text-white cursor-pointer'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArtistClick(
                              song.artist.spotifyId,
                              song.artist.name
                            );
                          }}
                        >
                          <MarqueeText
                            text={song.artist.name}
                            className='text-sm'
                          />
                        </div>
                      </div>
                      <span className='text-gray-400 ml-2 flex-shrink-0'>
                        {song.duration}
                      </span>
                      {loadingItemId === song.spotifyId && (
                        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded'>
                          <Loading />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {renderDetails()}
      </div>
    </div>
  );
};

export default Charts;
