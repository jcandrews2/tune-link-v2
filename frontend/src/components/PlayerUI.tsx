import React, { useEffect, useState, FC, useRef } from "react";
import { createPortal } from "react-dom";
import SliderUI from "./SliderUI";
import MediaControls from "./MediaControls";
import useStore from "../store";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useLocation } from "react-router-dom";
import MarqueeText from "./MarqueeText";
import { getDominantColor } from "../utils/playerUtils";
import { handleLike, handleDislike } from "../utils/userUtils";
import { Track, SpotifyPlayer } from "../types";
import { useDocumentSize } from "../hooks/useDocumentSize";

interface CardProps {
  index: number;
  isActive: boolean;
  currentTrack: Track | null;
  onSwipe: (direction: number) => void;
  animationKey: number;
  disabled?: boolean;
  spotifyPlayer: SpotifyPlayer;
}

const Card: FC<CardProps> = ({
  index,
  isActive,
  currentTrack,
  onSwipe,
  animationKey,
  disabled,
  spotifyPlayer,
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [-30, -5, 0, 5, 30]
  );
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const scale = useTransform(x, [-200, -100, 0, 100, 200], [0.8, 1, 1, 1, 0.8]);
  const [shouldShowContent, setShouldShowContent] = useState(false);
  const swipeLocked = useRef(false);

  useEffect(() => {
    if (currentTrack && isActive) {
      const timer = setTimeout(() => {
        setShouldShowContent(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setShouldShowContent(false);
    }
  }, [currentTrack?.id, isActive]);

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 150 && !swipeLocked.current) {
      swipeLocked.current = true;
      const direction = x.get() > 0 ? 1 : -1;
      onSwipe(direction);

      // Reset lock after animation completes
      setTimeout(() => {
        swipeLocked.current = false;
      }, 1500);
    }
  };

  const renderCover = () => (
    <div className='relative aspect-square z-0'>
      {currentTrack && (
        <>
          <div
            className='absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-sm blur-[50px] animate-fadeIn aspect-square z-0'
            key={animationKey}
            style={{
              backgroundColor: spotifyPlayer.dominantColor || "transparent",
              animationDuration: "2s",
            }}
          />
          <img
            src={currentTrack.album.images[0].url}
            className='absolute z-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-sm aspect-square animate-fadeIn'
            alt='Cover'
            id='album-cover'
            key={`cover-${currentTrack.id}-${animationKey}`}
          />
        </>
      )}
    </div>
  );

  const renderCardContent = () => {
    if (!isActive || !shouldShowContent || !currentTrack) {
      return (
        <>
          <div
            className='aspect-square bg-gray-900/50 rounded-sm flex items-center justify-center'
            key={`card-cover-${index}`}
          ></div>
          <div
            className='h-16 rounded-sm bg-gray-900/50 w-full mt-4'
            key={`card-details-${index}`}
          ></div>
        </>
      );
    }

    return currentTrack ? (
      <>
        {renderCover()}
        <motion.div
          className='relative py-2 z-10 text-left'
          key={`track-details-${currentTrack.id}-${animationKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MarqueeText
            text={currentTrack.name}
            className='text-xl font-bold text-white h-10'
          />
          <MarqueeText
            text={currentTrack.artists[0].name}
            className='text-gray-400 h-6 font-light'
          />
        </motion.div>
      </>
    ) : (
      <>
        {renderCover()}
        <div
          className='h-16 rounded-sm bg-gray-900/50 w-[100px] mt-4'
          key={`placeholder-${index}-${animationKey}`}
        ></div>
      </>
    );
  };

  return (
    <motion.div
      className='absolute top-0 left-1/2 -translate-x-1/2 
        w-[18rem]
        xs:w-[22rem]
        sm:w-[38rem]
        md:w-[40rem]
        xl:w-full
        h-full'
      style={{ zIndex: 100 - index }}
    >
      <motion.div
        style={{
          x,
          rotate,
          opacity,
          scale,
        }}
        animate={{
          scale: isActive ? 1 : 0.95,
        }}
        initial={{
          scale: 0.95,
        }}
        drag={
          isActive && !disabled && !spotifyPlayer.isDraggingSlider ? "x" : false
        }
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        dragElastic={0.7}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          mass: 0.8,
          scale: {
            duration: 0.15,
            ease: "easeOut",
          },
        }}
      >
        <div className='border border-gray-700 rounded-lg p-4 xl:p-8 cursor-grab bg-black active:cursor-grabbing relative mx-auto'>
          <div className='mx-auto'>{renderCardContent()}</div>
          <SliderUI disabled={!isActive || !currentTrack} />
          <MediaControls disabled={!isActive || !currentTrack} />
        </div>
      </motion.div>
    </motion.div>
  );
};

const PlayerUI: FC = () => {
  const { user, spotifyPlayer, setUser, setSpotifyPlayer } = useStore();
  const location = useLocation();
  const { width } = useDocumentSize();
  const isHomePage = location.pathname === "/";
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = user.recommendedSongs;

  useEffect(() => {
    if (isHomePage) {
      const container = document.getElementById("player-portal");
      setPortalContainer(container);
    } else if (width >= 1280) {
      // Only set mini-player portal on desktop
      const container = document.getElementById("mini-player-portal");
      setPortalContainer(container);
    } else {
      setPortalContainer(null);
    }
  }, [location, width]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!spotifyPlayer.player || !spotifyPlayer.currentTrack) return;

      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        if (spotifyPlayer.isPaused) {
          spotifyPlayer.player.resume();
        } else {
          spotifyPlayer.player.pause();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    spotifyPlayer.player,
    spotifyPlayer.currentTrack,
    spotifyPlayer.isPaused,
  ]);

  useEffect(() => {
    const updateColor = async () => {
      if (spotifyPlayer.currentTrack) {
        const imageUrl = spotifyPlayer.currentTrack.album.images[0].url;
        const color = await getDominantColor(imageUrl);
        setSpotifyPlayer({
          dominantColor: color || undefined,
          animationKey: (spotifyPlayer.animationKey ?? 0) + 1,
        });
      }
    };
    updateColor();
  }, [spotifyPlayer.currentTrack?.id]);

  const handleSwipe = (direction: number) => {
    if (direction > 0) {
      handleLike(spotifyPlayer, user, setUser);
    } else {
      handleDislike(spotifyPlayer, user, setUser);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const playerContent = (
    <div className='relative w-full h-full'>
      {user.recommendedSongs.length > 0 ? (
        cards
          .slice(0, Math.min(currentIndex + 2, cards.length))
          .map((_, i) => (
            <Card
              key={`card-${currentIndex + i}`}
              index={i}
              isActive={i === 0}
              currentTrack={i === 0 ? spotifyPlayer.currentTrack : null}
              onSwipe={handleSwipe}
              animationKey={spotifyPlayer.animationKey ?? 0}
              spotifyPlayer={spotifyPlayer}
            />
          ))
      ) : (
        <Card
          key='empty-card'
          index={0}
          isActive={true}
          currentTrack={null}
          onSwipe={() => {}}
          animationKey={0}
          disabled={true}
          spotifyPlayer={spotifyPlayer}
        />
      )}
    </div>
  );

  const miniPlayerContent = (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        touchAction: "none",
        zIndex: 50,
      }}
      className='w-[300px] h-[200px] select-none [&_*]:select-none'
    >
      <div className='w-full h-full p-6 border border-gray-700 rounded-lg bg-black'>
        {user.recommendedSongs.length > 0 && spotifyPlayer.currentTrack ? (
          <div className='h-full flex flex-col justify-center space-y-2'>
            <div>
              <MarqueeText
                text={spotifyPlayer.currentTrack.name}
                className='text-md font-bold text-white'
              />
              <MarqueeText
                text={spotifyPlayer.currentTrack.artists[0].name}
                className='text-gray-400 font-light'
              />
            </div>
            <div className='w-full slider-container'>
              <SliderUI />
            </div>
            <div className='w-full'>
              <MediaControls disabled={!spotifyPlayer.currentTrack} />
            </div>
          </div>
        ) : (
          <div className='h-full flex flex-col justify-center space-y-2'>
            <div className='h-16 rounded-sm bg-gray-900/50 w-full' />
            <div className='w-full slider-container'>
              <SliderUI disabled={true} />
            </div>
            <div className='w-full'>
              <MediaControls disabled={true} />
            </div>
          </div>
        )}
      </div>
      <div
        className='absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-[25px] blur-[50px] z-0 animate-fadeIn'
        key={spotifyPlayer.animationKey}
        style={{
          width: "250px",
          height: "150px",
          zIndex: -1,
          backgroundColor: spotifyPlayer.dominantColor || "transparent",
        }}
      />
    </div>
  );

  return portalContainer
    ? createPortal(
        isHomePage ? playerContent : miniPlayerContent,
        portalContainer
      )
    : null;
};

export default PlayerUI;
