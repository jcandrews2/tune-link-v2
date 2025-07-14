import React, { FC, ReactNode } from "react";
import PlayerCore from "./PlayerCore";
import { useLocation } from "react-router-dom";

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {location.pathname !== "/welcome" && <PlayerCore />}
      {children}
    </>
  );
};

export default Layout;
