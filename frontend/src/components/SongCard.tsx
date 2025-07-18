import React, { useEffect } from "react";
import type { Song } from "../types";
import MarqueeText from "./MarqueeText";
import Loading from "./Loading";
import ExpandedDetails from "./ExpandedDetails";

interface SongCardProps {
  song: Song;
  isExpanded: boolean;
  isLoading: boolean;
  itemDetails: any;
  onCardClick: () => void;
  onArtistClick: (artistId: string, artistName: string) => void;
}

const SongCard: React.FC<SongCardProps> = ({
  song,
  isExpanded,
  isLoading,
  itemDetails,
  onCardClick,
  onArtistClick,
}) => {
  return (
    <div
      className={`border border-gray-700 rounded p-4 hover:border-white transition-colors cursor-pointer relative ${
        isExpanded ? "border-white" : ""
      }`}
      onClick={onCardClick}
    >
      <div className='flex-1 min-w-0 overflow-hidden'>
        <MarqueeText text={song.name} className='font-medium' />
        <div
          className='text-gray-400 cursor-pointer inline-block hover:text-white hover:border-b hover:border-white'
          onClick={(e) => {
            e.stopPropagation();
            onArtistClick(song.artistSpotifyId, song.artist);
          }}
        >
          <MarqueeText text={song.artist} className='text-sm' />
        </div>

        {isExpanded && (
          <ExpandedDetails itemId={song.spotifyId} itemDetails={itemDetails} />
        )}
      </div>
      {isLoading && (
        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded'>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default SongCard;
