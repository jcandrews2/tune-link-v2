import React, { useState } from "react";

interface CarouselProps {
  children: React.ReactNode[];
  titles: string[];
}

const Carousel: React.FC<CarouselProps> = ({ children, titles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className='relative w-full flex flex-col gap-4'>
      {/* Main carousel content */}
      <div className='relative overflow-hidden rounded-lg'>
        <div
          className='w-full transition-transform duration-300 ease-in-out'
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            display: "flex",
          }}
        >
          {children.map((child, index) => (
            <div key={index} className='w-full flex-shrink-0 max-h-[600px]'>
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Title and dots navigation */}
      <div className='w-full'>
        <h3 className='text-center text-lg font-semibold text-white mb-2'>
          {titles[currentIndex]}
        </h3>
        <div className='flex justify-center gap-2'>
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 w-2 rounded-full transition-all ${
                currentIndex === index ? "bg-white w-4" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
