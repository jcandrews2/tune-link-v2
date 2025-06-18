import React, { useEffect, useState, FC } from "react";
import { createPortal } from "react-dom";
import Cover from "./Cover";
import SliderUI from "./SliderUI";
import MediaControls from "./MediaControls";
import useStore from "../store";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { handleLike, handleDislike } from "../utils/userUtils";
import { useLocation } from "react-router-dom";
import { setTrackPosition } from "../api/spotifyApi";

const PlayerUI: FC = () => {
  const { user, spotifyPlayer, setUser, setSpotifyPlayer } = useStore();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );
  const [miniPlayerPosition, setMiniPlayerPosition] = useState({
    x: 20,
    y: 20,
  });

  const handlePositionChange = (value: number) => {
    setSpotifyPlayer({ progress: value });

    if (!spotifyPlayer.isPaused && spotifyPlayer.currentTrack) {
      const position = Math.round(
        (value / 100) * spotifyPlayer.currentTrack.duration_ms
      );
      setTrackPosition(position);
    }
  };

  // Player card animation
  const [{ x, y, rotate, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    config: { tension: 300, friction: 20 },
  }));

  const bind = useDrag(
    async ({
      active,
      movement: [mx, my],
      direction: [xDir],
      cancel,
      tap,
      first,
      memo,
      offset: [ox, oy],
      event,
    }) => {
      // Check if the event target is or is within the slider container
      const isSliderInteraction = (event.target as HTMLElement).closest(
        ".slider-container"
      );
      if (isSliderInteraction) {
        cancel();
        return;
      }

      if (tap) return;

      if (isHomePage) {
        // Home page swipe logic
        const trigger = Math.abs(mx) > 150;
        if (active && trigger) {
          cancel();
          if (mx > 0) {
            await handleLike(spotifyPlayer, user, setUser);
          } else {
            await handleDislike(spotifyPlayer, user, setUser);
          }
          return;
        }

        api.start({
          x: active ? mx : 0,
          rotate: active ? mx / 20 : 0,
          scale: active ? 1.05 : 1,
          immediate: active,
          config: { tension: 300, friction: active ? 10 : 20 },
        });
      } else {
        // Mini player dragging logic
        setMiniPlayerPosition({ x: ox, y: oy });
      }
    },
    {
      from: () =>
        isHomePage ? [0, 0] : [miniPlayerPosition.x, miniPlayerPosition.y],
      bounds: isHomePage
        ? { left: -200, right: 200, top: 0, bottom: 0 }
        : undefined,
      rubberband: true,
    }
  );

  useEffect(() => {
    if (isHomePage) {
      const container = document.getElementById("player-portal");
      setPortalContainer(container);
      api.start({ x: 0, y: 0 });
    } else {
      const container = document.getElementById("mini-player-portal");
      setPortalContainer(container);
    }
  }, [location]);

  // Simplified player content for non-home pages
  const miniPlayerContent = (
    <animated.div
      {...bind()}
      style={{
        position: "fixed",
        left: 76,
        bottom: 100,
        x: miniPlayerPosition.x,
        y: miniPlayerPosition.y,
        touchAction: "none",
        cursor: "grab",
      }}
      className='border border-gray-700 rounded-lg w-[300px] shadow-lg'
    >
      <div className='w-full p-4'>
        {spotifyPlayer.currentTrack && (
          <>
            <div className=''>
              <h2 className='text-md font-bold text-white'>
                {spotifyPlayer.currentTrack.name}
              </h2>
              <h3 className='font-light text-gray-300'>
                {spotifyPlayer.currentTrack.artists[0].name}
              </h3>
            </div>
            <div className='w-full slider-container'>
              <SliderUI onPositionChange={handlePositionChange} />
            </div>
            <div className='w-full'>
              <MediaControls />
            </div>
          </>
        )}
      </div>
    </animated.div>
  );

  const playerContent = (
    <div className='mx-auto select-none'>
      <animated.div
        {...bind()}
        style={{
          x,
          y,
          rotate,
          scale,
          touchAction: "none",
          position: "relative",
          backgroundColor: x.to((x: number) =>
            x > 0
              ? `rgba(74, 222, 128, ${Math.min(Math.abs(x) / 100, 0.4)})`
              : `rgba(248, 113, 113, ${Math.min(Math.abs(x) / 100, 0.4)})`
          ),
        }}
        className='border border-gray-700 rounded-lg p-8 bg-[#121212] cursor-grab active:cursor-grabbing select-none'
      >
        <div className='relative z-10 select-none [&_*]:select-none [&_img]:pointer-events-none [&_img]:select-none'>
          <Cover />
          {spotifyPlayer.currentTrack && (
            <div className='relative py-2 z-10 text-left'>
              <h2 className='text-xl font-bold text-white'>
                {spotifyPlayer.currentTrack.name}
              </h2>
              <h3 className='font-light text-gray-300'>
                {spotifyPlayer.currentTrack.artists[0].name}
              </h3>
            </div>
          )}
          <div className='flex flex-col items-start w-full py-2 slider-container'>
            <SliderUI onPositionChange={handlePositionChange} />
          </div>
          <MediaControls />
        </div>
      </animated.div>
    </div>
  );

  if (user.recommendedSongs.length === 0) {
    return portalContainer
      ? createPortal(
          <div className='mx-auto select-none'>
            <div className='border border-gray-700 rounded-lg p-8 bg-[#121212] text-center text-gray-400'>
              No more songs in queue.
              <br />
              Try getting new recommendations!
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
