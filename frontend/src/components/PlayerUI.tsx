import React, { useEffect, useState, FC, useRef } from "react";
import { createPortal } from "react-dom";
import Cover from "./Cover";
import SliderUI from "./SliderUI";
import MediaControls from "./MediaControls";
import useStore from "../store";
import {
  useSpring,
  useSprings,
  animated,
  to as interpolate,
} from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { handleLike, handleDislike } from "../utils/userUtils";
import { useLocation } from "react-router-dom";
import MarqueeText from "./MarqueeText";
import Loading from "./Loading";

const to = (i: number) => ({
  x: 0,
  y: 0,
  scale: 1,
  rot: 0,
});

const from = (i: number) => ({
  x: 0,
  y: 0,
  scale: 1,
  rot: 0,
});

const trans = (r: number, s: number) => `rotate(${r}deg) scale(${s})`;

const PlayerUI: FC = () => {
  const { user, spotifyPlayer, setUser, setSpotifyPlayer } = useStore();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  // Track which cards have been swiped out
  const gone = useRef(new Set<number>());
  const swipeLock = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [miniPlayerPosition, setMiniPlayerPosition] = useState({
    x: 0,
    y: 0,
  });

  // Get the next 5 cards from the queue
  const visibleCards = user.recommendedSongs.slice(
    currentIndex,
    Math.min(currentIndex + 5, user.recommendedSongs.length)
  );

  // Ensure we always have at least one card to show
  const numCards = Math.max(1, visibleCards.length);

  const [props, api] = useSprings(numCards, (i) => ({
    from: from(i),
    to: to(i),
  }));

  const distanceThreshold = 300;
  const bind = useDrag(
    ({
      args: [index],
      down,
      movement: [mx],
      direction: [xDir],
      velocity: [vx],
      cancel,
      offset: [ox, oy],
    }) => {
      if (!isHomePage) {
        setMiniPlayerPosition({
          x: ox,
          y: oy,
        });
        return;
      }

      const trigger = Math.abs(mx) > distanceThreshold;
      const dir = xDir < 0 ? -1 : 1;

      if (trigger && !gone.current.has(index)) {
        if (swipeLock.current) {
          cancel();
          return;
        }
        swipeLock.current = true;

        gone.current.add(index);

        const isLastCard = currentIndex === user.recommendedSongs.length - 1;
        if (!isLastCard) {
          setCurrentIndex((prev) => prev + 1);
          setSpotifyPlayer({
            currentTrack: spotifyPlayer.nextTrack,
          });
        }

        if (dir > 0) {
          handleLike(spotifyPlayer, user, setUser);
        } else {
          handleDislike(spotifyPlayer, user, setUser);
        }

        if (gone.current.size === visibleCards.length || isLastCard) {
          gone.current.clear();
          if (!isLastCard) {
            setCurrentIndex(0);
          }
        }

        cancel();

        setTimeout(() => {
          swipeLock.current = false;
        }, 300);

        return;
      }

      // Dragging animation for active card
      api.start((i) => {
        if (index !== i) return;

        const isGone = gone.current.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0;
        const rot = mx / 100 + (isGone ? dir * 10 * vx : 0); // Smoother rotation
        const scale = down ? 1.1 : 1; // Scale up while dragging

        return {
          x,
          rot,
          scale,
          config: {
            friction: 50,
            tension: down ? 800 : isGone ? 200 : 500,
          },
        };
      });
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

  const renderCard = (index: number) => (
    <div className='relative select-none [&_*]:select-none [&_img]:pointer-events-none [&_img]:select-none'>
      <div className='mx-auto'>
        <Cover isTopCard={index === currentIndex} />
        {spotifyPlayer.currentTrack && (
          <div className='relative py-2 z-10 text-left'>
            <MarqueeText
              text={
                index === currentIndex
                  ? spotifyPlayer.currentTrack.name
                  : spotifyPlayer.nextTrack?.name ||
                    spotifyPlayer.currentTrack.name
              }
              className='text-xl font-bold text-white h-10'
            />
            <MarqueeText
              text={
                index === currentIndex
                  ? spotifyPlayer.currentTrack.artists[0].name
                  : spotifyPlayer.nextTrack?.artists[0].name ||
                    spotifyPlayer.currentTrack.artists[0].name
              }
              className='font-light text-gray-300 h-6'
            />
          </div>
        )}
      </div>
      <div className='flex flex-col items-start w-full py-2 slider-container'>
        <SliderUI />
      </div>
      <MediaControls />
    </div>
  );

  const playerContent = (
    <div className='mx-auto select-none relative flex justify-center'>
      <div className='relative w-[400px]'>
        {props.map(
          ({ x, y, rot, scale }, i) =>
            !gone.current.has(i) && (
              <animated.div
                key={`${currentIndex + i}`}
                className='absolute top-0 left-0 w-full'
                style={{
                  x,
                  y,
                  zIndex: visibleCards.length - i,
                }}
              >
                <animated.div
                  {...(i === currentIndex ? bind(i) : {})}
                  style={{
                    transform: interpolate([rot, scale], trans),
                    touchAction: "none",
                  }}
                  className='border border-gray-700 rounded-lg p-8 cursor-grab bg-black active:cursor-grabbing select-none relative'
                >
                  {/* Glow overlay - z-0 */}
                  <animated.div
                    className='absolute inset-0 pointer-events-none rounded-lg'
                    style={{
                      background: x.to((xVal) => {
                        const alpha = Math.min(Math.abs(xVal) / 200, 0.25);
                        if (xVal > 0) return `rgba(0,255,100,${alpha})`;
                        if (xVal < 0) return `rgba(255,0,80,${alpha})`;
                        return "rgba(0,0,0,0)";
                      }),
                      zIndex: 0,
                    }}
                  />
                  {/* Card content - z-10 */}
                  <div className='relative z-10'>{renderCard(i)}</div>
                </animated.div>
              </animated.div>
            )
        )}
      </div>
    </div>
  );

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
        zIndex: 50,
      }}
      className='w-[300px] h-[192.5px] select-none [&_*]:select-none active:cursor-grabbing'
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
  );

  if (user.recommendedSongs.length === 0 && isHomePage) {
    return portalContainer
      ? createPortal(
          <div className='mx-auto select-none relative flex justify-center'>
            <div className='relative w-[400px]'>
              <div className='border border-gray-700 rounded-lg p-8 bg-black relative'>
                <div className='w-[334px] h-[334px] relative'>
                  <div className='absolute inset-0 bg-gray-900 rounded-sm flex items-center justify-center text-center p-8 text-white text-lg'>
                    Submit a request to get song recommendations
                  </div>
                </div>
                <div className='relative py-2 z-10 text-left'>
                  <div className='text-xl font-bold text-white h-10 bg-gray-900 rounded w-3/4'></div>
                  <div className='font-light text-gray-300 h-6 bg-gray-900 rounded w-1/2 mt-1'></div>
                </div>
                <div className='flex flex-col items-start w-full py-2 slider-container opacity-50'>
                  <div className='w-full cursor-default relative'>
                    <input
                      type='range'
                      step='0.01'
                      min='0'
                      max='100'
                      value='0'
                      disabled
                      className='w-full appearance-none bg-transparent cursor-not-allowed
                        [&::-webkit-slider-runnable-track]:w-full 
                        [&::-webkit-slider-thumb]:appearance-none 
                        [&::-webkit-slider-thumb]:h-3 
                        [&::-webkit-slider-thumb]:w-3 
                        [&::-webkit-slider-thumb]:rounded-full 
                        [&::-webkit-slider-thumb]:bg-white 
                        [&::-webkit-slider-thumb]:mt-[-4px] 
                        [&::-webkit-slider-runnable-track]:h-1 
                        [&::-webkit-slider-runnable-track]:rounded-full
                        [&::-webkit-slider-runnable-track]:rounded-full
                        [&::-moz-range-track]:w-full
                        [&::-moz-range-track]:rounded-full'
                      style={{
                        background:
                          "linear-gradient(to right, darkslategrey 0%, darkslategrey 100%)",
                      }}
                    />
                    <div className='flex justify-between w-full opacity-55 select-none'>
                      <p className='text-xs font-light text-gray-300'>-:--</p>
                      <p className='text-xs font-light text-gray-300'>-:--</p>
                    </div>
                  </div>
                </div>
                <div className='opacity-50 [&_button]:cursor-not-allowed'>
                  <MediaControls />
                </div>
              </div>
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
