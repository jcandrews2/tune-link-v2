import React, { FC, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ProfilePage from "./pages/ProfilePage";
import WelcomePage from "./pages/WelcomePage";
import Navbar from "./components/Navbar";
import useStore from "./store";
import { getCurrentUser } from "./api/userApi";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import Layout from "./components/Layout";

const App: FC = () => {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen text-white flex items-center justify-center'>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <div className='flex flex-col min-h-screen bg-black justify-between'>
          <Navbar />
          <div className='text-white flex flex-col'>
            <Routes>
              <Route path='/welcome' element={<WelcomePage />} />
              <Route
                path='/'
                element={<ProtectedRoute element={<HomePage />} />}
              />
              <Route
                path='/recommendations'
                element={<ProtectedRoute element={<RecommendationsPage />} />}
              />
              <Route
                path='/profile'
                element={<ProtectedRoute element={<ProfilePage />} />}
              />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Layout>
    </Router>
  );
};

export default App;
