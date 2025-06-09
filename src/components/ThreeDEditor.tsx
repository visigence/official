import React, { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Box, Cherry as Sphere, Triangle, Cylinder, Settings, Eye, EyeOff, Copy, 
  RotateCcw, Move, RotateCw, Maximize, Undo, Redo, Save, Upload, Download, 
  Grid3X3, Sun, Lightbulb, Camera, Play, Pause, Layers, ZoomIn, ZoomOut,
  MousePointer, Hand, RotateCcw as Reset, Palette, Sliders
} from 'lucide-react';

// Import types and constants
import { SceneObject, HistoryState, TransformMode, CameraPreset } from './threeDEditor/types';
import { cameraPresets } from './threeDEditor/constants';

// Import components
import EditorScene from './threeDEditor/EditorScene';
import PropertiesPanel from './threeDEditor/PropertiesPanel';
import HierarchyPanel from './threeDEditor/HierarchyPanel';
import LoadingScreen from './threeDEditor/LoadingScreen';

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