import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './screens/WelcomeScreen';
import AuthScreen from './screens/AuthScreen';
import Dashboard from './screens/Dashboard';
import PostItem from './screens/PostItem';
import Feed from './screens/Feed';
import MapView from './screens/MapView';
import Profile from './screens/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post" element={<PostItem />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
