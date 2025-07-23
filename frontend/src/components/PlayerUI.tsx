import React, { useEffect, useState, FC, useRef } from "react";
import { createPortal } from "react-dom";
import SliderUI from "./SliderUI";
import MediaControls from "./MediaControls";
import useStore from "../store";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useLocation } from "react-router-dom";
import MarqueeText from "./MarqueeText";
import Loading from "./Loading";
import { getDominantColor } from "../utils/playerUtils";
import { handleLike, handleDislike } from "../utils/userUtils";
import { Track, SpotifyPlayer } from "../types";

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
      // Small delay to ensure the card has scaled up before showing content
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
    <div className='relative w-full aspect-square z-0 select-none'>
      {currentTrack ? (
        <>
          <div
            className='absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-sm blur-[50px] animate-fadeIn w-full h-full z-0'
            key={animationKey}
            style={{
              backgroundColor: spotifyPlayer.dominantColor || "transparent",
              animationDuration: "2s",
            }}
          />
          <img
            src={currentTrack.album.images[0].url}
            className='absolute z-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-sm w-full h-full animate-fadeIn'
            alt='Cover'
            id='album-cover'
            key={`cover-${currentTrack.id}-${animationKey}`}
          />
        </>
      ) : (
        <div
          className='absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-sm bg-gray-900/50 w-full h-full'
          key={`loading-${animationKey}`}
        >
          <Loading />
        </div>
      )}
    </div>
  );

  const renderCardContent = () => {
    if (!isActive || !shouldShowContent) {
      return (
        <>
          <div
            className='w-[334px] h-[334px] bg-gray-900/50 rounded-sm flex items-center justify-center'
            key={`card-cover-${index}`}
          ></div>
          <div
            className='h-16 rounded bg-gray-900/50 w-full mt-4'
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
          className='h-16 rounded bg-gray-900/50 w-full mt-4'
          key={`placeholder-${index}-${animationKey}`}
        ></div>
      </>
    );
  };

  return (
    <motion.div
      className='absolute top-0 left-0 w-full'
      style={{
        x,
        rotate,
        opacity,
        scale,
        zIndex: 100 - index,
      }}
      animate={{
        scale: isActive ? 1 : 0.95,
      }}
      initial={{
        scale: 0.95,
      }}
      drag={isActive && !disabled ? "x" : false}
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
      <div className='border border-gray-700 rounded-lg p-8 cursor-grab bg-black active:cursor-grabbing select-none relative'>
        <div className='mx-auto'>{renderCardContent()}</div>
        <div
          className={`flex flex-col items-start w-full py-2 slider-container ${!isActive ? "opacity-50" : ""}`}
        >
          <SliderUI disabled={!isActive || !currentTrack} />
        </div>

        <MediaControls disabled={!isActive || !currentTrack} />
      </div>
    </motion.div>
  );
};

const PlayerUI: FC = () => {
  const { user, spotifyPlayer, setUser, setSpotifyPlayer } = useStore();
  const location = useLocation();
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
    } else {
      const container = document.getElementById("mini-player-portal");
      setPortalContainer(container);
    }
  }, [location]);

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
    <div className='mx-auto select-none relative flex justify-center'>
      <div className='relative w-[400px]'>
        {cards
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
          ))}
      </div>
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
        {spotifyPlayer.currentTrack ? (
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
          <div className='flex items-center justify-center h-full'>
            <Loading />
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

  if (user.recommendedSongs.length === 0 && isHomePage) {
    return portalContainer
      ? createPortal(
          <div className='mx-auto select-none relative flex justify-center'>
            <div className='relative w-[400px]'>
              <Card
                index={0}
                isActive={true}
                currentTrack={null}
                onSwipe={() => {}}
                animationKey={0}
                disabled={true}
                spotifyPlayer={spotifyPlayer}
              />
            </div>
          </div>,
          portalContainer
        )
      : null;
  }

  return portalContainer
    ? createPortal(
        isHomePage ? playerContent : miniPlayerContent,
        portalContainer
      )
    : null;
};

export default PlayerUI;
