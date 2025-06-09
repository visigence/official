import React, { useRef, useState, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import { SceneObject, TransformMode } from './types';

interface EditableObjectProps {
  object: SceneObject;
  isSelected: boolean;
  transformMode: TransformMode;
  onSelect: (id: string) => void;
  onTransform: (id: string, property: 'position' | 'rotation' | 'scale', value: [number, number, number]) => void;
}

// Enhanced Individual 3D Object Component with better highlighting
const EditableObject = memo<EditableObjectProps>(({ object, isSelected, transformMode, onSelect, onTransform }) => {
  const meshRef = useRef<any>();
  const [hovered, setHovered] = useState(false);

  // Enhanced visual feedback for selection - optimized for mobile
  useFrame(() => {
    if (meshRef.current && isSelected) {
      // Reduced pulsing effect for better performance
      const time = Date.now() * 0.001;
      meshRef.current.material.emissiveIntensity = 0.05 + Math.sin(time) * 0.02;
    }
  });

  // Render appropriate geometry based on type
  const renderGeometry = () => {
    switch (object.type) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.5, 16, 16]} />; // Reduced segments for mobile
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 1, 16]} />; // Reduced segments
      case 'cone':
        return <coneGeometry args={[0.5, 1, 16]} />; // Reduced segments
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  if (!object.visible) return null;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(object.id);
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        castShadow
        receiveShadow
      >
        {renderGeometry()}
        <meshStandardMaterial 
          color={object.color}
          transparent
          opacity={object.opacity}
          wireframe={object.wireframe}
          metalness={object.metalness}
          roughness={object.roughness}
          emissive={isSelected ? '#4dafff' : object.emissive}
          emissiveIntensity={isSelected ? 0.05 : object.emissiveIntensity}
        />
      </mesh>
      
      {/* Simplified selection outline for mobile performance */}
      {(isSelected || hovered) && (
        <mesh
          position={object.position}
          rotation={object.rotation}
          scale={object.scale.map(s => s * 1.01) as [number, number, number]}
        >
          {renderGeometry()}
          <meshBasicMaterial 
            color={isSelected ? '#4dafff' : '#ffffff'} 
            transparent 
            opacity={isSelected ? 0.2 : 0.05}
            wireframe={true}
          />
        </mesh>
      )}
      
      {/* Transform Controls for selected object */}
      {isSelected && (
        <TransformControls
          object={meshRef.current}
          mode={transformMode}
          size={0.6} // Smaller for mobile
          showX={true}
          showY={true}
          showZ={true}
          onObjectChange={(e) => {
            if (meshRef.current) {
              if (transformMode === 'translate') {
                onTransform(object.id, 'position', [
                  meshRef.current.position.x,
                  meshRef.current.position.y,
                  meshRef.current.position.z
                ]);
              } else if (transformMode === 'rotate') {
                onTransform(object.id, 'rotation', [
                  meshRef.current.rotation.x,
                  meshRef.current.rotation.y,
                  meshRef.current.rotation.z
                ]);
              } else if (transformMode === 'scale') {
                onTransform(object.id, 'scale', [
                  meshRef.current.scale.x,
                  meshRef.current.scale.y,
                  meshRef.current.scale.z
                ]);
              }
            }
          }}
        />
      )}
    </group>
  );
});

export default EditableObject;