import React from 'react';
import HomeScreen from './src/containers/HomeScreen';
import SplashScreen from './src/containers/SplashScreen';

export default function App() {
  return (
    <SplashScreen>
      <HomeScreen/>
    </SplashScreen>
  );
}
