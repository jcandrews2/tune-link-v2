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
import MarqueeText from "./MarqueeText";
import Loading from "./Loading";

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

  // Player card animation
  const [topCardSpring, topCardApi] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    opacity: 1,
    scale: 1,
    config: { mass: 1, tension: 120, friction: 120 },
  }));

  const [bottomCardSpring, bottomCardApi] = useSpring(() => ({
    opacity: 0.75,
    scale: 0.75,
    config: { mass: 1, tension: 120, friction: 120 },
  }));

  const bind = useDrag(
    async ({ active, movement: [mx], event, offset: [ox, oy] }) => {
      const isSliderInteraction = (event.target as HTMLElement).closest(
        ".slider-container"
      );
      if (isSliderInteraction) return;

      if (isHomePage) {
        const absX = Math.abs(mx);
        const dir = mx > 0 ? 1 : -1;
        const SWIPE_THRESHOLD = 150;

        if (active) {
          topCardApi.start({
            x: mx,
            rotate: mx / 20,
            scale: 1,
            opacity: 1,
            immediate: true,
          });

          bottomCardApi.start({
            opacity: Math.min(1, 0.75 + (absX / (SWIPE_THRESHOLD * 2)) * 0.25),
            scale: Math.min(1, 0.75 + (absX / (SWIPE_THRESHOLD * 2)) * 0.25),
            immediate: true,
          });
        } else if (absX > SWIPE_THRESHOLD) {
          topCardApi.start({
            x: mx,
            rotate: mx * 15,
            opacity: 1,
            scale: 1,
            immediate: false,
          });

          // Perform action
          if (dir > 0) {
            await handleLike(spotifyPlayer, user, setUser);
          } else {
            await handleDislike(spotifyPlayer, user, setUser);
          }

          topCardApi.set({
            x: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
          });

          setSpotifyPlayer({
            currentTrack: spotifyPlayer.nextTrack,
          });
        }
      } else {
        setMiniPlayerPosition({
          x: ox,
          y: oy,
        });
      }
    },
    {
      from: () => [miniPlayerPosition.x, miniPlayerPosition.y],
      filterTaps: true,
      preventScroll: true,
      preventDefault: true,
    }
  );

  useEffect(() => {
    if (isHomePage) {
      const container = document.getElementById("player-portal");
      setPortalContainer(container);
    } else {
      const container = document.getElementById("mini-player-portal");
      setPortalContainer(container);
    }
  }, [location]);

  const miniPlayerContent = (
    <>
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
        className='w-[300px] h-[192.5px]'
      >
        <div className='w-full h-full p-4 border border-gray-700 rounded-lg bg-black'>
          {spotifyPlayer.currentTrack ? (
            <>
              <div className=''>
                <MarqueeText
                  text={spotifyPlayer.currentTrack.name}
                  className='text-md font-bold text-white'
                />
                <MarqueeText
                  text={spotifyPlayer.currentTrack.artists[0].name}
                  className='font-light text-gray-300'
                />
              </div>
              <div className='w-full slider-container'>
                <SliderUI />
              </div>
              <div className='w-full'>
                <MediaControls />
              </div>
            </>
          ) : (
            <div className='flex items-center justify-center h-full'>
              <Loading />
            </div>
          )}
        </div>
        <div
          className='absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-[25px] blur-[50px] fade-in z-0'
          key={spotifyPlayer.animationKey}
          style={{
            width: "250px",
            height: "60%",
            zIndex: -1,
            backgroundColor: spotifyPlayer.dominantColor || "transparent",
          }}
        />
      </animated.div>
    </>
  );

  const playerContent = (
    <div className='mx-auto select-none relative'>
      {/* Bottom Card */}
      {spotifyPlayer.nextTrack && (
        <animated.div
          {...bind()}
          style={{
            scale: bottomCardSpring.scale,
            opacity: bottomCardSpring.opacity,
            position: "absolute",
            zIndex: 0,
          }}
          className='border border-gray-700 rounded-lg p-8 bg-black w-[400px]'
        >
          <div className='relative select-none [&_*]:select-none [&_img]:pointer-events-none [&_img]:select-none'>
            <div className=' mx-auto'>
              <Cover isTopCard={false} />
              <div className='relative py-2 z-10 text-left'>
                <MarqueeText
                  text={spotifyPlayer.nextTrack.name}
                  className='text-xl font-bold text-white'
                />
                <MarqueeText
                  text={spotifyPlayer.nextTrack.artists[0].name}
                  className='font-light text-gray-300'
                />
              </div>
            </div>
            <div className='flex flex-col items-start w-full py-2 slider-container'>
              <SliderUI />
            </div>
            <MediaControls />
          </div>
        </animated.div>
      )}

      {/* Top Card */}
      <animated.div
        {...bind()}
        style={{
          x: topCardSpring.x,
          y: topCardSpring.y,
          rotate: topCardSpring.rotate,
          opacity: topCardSpring.opacity,
          scale: topCardSpring.scale,
          touchAction: "none",
          position: "relative",
          zIndex: 1,
        }}
        className='border border-gray-700 rounded-lg p-8 cursor-grab bg-black active:cursor-grabbing select-none w-[400px]'
      >
        {/* Swipe indicator overlay */}
        <animated.div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "0.5rem",
            backgroundColor: topCardSpring.x.to((x) =>
              Math.abs(x) < 1
                ? "transparent"
                : x > 0
                  ? `rgba(74, 222, 128, ${Math.min(Math.abs(x) / 100, 0.4)})`
                  : `rgba(248, 113, 113, ${Math.min(Math.abs(x) / 100, 0.4)})`
            ),
          }}
        />

        <div className='relative select-none [&_*]:select-none [&_img]:pointer-events-none [&_img]:select-none'>
          <div className=' mx-auto'>
            <Cover isTopCard={true} />
            {spotifyPlayer.currentTrack && (
              <div className='relative py-2 z-10 text-left'>
                <MarqueeText
                  text={spotifyPlayer.currentTrack.name}
                  className='text-xl font-bold text-white'
                />
                <MarqueeText
                  text={spotifyPlayer.currentTrack.artists[0].name}
                  className='font-light text-gray-300'
                />
              </div>
            )}
          </div>
          <div className='flex flex-col items-start w-full py-2 slider-container'>
            <SliderUI />
          </div>
          <MediaControls />
        </div>
      </animated.div>
    </div>
  );

  if (user.recommendedSongs.length === 0 && isHomePage) {
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
