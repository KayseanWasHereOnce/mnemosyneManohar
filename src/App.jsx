import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SkyBackground from './components/SkyBackground';

// Import the Pages we created
import LandingPage from './pages/LandingPage';
import GuidePage from './pages/GuidePage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ModeSelection from './pages/ModeSelection';

import './App.css';

function App() {
  return (
    <div className="app-wrapper">
      {/* The Stars stay in the background for every page */}
      <SkyBackground />
      
      {/* The Router decides which page to show */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/auth" element={<AuthPage />} />
        {/* ADD THIS NEW ROUTE */}
        <Route path="/select-mode" element={<ModeSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;