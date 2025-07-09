import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react";

interface MarqueeTextProps {
  text: string;
  className?: string;
}

const MarqueeText: FC<MarqueeTextProps> = ({ text, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useLayoutEffect(() => {
    if (containerRef.current && textRef.current) {
      console.log("THIS");
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.offsetWidth;
      console.log(textWidth, containerWidth);
      setShouldAnimate(textWidth >= containerWidth);
    }
  }, [text]);

  useEffect(() => {
    console.log("THIS", shouldAnimate);
  }, [shouldAnimate]);

  return (
    <div
      ref={containerRef}
      className={`relative block overflow-hidden w-full ${className}`}
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
