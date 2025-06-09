import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Layers, Box, Cherry as Sphere, Cylinder, Triangle, Eye, EyeOff, Trash2 } from 'lucide-react';
import { SceneObject } from './types';

interface HierarchyPanelProps {
  objects: SceneObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string) => void;
  onUpdateObject: (id: string, updates: Partial<SceneObject>) => void;
  onDeleteObject: (id: string) => void;
}

// Scene Hierarchy Panel
const HierarchyPanel = memo<HierarchyPanelProps>(({ 
  objects, 
  selectedObjectId, 
  onSelectObject, 
  onUpdateObject, 
  onDeleteObject 
}) => {
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

export default HierarchyPanel;