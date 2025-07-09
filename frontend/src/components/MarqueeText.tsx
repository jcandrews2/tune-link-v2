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

  useLayoutEffect(() => {
    if (containerRef.current && textRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.offsetWidth;
      setShouldAnimate(textWidth >= containerWidth);
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
        className={`${shouldAnimate ? "animate-marquee" : "truncate"} inline-block whitespace-nowrap`}
      >
        {text}
      </div>
    </div>
  );
};

export default MarqueeText;
