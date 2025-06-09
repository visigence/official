import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Grid3X3, Eye, EyeOff } from 'lucide-react';
import { SceneObject } from './types';

interface PropertiesPanelProps {
  selectedObject: SceneObject | null;
  onUpdateObject: (id: string, updates: Partial<SceneObject>) => void;
}

// Enhanced Properties Panel with material controls
const PropertiesPanel = memo<PropertiesPanelProps>(({ selectedObject, onUpdateObject }) => {
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

export default PropertiesPanel;