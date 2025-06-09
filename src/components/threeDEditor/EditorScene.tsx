import React, { useRef, memo } from 'react';
import { 
  Environment, 
  Grid,
  GizmoHelper,
  GizmoViewport,
  useHelper
} from '@react-three/drei';
import { DirectionalLightHelper, PointLightHelper } from 'three';
import { SceneObject, TransformMode } from './types';
import EditableObject from './EditableObject';

interface EditorSceneProps {
  objects: SceneObject[];
  selectedObjectId: string | null;
  transformMode: TransformMode;
  showGrid: boolean;
  showLightHelpers: boolean;
  onSelectObject: (id: string) => void;
  onTransformObject: (id: string, property: 'position' | 'rotation' | 'scale', value: [number, number, number]) => void;
}

// Enhanced Scene Component with optimized lighting for mobile
const EditorScene = memo<EditorSceneProps>(({ 
  objects, 
  selectedObjectId, 
  transformMode, 
  showGrid, 
  showLightHelpers, 
  onSelectObject, 
  onTransformObject 
}) => {
  const directionalLightRef = useRef<any>();
  const pointLightRef = useRef<any>();

  // Light helpers for debugging - only when enabled
  useHelper(showLightHelpers && directionalLightRef.current ? directionalLightRef : null, DirectionalLightHelper, 1);
  useHelper(showLightHelpers && pointLightRef.current ? pointLightRef : null, PointLightHelper, 1);

  return (
    <>
      {/* Optimized Environment and Lighting for mobile */}
      <Environment preset="studio" />
      <ambientLight intensity={0.5} />
      <directionalLight 
        ref={directionalLightRef}
        position={[10, 10, 5]} 
        intensity={0.6} 
        castShadow 
        shadow-mapSize-width={512} // Reduced from 2048 for mobile performance
        shadow-mapSize-height={512} // Reduced from 2048 for mobile performance
        shadow-camera-far={30} // Reduced shadow distance
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <pointLight 
        ref={pointLightRef}
        position={[-5, 5, -5]} 
        intensity={0.3} 
        color="#4dafff"
        castShadow={false} // Disable shadows on point light for performance
      />
      
      {/* Simplified Grid for mobile */}
      {showGrid && (
        <Grid 
          args={[10, 10]} // Reduced grid size
          cellSize={1} 
          cellThickness={0.3} // Thinner lines
          cellColor="#4a5568" 
          sectionSize={5} 
          sectionThickness={0.6} // Thinner section lines
          sectionColor="#718096"
          fadeDistance={15} // Reduced fade distance
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false} // Disable infinite grid for performance
        />
      )}
      
      {/* Simplified ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} /> {/* Reduced size */}
        <meshStandardMaterial color="#2d3748" transparent opacity={0.05} />
      </mesh>
      
      {/* Scene Objects */}
      {objects.map((object) => (
        <EditableObject
          key={object.id}
          object={object}
          isSelected={selectedObjectId === object.id}
          transformMode={transformMode}
          onSelect={onSelectObject}
          onTransform={onTransformObject}
        />
      ))}
      
      {/* Simplified Gizmo Helper */}
      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport 
          axisColors={['#ff4757', '#2ed573', '#3742fa']} 
          labelColor="white"
        />
      </GizmoHelper>
    </>
  );
});

export default EditorScene;