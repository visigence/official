// Enhanced 3D Object Types with more properties
export interface SceneObject {
  id: string;
  type: 'box' | 'sphere' | 'cylinder' | 'cone';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  visible: boolean;
  name: string;
  wireframe: boolean;
  opacity: number;
  metalness: number;
  roughness: number;
  emissive: string;
  emissiveIntensity: number;
}

// History state for undo/redo
export interface HistoryState {
  objects: SceneObject[];
  selectedObjectId: string | null;
  timestamp: number;
}

// Transform modes
export type TransformMode = 'translate' | 'rotate' | 'scale';

// Camera presets
export interface CameraPreset {
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}