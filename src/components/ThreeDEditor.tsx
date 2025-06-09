import React, { Suspense, useRef, useState, useMemo, memo, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Html,
  TransformControls,
  Grid,
  GizmoHelper,
  GizmoViewport,
  useHelper
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Vector3, Color, DirectionalLightHelper, PointLightHelper } from 'three';
import { 
  Plus, Trash2, Box, Cherry as Sphere, Triangle, Cylinder, Settings, Eye, EyeOff, Copy, 
  RotateCcw, Move, RotateCw, Maximize, Undo, Redo, Save, Upload, Download, 
  Grid3X3, Sun, Lightbulb, Camera, Play, Pause, Layers, ZoomIn, ZoomOut,
  MousePointer, Hand, RotateCcw as Reset, Palette, Sliders
} from 'lucide-react';

// Enhanced 3D Object Types with more properties
interface SceneObject {
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
interface HistoryState {
  objects: SceneObject[];
  selectedObjectId: string | null;
  timestamp: number;
}

// Transform modes
type TransformMode = 'translate' | 'rotate' | 'scale';

// Camera presets
interface CameraPreset {
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}

const cameraPresets: CameraPreset[] = [
  { name: 'Default', position: [5, 5, 5], target: [0, 0, 0] },
  { name: 'Top', position: [0, 10, 0], target: [0, 0, 0] },
  { name: 'Front', position: [0, 0, 10], target: [0, 0, 0] },
  { name: 'Side', position: [10, 0, 0], target: [0, 0, 0] },
  { name: 'Isometric', position: [7, 7, 7], target: [0, 0, 0] },
];

// Enhanced Individual 3D Object Component with better highlighting
const EditableObject = memo<{
  object: SceneObject;
  isSelected: boolean;
  transformMode: TransformMode;
  onSelect: (id: string) => void;
  onTransform: (id: string, property: 'position' | 'rotation' | 'scale', value: [number, number, number]) => void;
}>(({ object, isSelected, transformMode, onSelect, onTransform }) => {
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

// Enhanced Scene Component with optimized lighting for mobile
const EditorScene = memo<{
  objects: SceneObject[];
  selectedObjectId: string | null;
  transformMode: TransformMode;
  showGrid: boolean;
  showLightHelpers: boolean;
  onSelectObject: (id: string) => void;
  onTransformObject: (id: string, property: 'position' | 'rotation' | 'scale', value: [number, number, number]) => void;
}>(({ objects, selectedObjectId, transformMode, showGrid, showLightHelpers, onSelectObject, onTransformObject }) => {
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

// Enhanced Properties Panel with material controls
const PropertiesPanel = memo<{
  selectedObject: SceneObject | null;
  onUpdateObject: (id: string, updates: Partial<SceneObject>) => void;
}>(({ selectedObject, onUpdateObject }) => {
  if (!selectedObject) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="absolute top-20 right-6 w-80 max-h-[80vh] overflow-y-auto glass-strong rounded-xl p-6 space-y-6 custom-scrollbar"
    >
      <h3 className="text-lg font-orbitron font-bold text-white tracking-tight flex items-center">
        <Sliders className="w-5 h-5 mr-2 text-primary-400" />
        Object Properties
      </h3>
      
      {/* Object Name */}
      <div>
        <label className="block text-sm text-slate-300 mb-2">Name</label>
        <input
          type="text"
          value={selectedObject.name}
          onChange={(e) => onUpdateObject(selectedObject.id, { name: e.target.value })}
          className="w-full px-3 py-2 glass rounded-lg border border-white/10 focus:border-primary-400 bg-transparent text-white text-sm"
        />
      </div>
      
      {/* Object Type */}
      <div>
        <label className="block text-sm text-slate-300 mb-2">Type</label>
        <select
          value={selectedObject.type}
          onChange={(e) => onUpdateObject(selectedObject.id, { type: e.target.value as SceneObject['type'] })}
          className="w-full px-3 py-2 glass rounded-lg border border-white/10 focus:border-primary-400 bg-transparent text-white text-sm"
        >
          <option value="box">Box</option>
          <option value="sphere">Sphere</option>
          <option value="cylinder">Cylinder</option>
          <option value="cone">Cone</option>
        </select>
      </div>
      
      {/* Transform Properties */}
      <div className="space-y-4">
        <h4 className="text-sm font-orbitron font-bold text-primary-400">Transform</h4>
        
        {/* Position */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">Position</label>
          <div className="grid grid-cols-3 gap-2">
            {['x', 'y', 'z'].map((axis, index) => (
              <input
                key={axis}
                type="number"
                step="0.1"
                value={selectedObject.position[index].toFixed(2)}
                onChange={(e) => {
                  const newPosition = [...selectedObject.position] as [number, number, number];
                  newPosition[index] = parseFloat(e.target.value) || 0;
                  onUpdateObject(selectedObject.id, { position: newPosition });
                }}
                className="px-2 py-1 glass rounded text-white text-xs text-center"
                placeholder={axis.toUpperCase()}
              />
            ))}
          </div>
        </div>
        
        {/* Rotation */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">Rotation (degrees)</label>
          <div className="grid grid-cols-3 gap-2">
            {['x', 'y', 'z'].map((axis, index) => (
              <input
                key={axis}
                type="number"
                step="1"
                value={(selectedObject.rotation[index] * 180 / Math.PI).toFixed(1)}
                onChange={(e) => {
                  const newRotation = [...selectedObject.rotation] as [number, number, number];
                  newRotation[index] = (parseFloat(e.target.value) || 0) * Math.PI / 180;
                  onUpdateObject(selectedObject.id, { rotation: newRotation });
                }}
                className="px-2 py-1 glass rounded text-white text-xs text-center"
                placeholder={axis.toUpperCase()}
              />
            ))}
          </div>
        </div>
        
        {/* Scale */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">Scale</label>
          <div className="grid grid-cols-3 gap-2">
            {['x', 'y', 'z'].map((axis, index) => (
              <input
                key={axis}
                type="number"
                step="0.1"
                min="0.1"
                value={selectedObject.scale[index].toFixed(2)}
                onChange={(e) => {
                  const newScale = [...selectedObject.scale] as [number, number, number];
                  newScale[index] = Math.max(0.1, parseFloat(e.target.value) || 0.1);
                  onUpdateObject(selectedObject.id, { scale: newScale });
                }}
                className="px-2 py-1 glass rounded text-white text-xs text-center"
                placeholder={axis.toUpperCase()}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Material Properties */}
      <div className="space-y-4">
        <h4 className="text-sm font-orbitron font-bold text-accent-400">Material</h4>
        
        {/* Color */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">Color</label>
          <input
            type="color"
            value={selectedObject.color}
            onChange={(e) => onUpdateObject(selectedObject.id, { color: e.target.value })}
            className="w-full h-10 glass rounded-lg border border-white/10 cursor-pointer"
          />
        </div>
        
        {/* Opacity */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">Opacity: {selectedObject.opacity.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={selectedObject.opacity}
            onChange={(e) => onUpdateObject(selectedObject.id, { opacity: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
        
        {/* Metalness */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">Metalness: {selectedObject.metalness.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={selectedObject.metalness}
            onChange={(e) => onUpdateObject(selectedObject.id, { metalness: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
        
        {/* Roughness */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">Roughness: {selectedObject.roughness.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={selectedObject.roughness}
            onChange={(e) => onUpdateObject(selectedObject.id, { roughness: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
        
        {/* Emissive Color */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">Emissive Color</label>
          <input
            type="color"
            value={selectedObject.emissive}
            onChange={(e) => onUpdateObject(selectedObject.id, { emissive: e.target.value })}
            className="w-full h-8 glass rounded-lg border border-white/10 cursor-pointer"
          />
        </div>
        
        {/* Emissive Intensity */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">Emissive Intensity: {selectedObject.emissiveIntensity.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={selectedObject.emissiveIntensity}
            onChange={(e) => onUpdateObject(selectedObject.id, { emissiveIntensity: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
        
        {/* Wireframe */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-slate-300">Wireframe</label>
          <button
            onClick={() => onUpdateObject(selectedObject.id, { wireframe: !selectedObject.wireframe })}
            className={`p-2 glass rounded-lg transition-all duration-300 ${
              selectedObject.wireframe ? 'neon-glow-accent' : 'hover:neon-glow'
            }`}
          >
            <Grid3X3 className={`w-4 h-4 ${selectedObject.wireframe ? 'text-accent-400' : 'text-slate-400'}`} />
          </button>
        </div>
        
        {/* Visibility */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-slate-300">Visible</label>
          <button
            onClick={() => onUpdateObject(selectedObject.id, { visible: !selectedObject.visible })}
            className="p-2 glass rounded-lg hover:neon-glow transition-all duration-300"
          >
            {selectedObject.visible ? (
              <Eye className="w-4 h-4 text-primary-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

// Scene Hierarchy Panel
const HierarchyPanel = memo<{
  objects: SceneObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string) => void;
  onUpdateObject: (id: string, updates: Partial<SceneObject>) => void;
  onDeleteObject: (id: string) => void;
}>(({ objects, selectedObjectId, onSelectObject, onUpdateObject, onDeleteObject }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-20 left-6 w-64 max-h-[60vh] overflow-y-auto glass-strong rounded-xl p-4 space-y-4 custom-scrollbar"
    >
      <h3 className="text-lg font-orbitron font-bold text-white tracking-tight flex items-center">
        <Layers className="w-5 h-5 mr-2 text-primary-400" />
        Scene Hierarchy
      </h3>
      
      <div className="space-y-2">
        {objects.map((object) => (
          <div
            key={object.id}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${
              selectedObjectId === object.id 
                ? 'glass-strong neon-glow-accent' 
                : 'glass hover:glass-strong'
            }`}
            onClick={() => onSelectObject(object.id)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                {object.type === 'box' && <Box className="w-4 h-4 text-primary-400" />}
                {object.type === 'sphere' && <Sphere className="w-4 h-4 text-primary-400" />}
                {object.type === 'cylinder' && <Cylinder className="w-4 h-4 text-primary-400" />}
                {object.type === 'cone' && <Triangle className="w-4 h-4 text-primary-400" />}
              </div>
              <span className="text-sm text-white truncate">{object.name}</span>
            </div>
            
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateObject(object.id, { visible: !object.visible });
                }}
                className="p-1 hover:bg-white/10 rounded"
              >
                {object.visible ? (
                  <Eye className="w-3 h-3 text-slate-400" />
                ) : (
                  <EyeOff className="w-3 h-3 text-slate-600" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteObject(object.id);
                }}
                className="p-1 hover:bg-red-500/20 rounded"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
              </button>
            </div>
          </div>
        ))}
        
        {objects.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No objects in scene</p>
          </div>
        )}
      </div>
    </motion.div>
  );
});

// Loading Component
const LoadingScreen = memo(() => (
  <Html center>
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-3 border-primary-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-white font-orbitron tracking-wide text-sm">Loading 3D Editor...</p>
    </div>
  </Html>
));

// Main Enhanced 3D Editor Component
const ThreeDEditor: React.FC = () => {
  // Core state
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<TransformMode>('translate');
  
  // History state for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // UI state
  const [showGrid, setShowGrid] = useState(true);
  const [showLightHelpers, setShowLightHelpers] = useState(false);
  const [showHierarchy, setShowHierarchy] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Camera controls
  const orbitControlsRef = useRef<any>();

  // Save state to history for undo/redo
  const saveToHistory = useCallback(() => {
    const newState: HistoryState = {
      objects: JSON.parse(JSON.stringify(objects)),
      selectedObjectId,
      timestamp: Date.now()
    };
    
    // Remove any history after current index
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(prev => prev + 1);
    }
    
    setHistory(newHistory);
  }, [objects, selectedObjectId, history, historyIndex]);

  // Undo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setObjects(prevState.objects);
      setSelectedObjectId(prevState.selectedObjectId);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  // Redo functionality
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setObjects(nextState.objects);
      setSelectedObjectId(nextState.selectedObjectId);
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 's':
            e.preventDefault();
            saveScene();
            break;
          case 'd':
            e.preventDefault();
            if (selectedObjectId) {
              duplicateSelectedObject();
            }
            break;
        }
      } else {
        switch (e.key) {
          case 'Delete':
          case 'Backspace':
            if (selectedObjectId) {
              deleteSelectedObject();
            }
            break;
          case 'g':
            setTransformMode('translate');
            break;
          case 'r':
            setTransformMode('rotate');
            break;
          case 's':
            setTransformMode('scale');
            break;
          case 'Escape':
            setSelectedObjectId(null);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObjectId, undo, redo]);

  // Generate unique ID for new objects
  const generateId = () => `object_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Add new object to scene
  const addObject = useCallback((type: SceneObject['type']) => {
    const newObject: SceneObject = {
      id: generateId(),
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#7855ff',
      visible: true,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${objects.length + 1}`,
      wireframe: false,
      opacity: 1,
      metalness: 0,
      roughness: 0.5,
      emissive: '#000000',
      emissiveIntensity: 0
    };
    
    setObjects(prev => [...prev, newObject]);
    setSelectedObjectId(newObject.id);
    saveToHistory();
  }, [objects.length, saveToHistory]);

  // Delete selected object
  const deleteSelectedObject = useCallback(() => {
    if (selectedObjectId) {
      setObjects(prev => prev.filter(obj => obj.id !== selectedObjectId));
      setSelectedObjectId(null);
      saveToHistory();
    }
  }, [selectedObjectId, saveToHistory]);

  // Delete object by ID
  const deleteObject = useCallback((id: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== id));
    if (selectedObjectId === id) {
      setSelectedObjectId(null);
    }
    saveToHistory();
  }, [selectedObjectId, saveToHistory]);

  // Duplicate selected object
  const duplicateSelectedObject = useCallback(() => {
    if (selectedObjectId) {
      const objectToDuplicate = objects.find(obj => obj.id === selectedObjectId);
      if (objectToDuplicate) {
        const duplicatedObject: SceneObject = {
          ...objectToDuplicate,
          id: generateId(),
          position: [
            objectToDuplicate.position[0] + 1,
            objectToDuplicate.position[1],
            objectToDuplicate.position[2]
          ],
          name: `${objectToDuplicate.name} Copy`
        };
        setObjects(prev => [...prev, duplicatedObject]);
        setSelectedObjectId(duplicatedObject.id);
        saveToHistory();
      }
    }
  }, [selectedObjectId, objects, saveToHistory]);

  // Update object properties
  const updateObject = useCallback((id: string, updates: Partial<SceneObject>) => {
    setObjects(prev => prev.map(obj => 
      obj.id === id ? { ...obj, ...updates } : obj
    ));
    // Don't save to history for every property change to avoid spam
  }, []);

  // Transform object (with history save)
  const transformObject = useCallback((id: string, property: 'position' | 'rotation' | 'scale', value: [number, number, number]) => {
    updateObject(id, { [property]: value });
    // Save to history after transform is complete
    setTimeout(saveToHistory, 100);
  }, [updateObject, saveToHistory]);

  // Clear scene
  const clearScene = useCallback(() => {
    setObjects([]);
    setSelectedObjectId(null);
    saveToHistory();
  }, [saveToHistory]);

  // Save scene to file
  const saveScene = useCallback(() => {
    const sceneData = {
      objects,
      metadata: {
        version: '1.0',
        created: new Date().toISOString(),
        objectCount: objects.length
      }
    };
    
    const dataStr = JSON.stringify(sceneData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `scene_${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [objects]);

  // Load scene from file
  const loadScene = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const sceneData = JSON.parse(e.target?.result as string);
          if (sceneData.objects && Array.isArray(sceneData.objects)) {
            setObjects(sceneData.objects);
            setSelectedObjectId(null);
            saveToHistory();
          }
        } catch (error) {
          console.error('Failed to load scene:', error);
        }
      };
      reader.readAsText(file);
    }
    // Reset input
    event.target.value = '';
  }, [saveToHistory]);

  // Camera preset functions
  const setCameraPreset = useCallback((preset: CameraPreset) => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.object.position.set(...preset.position);
      orbitControlsRef.current.target.set(...preset.target);
      orbitControlsRef.current.update();
    }
  }, []);

  // Get selected object
  const selectedObject = selectedObjectId ? objects.find(obj => obj.id === selectedObjectId) || null : null;

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      saveToHistory();
    }
  }, []);

  return (
    <section id="editor" className="relative h-screen overflow-hidden bg-black">
      {/* 3D Canvas - Optimized for mobile performance */}
      <Canvas
        camera={{ position: [5, 5, 5], fov: 60 }}
        gl={{ 
          antialias: window.innerWidth > 768, // Disable antialiasing on mobile
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={window.innerWidth > 768 ? [1, 2] : [1, 1.5]} // Lower DPR on mobile
        shadows
        frameloop={isPlaying ? "always" : "demand"}
        onClick={() => setSelectedObjectId(null)}
      >
        <Suspense fallback={<LoadingScreen />}>
          <EditorScene
            objects={objects}
            selectedObjectId={selectedObjectId}
            transformMode={transformMode}
            showGrid={showGrid}
            showLightHelpers={showLightHelpers}
            onSelectObject={setSelectedObjectId}
            onTransformObject={transformObject}
          />
          
          {/* Enhanced Camera Controls - optimized for mobile */}
          <OrbitControls
            ref={orbitControlsRef}
            makeDefault
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            target={[0, 0, 0]}
            maxDistance={30} // Reduced for mobile
            minDistance={1}
            enableDamping={true}
            dampingFactor={0.08} // Slightly higher for mobile responsiveness
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center pointer-events-auto"
        >
          <h1 className="text-2xl lg:text-4xl font-orbitron font-black text-gradient mb-2 leading-tight tracking-tighter">
            ENTERPRISE 3D EDITOR
          </h1>
          <p className="text-xs lg:text-sm text-slate-300 tracking-wide">
            Professional-grade 3D scene creation and manipulation platform
          </p>
        </motion.div>

        {/* Main Toolbar - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-16 lg:top-20 left-1/2 transform -translate-x-1/2 pointer-events-auto"
        >
          <div className="flex items-center space-x-2 lg:space-x-4 glass-strong rounded-xl p-2 lg:p-4">
            {/* File Operations */}
            <div className="flex items-center space-x-1 lg:space-x-2 border-r border-white/10 pr-2 lg:pr-4">
              <button
                onClick={saveScene}
                className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-1 lg:py-2 glass rounded-lg neon-glow hover:neon-glow-accent transition-all duration-300"
                title="Save Scene (Ctrl+S)"
              >
                <Save className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
                <span className="text-xs lg:text-sm text-white hidden sm:inline">Save</span>
              </button>
              
              <label className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-1 lg:py-2 glass rounded-lg neon-glow hover:neon-glow-accent transition-all duration-300 cursor-pointer">
                <Upload className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
                <span className="text-xs lg:text-sm text-white hidden sm:inline">Load</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={loadScene}
                  className="hidden"
                />
              </label>
            </div>

            {/* History Operations */}
            <div className="flex items-center space-x-1 lg:space-x-2 border-r border-white/10 pr-2 lg:pr-4">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-1 lg:p-2 glass rounded-lg neon-glow hover:neon-glow-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
              </button>
              
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-1 lg:p-2 glass rounded-lg neon-glow hover:neon-glow-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
              </button>
            </div>

            {/* Transform Modes */}
            <div className="flex items-center space-x-1 lg:space-x-2 border-r border-white/10 pr-2 lg:pr-4">
              <button
                onClick={() => setTransformMode('translate')}
                className={`p-1 lg:p-2 glass rounded-lg transition-all duration-300 ${
                  transformMode === 'translate' ? 'neon-glow-accent' : 'neon-glow hover:neon-glow-accent'
                }`}
                title="Translate Mode (G)"
              >
                <Move className={`w-3 lg:w-4 h-3 lg:h-4 ${transformMode === 'translate' ? 'text-accent-400' : 'text-white'}`} />
              </button>
              
              <button
                onClick={() => setTransformMode('rotate')}
                className={`p-1 lg:p-2 glass rounded-lg transition-all duration-300 ${
                  transformMode === 'rotate' ? 'neon-glow-accent' : 'neon-glow hover:neon-glow-accent'
                }`}
                title="Rotate Mode (R)"
              >
                <RotateCw className={`w-3 lg:w-4 h-3 lg:h-4 ${transformMode === 'rotate' ? 'text-accent-400' : 'text-white'}`} />
              </button>
              
              <button
                onClick={() => setTransformMode('scale')}
                className={`p-1 lg:p-2 glass rounded-lg transition-all duration-300 ${
                  transformMode === 'scale' ? 'neon-glow-accent' : 'neon-glow hover:neon-glow-accent'
                }`}
                title="Scale Mode (S)"
              >
                <Maximize className={`w-3 lg:w-4 h-3 lg:h-4 ${transformMode === 'scale' ? 'text-accent-400' : 'text-white'}`} />
              </button>
            </div>

            {/* View Options */}
            <div className="flex items-center space-x-1 lg:space-x-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-1 lg:p-2 glass rounded-lg transition-all duration-300 ${
                  showGrid ? 'neon-glow-accent' : 'neon-glow hover:neon-glow-accent'
                }`}
                title="Toggle Grid"
              >
                <Grid3X3 className={`w-3 lg:w-4 h-3 lg:h-4 ${showGrid ? 'text-accent-400' : 'text-white'}`} />
              </button>
              
              <button
                onClick={() => setShowLightHelpers(!showLightHelpers)}
                className={`p-1 lg:p-2 glass rounded-lg transition-all duration-300 ${
                  showLightHelpers ? 'neon-glow-accent' : 'neon-glow hover:neon-glow-accent'
                }`}
                title="Toggle Light Helpers"
              >
                <Lightbulb className={`w-3 lg:w-4 h-3 lg:h-4 ${showLightHelpers ? 'text-accent-400' : 'text-white'}`} />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-1 lg:p-2 glass rounded-lg transition-all duration-300 ${
                  isPlaying ? 'neon-glow-accent' : 'neon-glow hover:neon-glow-accent'
                }`}
                title="Toggle Animation"
              >
                {isPlaying ? (
                  <Pause className="w-3 lg:w-4 h-3 lg:h-4 text-accent-400" />
                ) : (
                  <Play className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Add Objects Toolbar - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute top-32 lg:top-40 left-2 lg:left-6 pointer-events-auto"
        >
          <div className="glass-strong rounded-xl p-2 lg:p-4 space-y-2 lg:space-y-3">
            <h3 className="text-xs lg:text-sm font-orbitron font-bold text-white tracking-tight flex items-center">
              <Plus className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2 text-primary-400" />
              <span className="hidden sm:inline">Add Objects</span>
            </h3>
            <div className="grid grid-cols-2 gap-1 lg:gap-2">
              <button
                onClick={() => addObject('box')}
                className="flex items-center justify-center p-2 lg:p-3 glass rounded-lg neon-glow hover:neon-glow-accent transition-all duration-300"
                title="Add Box"
              >
                <Box className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
              </button>
              <button
                onClick={() => addObject('sphere')}
                className="flex items-center justify-center p-2 lg:p-3 glass rounded-lg neon-glow hover:neon-glow-accent transition-all duration-300"
                title="Add Sphere"
              >
                <Sphere className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
              </button>
              <button
                onClick={() => addObject('cylinder')}
                className="flex items-center justify-center p-2 lg:p-3 glass rounded-lg neon-glow hover:neon-glow-accent transition-all duration-300"
                title="Add Cylinder"
              >
                <Cylinder className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
              </button>
              <button
                onClick={() => addObject('cone')}
                className="flex items-center justify-center p-2 lg:p-3 glass rounded-lg neon-glow hover:neon-glow-accent transition-all duration-300"
                title="Add Cone"
              >
                <Triangle className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Camera Presets - Hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-40 right-6 pointer-events-auto hidden lg:block"
        >
          <div className="glass-strong rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-orbitron font-bold text-white tracking-tight flex items-center">
              <Camera className="w-4 h-4 mr-2 text-primary-400" />
              Camera
            </h3>
            <div className="space-y-2">
              {cameraPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setCameraPreset(preset)}
                  className="w-full px-3 py-2 text-sm glass rounded-lg neon-glow hover:neon-glow-accent transition-all duration-300 text-white"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Status Bar - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-2 lg:bottom-6 left-2 lg:left-6 right-2 lg:right-6 flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0 pointer-events-auto"
        >
          <div className="glass-strong px-2 lg:px-4 py-1 lg:py-2 rounded-full">
            <span className="text-xs lg:text-sm text-slate-300 tracking-wide">
              Objects: {objects.length} | Selected: {selectedObject?.name || 'None'}
            </span>
          </div>
          
          <div className="glass-strong px-2 lg:px-4 py-1 lg:py-2 rounded-full">
            <span className="text-xs lg:text-sm text-slate-300 tracking-wide">
              Mode: {transformMode} | {isPlaying ? 'Playing' : 'Paused'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scene Hierarchy Panel - Hidden on mobile by default */}
      <AnimatePresence>
        {showHierarchy && (
          <div className="hidden lg:block">
            <HierarchyPanel
              objects={objects}
              selectedObjectId={selectedObjectId}
              onSelectObject={setSelectedObjectId}
              onUpdateObject={updateObject}
              onDeleteObject={deleteObject}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Properties Panel - Hidden on mobile by default */}
      <AnimatePresence>
        {selectedObject && (
          <div className="hidden lg:block">
            <PropertiesPanel
              selectedObject={selectedObject}
              onUpdateObject={updateObject}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Toggle Hierarchy Button */}
      <button
        onClick={() => setShowHierarchy(!showHierarchy)}
        className="absolute top-24 lg:top-32 left-2 lg:left-6 p-2 lg:p-3 glass-strong rounded-lg neon-glow hover:neon-glow-accent transition-all duration-300 z-20 lg:hidden"
        title="Toggle Hierarchy Panel"
      >
        <Layers className={`w-4 lg:w-5 h-4 lg:h-5 ${showHierarchy ? 'text-accent-400' : 'text-white'}`} />
      </button>
    </section>
  );
};

export default ThreeDEditor;