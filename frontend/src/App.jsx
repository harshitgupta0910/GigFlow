import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GigDetails from './pages/GigDetails';
import CreateGig from './pages/CreateGig';
import MyGigs from './pages/MyGigs';
import MyBids from './pages/MyBids';
import { checkAuth } from './store/slices/authSlice';
import { initSocket } from './services/socket';

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      initSocket(user._id);
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/gigs/:id" 
          element={<GigDetails />} 
        />
        <Route 
          path="/create-gig" 
          element={isAuthenticated ? <CreateGig /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/my-gigs" 
          element={isAuthenticated ? <MyGigs /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/my-bids" 
          element={isAuthenticated ? <MyBids /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
}

export default App;
