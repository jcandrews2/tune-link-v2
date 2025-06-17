// Layout.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import Player from "./Player";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    // Only try to find the portal container when on the homepage
    if (isHomePage) {
      const container = document.getElementById("player-portal");
      setPortalContainer(container);
    } else {
      setPortalContainer(null);
    }
  }, [isHomePage]);

  return (
    <>
      {children}
      {isHomePage &&
        portalContainer &&
        createPortal(<Player />, portalContainer)}
      {!isHomePage && <Player />} {/* Render Player normally on other pages */}
    </>
  );
};

export default Layout;
