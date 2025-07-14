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
        // Calculate the translation percentage based on the difference
        const translateX =
          ((textWidth - containerWidth) / containerWidth) * 100;
        setStyle({
          "--marquee-distance": `${translateX}%`,
        } as React.CSSProperties);
      }
    }
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`relative block overflow-hidden w-full ${className}`}
      onClick={onClick}
    >
      <div
        ref={textRef}
        style={style}
        className={`${
          shouldAnimate ? "animate-marquee" : ""
        } inline-block whitespace-nowrap truncate`}
      >
        {text}
      </div>
    </div>
  );
};

export default MarqueeText;
