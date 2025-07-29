import { useState, useEffect } from "react";

export function useDocumentSize() {
  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  });

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      setSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });
    });

    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  return size;
}
