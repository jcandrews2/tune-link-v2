import React from "react";
import type { Artist } from "../types";
import MarqueeText from "./MarqueeText";
import Loading from "./Loading";
import ExpandedDetails from "./ExpandedDetails";

interface ArtistCardProps {
  artist: Artist;
  index: number;
  isExpanded: boolean;
  isLoading: boolean;
  itemDetails: any;
  onCardClick: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  index,
  isExpanded,
  isLoading,
  itemDetails,
  onCardClick,
}) => {
  return (
    <div
      className={`border border-gray-700 rounded p-4 hover:border-white transition-colors cursor-pointer relative ${
        isExpanded ? "border-white" : ""
      }`}
      onClick={onCardClick}
    >
      <div className='flex-1 min-w-0 overflow-hidden'>
        <MarqueeText text={artist.name} className='font-semibold' />
        <MarqueeText
          text={`#${index + 1}`}
          className='text-sm text-gray-400 font-light'
        />
        {isExpanded && (
          <ExpandedDetails
            itemId={artist.spotifyId}
            itemDetails={itemDetails}
          />
        )}
      </div>
      {isLoading && (
        <div className='absolute inset-0 bg-opacity-50 flex items-center justify-center rounded'>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default ArtistCard;
