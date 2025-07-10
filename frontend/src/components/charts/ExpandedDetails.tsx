import React from "react";
import MarqueeText from "../MarqueeText";

interface ExpandedDetailsProps {
  itemId: string;
  itemDetails: {
    type: "track" | "artist";
    details: any;
  };
}

const ExpandedDetails: React.FC<ExpandedDetailsProps> = ({
  itemId,
  itemDetails,
}) => {
  if (!itemDetails) return null;

  return (
    <div className='mt-3 space-y-4 animate-expand-vertical origin-top'>
      {itemDetails.type === "track" && (
        <div className='flex items-start gap-4'>
          <img
            src={itemDetails.details.album.images[0].url}
            alt={itemDetails.details.name}
            className='w-24 h-24 rounded-lg'
          />
          <div className='flex-1 min-w-0'>
            <div className='text-lg font-semibold'>
              <MarqueeText text={itemDetails.details.name} />
            </div>
            <div className='text-gray-400 flex items-center gap-1'>
              <MarqueeText text={itemDetails.details.album.name} />
            </div>
          </div>
        </div>
      )}
      {itemDetails.type === "artist" && (
        <div className='flex items-start gap-4'>
          {itemDetails.details.images?.[0]?.url && (
            <img
              src={itemDetails.details.images[0].url}
              alt={itemDetails.details.name}
              className='w-24 h-24 rounded-lg'
            />
          )}
          <div>
            <h3 className='text-lg font-semibold'>
              {itemDetails.details.name}
            </h3>
            <p className='text-gray-400'>
              Followers: {itemDetails.details.followers.total.toLocaleString()}
            </p>
            <div className='flex flex-wrap gap-2 mt-2'>
              {itemDetails.details.genres.map((genre: string) => (
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

export default ExpandedDetails;
