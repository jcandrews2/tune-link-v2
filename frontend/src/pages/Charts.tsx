import React, { FC, useEffect, useState } from "react";
import useStore from "../store";
import { getDislikedSongs, getLikedSongs, getTopArtists } from "../api/userApi";
import { getTrackDetails, getArtistDetails } from "../api/spotifyApi";
import type { Song, Artist } from "../types";
import MarqueeText from "../components/MarqueeText";
import Loading from "../components/Loading";

type SectionType = "liked" | "disliked" | "artists";
type ItemDetailsType = {
  id: string;
  type: "track" | "artist";
  details: any;
};

const Charts: FC = () => {
  const { user, setUser } = useStore();
  const [expandedItems, setExpandedItems] = useState<{
    [K in SectionType]?: string;
  }>({});
  const [itemDetails, setItemDetails] = useState<{ [key: string]: any }>({});
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

        // Set and fetch details for default expanded items
        const defaultExpanded: { [K in SectionType]?: string } = {};
        const detailsPromises: Promise<ItemDetailsType>[] = [];

        if (likedSongsData?.[0]) {
          defaultExpanded.liked = likedSongsData[0].spotifyId;
          detailsPromises.push(
            getTrackDetails(likedSongsData[0].spotifyId).then((details) => ({
              id: likedSongsData[0].spotifyId,
              type: "track" as const,
              details,
            }))
          );
        }
        if (dislikedSongsData?.[0]) {
          defaultExpanded.disliked = dislikedSongsData[0].spotifyId;
          detailsPromises.push(
            getTrackDetails(dislikedSongsData[0].spotifyId).then((details) => ({
              id: dislikedSongsData[0].spotifyId,
              type: "track" as const,
              details,
            }))
          );
        }
        if (topArtistsData?.[0]) {
          defaultExpanded.artists = topArtistsData[0].spotifyId;
          detailsPromises.push(
            getArtistDetails(topArtistsData[0].spotifyId).then((details) => ({
              id: topArtistsData[0].spotifyId,
              type: "artist" as const,
              details,
            }))
          );
        }

        setExpandedItems(defaultExpanded);

        // Fetch all default expanded items' details
        const results = await Promise.all(detailsPromises);
        const newDetails: { [key: string]: any } = {};
        results.forEach((result) => {
          newDetails[result.id] = {
            type: result.type,
            details: result.details,
          };
        });
        setItemDetails(newDetails);
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

  const handleTrackClick = async (song: Song, section: SectionType) => {
    try {
      setLoadingItemId(song.spotifyId);

      if (expandedItems[section] === song.spotifyId) {
        // Collapse current item
        setExpandedItems((prev) => {
          const newItems = { ...prev };
          delete newItems[section];
          return newItems;
        });
      } else {
        // Expand new item
        if (!itemDetails[song.spotifyId]) {
          const details = await getTrackDetails(song.spotifyId);
          setItemDetails((prev) => ({
            ...prev,
            [song.spotifyId]: { type: "track", details },
          }));
        }
        setExpandedItems((prev) => ({
          ...prev,
          [section]: song.spotifyId,
        }));
      }
    } catch (error) {
      console.error("Error fetching track details:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleArtistClick = async (artistId: string, artistName: string) => {
    try {
      setLoadingItemId(artistId);

      if (expandedItems.artists === artistId) {
        // Collapse current item
        setExpandedItems((prev) => {
          const newItems = { ...prev };
          delete newItems.artists;
          return newItems;
        });
      } else {
        // Expand new item
        if (!itemDetails[artistId]) {
          const details = await getArtistDetails(artistId);
          setItemDetails((prev) => ({
            ...prev,
            [artistId]: { type: "artist", details },
          }));
        }
        setExpandedItems((prev) => ({
          ...prev,
          artists: artistId,
        }));
      }
    } catch (error) {
      console.error("Error fetching artist details:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  const renderExpandedDetails = (itemId: string) => {
    const item = itemDetails[itemId];
    if (!item) return null;

    return (
      <div className='mt-3 space-y-4 animate-expand-vertical origin-top'>
        {item.type === "track" && (
          <div className='flex items-start gap-4'>
            <img
              src={item.details.album.images[0].url}
              alt={item.details.name}
              className='w-24 h-24 rounded-lg'
            />
            <div>
              <h3 className='text-lg font-semibold'>{item.details.name}</h3>
              <div
                className='text-gray-400 hover:text-white cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation();
                  handleArtistClick(
                    item.details.artists[0].id,
                    item.details.artists[0].name
                  );
                }}
              >
                <MarqueeText
                  text={item.details.artists[0].name}
                  className='text-sm'
                />
              </div>
              <p className='text-gray-400'>{item.details.album.name}</p>
            </div>
          </div>
        )}
        {item.type === "artist" && (
          <div className='flex items-start gap-4'>
            {item.details.images?.[0]?.url && (
              <img
                src={item.details.images[0].url}
                alt={item.details.name}
                className='w-24 h-24 rounded-lg'
              />
            )}
            <div>
              <h3 className='text-lg font-semibold'>{item.details.name}</h3>
              <p className='text-gray-400'>
                Followers: {item.details.followers.total.toLocaleString()}
              </p>
              <div className='flex flex-wrap gap-2 mt-2'>
                {item.details.genres.map((genre: string) => (
                  <span
                    key={genre}
                    className='px-2 py-1 text-xs bg-gray-800 rounded-full'
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
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
                      className={`border border-gray-700 rounded p-3 hover:border-white transition-colors cursor-pointer relative ${
                        expandedItems.liked === song.spotifyId
                          ? "border-white"
                          : ""
                      }`}
                      onClick={() => handleTrackClick(song, "liked")}
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
                        <span className='text-gray-400 text-sm'>
                          {song.duration}
                        </span>
                        {expandedItems.liked === song.spotifyId &&
                          renderExpandedDetails(song.spotifyId)}
                      </div>
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
          <div className='w-1/3 h-[567.5px]'>
            <div className='w-full py-4 pl-4 pr-2 border border-gray-700 rounded-lg h-full flex flex-col'>
              <div className='flex justify-between items-center mb-4 pr-2'>
                <h2 className='text-xl font-semibold'>Top Artists</h2>
              </div>
              <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 pr-2'>
                <div className='space-y-4'>
                  {user.topArtists?.map((artist, index) => (
                    <div
                      key={artist.spotifyId}
                      className={`border border-gray-700 rounded p-3 hover:border-white transition-colors cursor-pointer relative ${
                        expandedItems.artists === artist.spotifyId
                          ? "border-white"
                          : ""
                      }`}
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
                        {expandedItems.artists === artist.spotifyId &&
                          renderExpandedDetails(artist.spotifyId)}
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
                      className={`border border-gray-700 rounded p-3 hover:border-white transition-colors cursor-pointer relative ${
                        expandedItems.disliked === song.spotifyId
                          ? "border-white"
                          : ""
                      }`}
                      onClick={() => handleTrackClick(song, "disliked")}
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
                        <span className='text-gray-400 text-sm'>
                          {song.duration}
                        </span>
                        {expandedItems.disliked === song.spotifyId &&
                          renderExpandedDetails(song.spotifyId)}
                      </div>
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
      </div>
    </div>
  );
};

export default Charts;
