import React, { FC, ReactNode } from "react";
import PlayerCore from "./PlayerCore";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <PlayerCore />
      {children}
      <div id='player-portal' />
      <div id='mini-player-portal' />
    </>
  );
};

export default Layout;
