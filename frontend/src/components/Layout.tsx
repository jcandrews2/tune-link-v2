import React from "react";
import { useLocation } from "react-router-dom";
import Player from "./Player";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Player /> {/* Only render this ONCE, always */}
    </>
  );
};

export default Layout;
