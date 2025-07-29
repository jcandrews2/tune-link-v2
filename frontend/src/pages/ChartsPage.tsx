import React, { FC, useEffect, useState } from "react";
import useStore from "../store";
import { getDislikedSongs, getLikedSongs, getTopArtists } from "../api/userApi";
import { getTrackDetails, getArtistDetails } from "../api/spotifyApi";
import type { Song } from "../types";
import SongCard from "../components/SongCard";
import ArtistCard from "../components/ArtistCard";
import Chart from "../components/Chart";
import Carousel from "../components/Carousel";

type SectionType = "liked" | "disliked" | "artists";
type ItemType = "track" | "artist";
type ItemDetails = {
  type: ItemType;
  details: Record<string, unknown>;
};

const ChartsPage: FC = () => {
  const { user, setUser } = useStore();
  const [expandedItems, setExpandedItems] = useState<{
    [K in SectionType]?: string;
  }>({});
  const [itemDetails, setItemDetails] = useState<{
    [key: string]: ItemDetails;
  }>({});
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
        const detailsPromises: Promise<{
          id: string;
          type: ItemType;
          details: Record<string, unknown>;
        }>[] = [];

        if (likedSongsData?.[0]) {
          defaultExpanded.liked = likedSongsData[0].spotifyId;
          detailsPromises.push(
            getTrackDetails(likedSongsData[0].spotifyId).then((details) => ({
              id: likedSongsData[0].spotifyId,
              type: "track",
              details,
            }))
          );
        }
        if (dislikedSongsData?.[0]) {
          defaultExpanded.disliked = dislikedSongsData[0].spotifyId;
          detailsPromises.push(
            getTrackDetails(dislikedSongsData[0].spotifyId).then((details) => ({
              id: dislikedSongsData[0].spotifyId,
              type: "track",
              details,
            }))
          );
        }
        if (topArtistsData?.[0]) {
          defaultExpanded.artists = topArtistsData[0].spotifyId;
          detailsPromises.push(
            getArtistDetails(topArtistsData[0].spotifyId).then((details) => ({
              id: topArtistsData[0].spotifyId,
              type: "artist",
              details,
            }))
          );
        }

        setExpandedItems(defaultExpanded);

        // Fetch all default expanded items' details
        const results = await Promise.all(detailsPromises);
        const newDetails: { [key: string]: ItemDetails } = {};
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

  const handleArtistClick = async (artistId: string) => {
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

  return (
    <div className='flex flex-col flex-grow'>
      {/* Mobile View with Carousel */}
      <div className='xl:hidden w-full h-full p-4'>
        <Carousel titles={["Disliked Songs", "Artists", "Liked Songs"]}>
          <Chart title='Disliked Songs' className='w-full h-full'>
            {user.dislikedSongs?.map((song: Song) => (
              <SongCard
                key={song.spotifyId}
                song={song}
                isExpanded={expandedItems.disliked === song.spotifyId}
                isLoading={loadingItemId === song.spotifyId}
                itemDetails={itemDetails[song.spotifyId]}
                onCardClick={() => handleTrackClick(song, "disliked")}
                onArtistClick={handleArtistClick}
              />
            ))}
          </Chart>

          <Chart title='Artists' className='w-full h-full'>
            {user.topArtists?.map((artist, index) => (
              <ArtistCard
                key={artist.spotifyId}
                artist={artist}
                index={index}
                isExpanded={expandedItems.artists === artist.spotifyId}
                isLoading={loadingItemId === artist.spotifyId}
                itemDetails={itemDetails[artist.spotifyId]}
                onCardClick={() => handleArtistClick(artist.spotifyId)}
              />
            ))}
          </Chart>

          <Chart title='Liked Songs' className='w-full h-full'>
            {user.likedSongs?.map((song: Song) => (
              <SongCard
                key={song.spotifyId}
                song={song}
                isExpanded={expandedItems.liked === song.spotifyId}
                isLoading={loadingItemId === song.spotifyId}
                itemDetails={itemDetails[song.spotifyId]}
                onCardClick={() => handleTrackClick(song, "liked")}
                onArtistClick={handleArtistClick}
              />
            ))}
          </Chart>
        </Carousel>
      </div>

      {/* Desktop View */}
      <div
        id='mini-player-portal'
        className='hidden xl:flex flex-row justify-center items-start gap-4 mx-auto container relative'
      >
        <Chart title='Disliked Songs' className='w-1/3 relative z-0 h-[366px]'>
          {user.dislikedSongs?.map((song: Song) => (
            <SongCard
              key={song.spotifyId}
              song={song}
              isExpanded={expandedItems.disliked === song.spotifyId}
              isLoading={loadingItemId === song.spotifyId}
              itemDetails={itemDetails[song.spotifyId]}
              onCardClick={() => handleTrackClick(song, "disliked")}
              onArtistClick={handleArtistClick}
            />
          ))}
        </Chart>

        <Chart
          title='Artists'
          className='w-1/3 flex justify-center z-10 h-[600px]'
        >
          {user.topArtists?.map((artist, index) => (
            <ArtistCard
              key={artist.spotifyId}
              artist={artist}
              index={index}
              isExpanded={expandedItems.artists === artist.spotifyId}
              isLoading={loadingItemId === artist.spotifyId}
              itemDetails={itemDetails[artist.spotifyId]}
              onCardClick={() => handleArtistClick(artist.spotifyId)}
            />
          ))}
        </Chart>

        <Chart title='Liked Songs' className='w-1/3 relative z-0 h-[366px]'>
          {user.likedSongs?.map((song: Song) => (
            <SongCard
              key={song.spotifyId}
              song={song}
              isExpanded={expandedItems.liked === song.spotifyId}
              isLoading={loadingItemId === song.spotifyId}
              itemDetails={itemDetails[song.spotifyId]}
              onCardClick={() => handleTrackClick(song, "liked")}
              onArtistClick={handleArtistClick}
            />
          ))}
        </Chart>
      </div>
    </div>
  );
};

export default ChartsPage;
