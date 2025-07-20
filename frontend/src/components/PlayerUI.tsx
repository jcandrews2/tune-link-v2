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

  const swipeLock = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [miniPlayerPosition, setMiniPlayerPosition] = useState({
    x: 0,
    y: 0,
  });

  // Get the first two cards
  const cards = user.recommendedSongs.slice(
    0,
    Math.min(2, user.recommendedSongs.length)
  );

  const [props, api] = useSprings(cards.length, (i) => ({
    from: from(i),
    to: to(i),
  }));

  useEffect(() => {
    api.start((i) => ({
      from: from(i),
      to: to(i),
    }));
  }, [currentIndex, api]);

  const distanceThreshold = 300;
  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], cancel }) => {
      const trigger = Math.abs(mx) > distanceThreshold;
      const dir = xDir < 0 ? -1 : 1;

      if (trigger) {
        if (swipeLock.current) {
          cancel();
          return;
        }
        swipeLock.current = true;

        setSpotifyPlayer({
          currentTrack: spotifyPlayer.nextTrack,
        });

        if (dir > 0) {
          handleLike(spotifyPlayer, user, setUser);
        } else {
          handleDislike(spotifyPlayer, user, setUser);
        }

        cancel();

        setTimeout(() => {
          swipeLock.current = false;
        }, 300);

        setCurrentIndex((prev) => prev + 1);
        return;
      }

      api.start((i) => {
        if (i !== 0) return;

        const x = down ? mx : 0;
        const rot = mx / 100;

        return {
          x,
          rot,
          config: {
            friction: 50,
            tension: down ? 800 : 200,
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

  useEffect(() => {
    console.log("currentIndex", currentIndex);
  }, [currentIndex]);

  const renderCard = (i: number) => (
    <div className='relative select-none [&_*]:select-none [&_img]:pointer-events-none [&_img]:select-none'>
      <div className='mx-auto'>
        <Cover isTopCard={i === 0} />
        {spotifyPlayer.currentTrack && (
          <div className='relative py-2 z-10 text-left'>
            <MarqueeText
              text={
                i === 0
                  ? spotifyPlayer.currentTrack.name
                  : spotifyPlayer.nextTrack?.name
              }
              className='text-xl font-bold text-white h-10'
            />
            <MarqueeText
              text={
                i === 0
                  ? spotifyPlayer.currentTrack.artists[0].name
                  : spotifyPlayer.nextTrack?.artists[0].name
              }
              className='font-light text-gray-400 h-6'
            />
          </div>
        )}
      </div>
      <div
        className={`flex flex-col items-start w-full py-2 slider-container ${i === 1 ? "opacity-50" : ""}`}
      >
        <SliderUI disabled={i === 1} />
      </div>
      <div className={i === 1 ? "opacity-50" : ""}>
        <MediaControls disabled={i === 1 || !spotifyPlayer.currentTrack} />
      </div>
    </div>
  );

  const playerContent = (
    <div className='mx-auto select-none relative flex justify-center'>
      <div className='relative w-[400px]'>
        {cards.map((_, i) => {
          const { x, y, rot, scale } = props[i];
          return (
            <animated.div
              key={spotifyPlayer.currentTrack?.spotifyId}
              className='absolute top-0 left-0 w-full'
              style={{
                x,
                y,
                zIndex: cards.length - i,
              }}
            >
              <animated.div
                {...bind(i)}
                style={{
                  transform: interpolate([rot, scale], trans),
                  touchAction: "none",
                }}
                className='border border-gray-700 rounded-lg p-8 cursor-grab bg-black active:cursor-grabbing select-none relative'
              >
                {/* Glow overlay */}
                <animated.div
                  className='absolute inset-0 pointer-events-none rounded-lg'
                  key={spotifyPlayer.animationKey}
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
                {/* Card content */}
                <div className='relative z-10'>{renderCard(i)}</div>
              </animated.div>
            </animated.div>
          );
        })}
      </div>
    </div>
  );

  const miniPlayerContent = (
    <animated.div
      style={{
        position: "fixed",
        left: 76,
        bottom: 100,
        x: miniPlayerPosition.x,
        y: miniPlayerPosition.y,
        touchAction: "none",
        zIndex: 50,
      }}
      className='w-[300px] h-[200px] select-none [&_*]:select-none'
    >
      <div className='w-full h-full p-4 border border-gray-700 rounded-lg bg-black'>
        {spotifyPlayer.currentTrack ? (
          <div className='h-full flex flex-col justify-center space-y-2'>
            <div>
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
                  <div className='absolute inset-0  rounded-sm flex items-center justify-center p-8'></div>
                </div>
                <div className='relative py-2 z-10 text-left'>
                  <div className='text-xl font-bold text-white h-10 rounded w-full'></div>
                  <div className='font-light text-gray-300 h-6 rounded w-full mt-1'></div>
                </div>
                <div className='flex flex-col items-start w-full py-2 slider-container opacity-50'>
                  <SliderUI disabled={true} />
                </div>
                <div className='opacity-50'>
                  <MediaControls disabled={true} />
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
