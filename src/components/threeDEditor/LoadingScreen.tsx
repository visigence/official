import React, { memo } from 'react';
import { Html } from '@react-three/drei';

// Loading Component
const LoadingScreen = memo(() => (
  <Html center>
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-3 border-primary-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-white font-orbitron tracking-wide text-sm">Loading 3D Editor...</p>
    </div>
  </Html>
));

export default LoadingScreen;