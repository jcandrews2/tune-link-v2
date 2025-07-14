import React from "react";
import MarqueeText from "./MarqueeText";
import Loading from "./Loading";

interface ExpandedDetailsProps {
  itemId: string;
  itemDetails: {
    type: "track" | "artist";
    details: any;
  } | null;
}

const ExpandedDetails: React.FC<ExpandedDetailsProps> = ({
  itemId,
  itemDetails,
}) => {
  const LoadingState = () => (
    <div className='mt-3 l origin-top h-[100px]'>
      <div className='flex items-start gap-4'>
        <div className='w-24 h-24 bg-gray-900 rounded-lg flex items-center justify-center'>
          <Loading />
        </div>
        <div className='flex-1 space-y-3'>
          <div className='h-6 bg-gray-900 rounded w-3/4'></div>
          <div className='h-4 bg-gray-900 rounded w-1/2'></div>
        </div>
      </div>
    </div>
  );

  if (!itemDetails) {
    return <LoadingState />;
  }

  return (
    <div className='mt-3 origin-top h-[100px]'>
      {itemDetails.type === "track" && (
        <div className='flex items-start gap-4'>
          <img
            src={itemDetails.details.album.images[0].url}
            alt={itemDetails.details.name}
            className='w-24 h-24 rounded-sm'
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
              className='w-24 h-24 rounded-sm'
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
              {itemDetails.details.genres.length > 0 && (
                <MarqueeText
                  key={itemDetails.details.genres[0]}
                  text={itemDetails.details.genres[0]}
                  className='px-2 py-1 text-xs bg-gray-900 rounded-full w-[30px]'
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandedDetails;
