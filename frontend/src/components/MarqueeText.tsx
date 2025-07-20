import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react";

interface MarqueeTextProps {
  text: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const MarqueeText: FC<MarqueeTextProps> = ({
  text,
  className = "",
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    if (containerRef.current && textRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.offsetWidth;
      setShouldAnimate(textWidth > containerWidth);

      if (textWidth > containerWidth) {
        // We only need to translate by the difference between text and container width
        const translateX = textWidth - containerWidth;

        const BASE_SPEED = 25;
        const duration = Math.max(translateX / BASE_SPEED, 4);

        setStyle({
          "--marquee-distance": `${translateX}px`,
          "--marquee-duration": `${duration}s`,
        } as React.CSSProperties);
      }
    }
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`relative block overflow-hidden w-full flex items-center ${className}`}
      onClick={onClick}
    >
      <div
        ref={textRef}
        style={style}
        className={`${
          shouldAnimate ? "animate-marquee" : "truncate"
        } inline-block whitespace-nowrap`}
      >
        {text}
      </div>
    </div>
  );
};

export default MarqueeText;
