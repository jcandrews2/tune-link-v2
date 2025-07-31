import React, { useState } from "react";
import { motion, PanInfo } from "framer-motion";

interface CarouselProps {
  children: React.ReactNode[];
  titles: string[];
}

const Carousel: React.FC<CarouselProps> = ({ children, titles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDragEnd = (_: never, info: PanInfo) => {
    const swipeThreshold = 50;
    const direction = info.offset.x > 0 ? -1 : 1;

    if (Math.abs(info.offset.x) > swipeThreshold) {
      const nextIndex = Math.max(
        0,
        Math.min(children.length - 1, currentIndex + direction)
      );
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <motion.div
      className='w-full h-full flex flex-col overflow-hidden'
      drag='x'
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ touchAction: "none" }}
    >
      {/* Carousel content that moves */}
      <motion.div
        className='w-full h-1/2 flex'
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children.map((child, index) => (
          <motion.div
            key={index}
            className='w-full h-full flex-shrink-0 p-4 pointer-events-auto'
          >
            {child}
          </motion.div>
        ))}
      </motion.div>

      {/* Title and dots navigation (static) */}
      <div className='w-full'>
        <h3 className='text-center text-lg font-semibold text-white mb-2'>
          {titles[currentIndex]}
        </h3>
        <div className='flex justify-center gap-2 pb-2'>
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
    </motion.div>
  );
};

export default Carousel;
