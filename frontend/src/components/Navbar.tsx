import React, { FC, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { Squash as Hamburger } from "hamburger-react";
import useStore from "../store";

const Navbar: FC = () => {
  const location = useLocation();
  const { user } = useStore();
  const isWelcomePage = location.pathname === "/welcome";
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className='relative'>
      <div className='container flex items-center mx-auto px-4 py-2 h-12 xl:h-16'>
        {/* Logo */}
        <div className='w-1/4'>
          <Link
            to='/'
            className='font-kirang h-full text-white font-semibold text-[min(8vw,2.25rem)] flex items-center'
          >
            Vibesbased
          </Link>
        </div>

        {!isWelcomePage && (
          <>
            {/* Hamburger Menu Button (Mobile) */}
            <div className='md:hidden ml-auto flex items-center gap-4'>
              <Link
                to='/profile'
                className={`
                    ${isActive("/profile") ? "text-white ring-1 ring-white" : "text-gray-700"} 
                    hover:bg-gray-900 w-10 h-10 p-2 rounded-lg transition-colors duration-200
                  `}
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt='Profile'
                    className='w-full h-full rounded-full object-cover'
                  />
                ) : (
                  <FiUser className='w-full h-full' />
                )}
              </Link>
              <Hamburger
                toggled={isOpen}
                toggle={setIsOpen}
                color='#FFFFFF'
                size={20}
              />
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center justify-center w-2/4'>
              <div className='flex items-center space-x-8'>
                <Link
                  to='/'
                  className={`px-3 py-2 rounded-lg transition-colors duration-200
                      ${isActive("/") ? "text-white" : "text-gray-700 hover:text-white"}
                      hover:bg-gray-900`}
                >
                  Home
                </Link>
                <Link
                  to='/charts'
                  className={`px-3 py-2 rounded-lg transition-colors duration-200
                      ${isActive("/charts") ? "text-white" : "text-gray-700 hover:text-white"}
                      hover:bg-gray-900`}
                >
                  Charts
                </Link>
              </div>
            </div>

            {/* Desktop Profile Picture */}
            <div className='hidden md:flex items-center justify-end w-1/4'>
              <Link
                to='/profile'
                className={`
                    ${isActive("/profile") ? "text-white ring-1 ring-white" : "text-gray-700"} 
                    hover:bg-gray-900 w-12 h-12 p-2 rounded-lg transition-colors duration-200
                  `}
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt='Profile'
                    className='w-full h-full rounded-full object-cover'
                  />
                ) : (
                  <FiUser className='w-full h-full' />
                )}
              </Link>
            </div>

            {/* Mobile Navigation Menu */}
            {isOpen && (
              <div className='md:hidden fixed top-16 left-0 right-0 bottom-0 bg-black z-50 flex items-center'>
                <div className='flex flex-col w-full p-8 space-y-8'>
                  <Link
                    to='/'
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-4 rounded-lg transition-colors duration-200 text-center text-3xl font-medium
                        ${isActive("/") ? "text-white bg-gray-900" : "text-gray-300 hover:text-white"}
                        hover:bg-gray-900`}
                  >
                    Home
                  </Link>
                  <Link
                    to='/charts'
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-4 rounded-lg transition-colors duration-200 text-center text-3xl font-medium
                        ${isActive("/charts") ? "text-white bg-gray-900" : "text-gray-300 hover:text-white"}
                        hover:bg-gray-900`}
                  >
                    Charts
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
