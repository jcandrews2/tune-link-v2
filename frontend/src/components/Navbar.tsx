import React, { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import useStore from "../store";

const Navbar: FC = () => {
  const location = useLocation();
  const { user } = useStore();
  const isWelcomePage = location.pathname === "/welcome";

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className=''>
      <div className='container mx-auto px-4'>
        <div className='flex items-center h-16'>
          <div className='w-1/4'>
            <Link
              to='/'
              className='font-kirang text-4xl text-white font-semibold'
            >
              Vibesbased
            </Link>
          </div>

          {!isWelcomePage && (
            <>
              {/* Navigation Links */}
              <div className='flex items-center justify-center w-2/4'>
                <div className='flex items-center space-x-8'>
                  <Link
                    to='/'
                    className={`px-3 py-2 rounded-lg transition-colors duration-200
                      ${
                        isActive("/")
                          ? "text-white"
                          : "text-gray-700 hover:text-white"
                      } hover:bg-gray-900 `}
                  >
                    Home
                  </Link>
                  <Link
                    to='/charts'
                    className={`
                      ${
                        isActive("/charts")
                          ? "text-white"
                          : "text-gray-700 hover:text-white"
                      } hover:bg-gray-900 px-3 py-2 rounded-lg transition-colors duration-200`}
                  >
                    Charts
                  </Link>
                </div>
              </div>

              {/* Profile Picture */}
              <div className='flex items-center justify-end w-1/4'>
                <Link
                  to='/profile'
                  className={`
                    ${
                      isActive("/profile")
                        ? "text-white ring-1 ring-white"
                        : "text-gray-700"
                    } 
                      hover:bg-gray-900 w-12 h-12 p-2 rounded-lg transition-colors duration-200`}
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
