import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  style?: React.CSSProperties;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, style, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = project.icon;

  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.1, 
        y: -10,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="absolute cursor-pointer group"
    >
      {/* Main Card Container */}
      <div className="relative w-32 h-40 lg:w-40 lg:h-48">
        {/* Enhanced Neon Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/40 to-accent-400/40 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60 group-hover:opacity-100" />
        
        {/* Glass Card with enhanced effects */}
        <div className="relative w-full h-full glass-strong rounded-xl border border-white/20 group-hover:border-primary-400/60 transition-all duration-300 overflow-hidden neon-glow group-hover:neon-glow-accent">
          {/* Preview Image with enhanced hover effect */}
          <div className="relative h-2/3 overflow-hidden">
            <img
              src={project.previewImg}
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Enhanced Icon Overlay */}
            <div className="absolute top-2 right-2 p-2 glass rounded-lg group-hover:neon-glow-accent transition-all duration-300">
              <IconComponent className="w-4 h-4 text-primary-400 group-hover:text-accent-400 transition-colors duration-300" />
            </div>
            
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </div>
          
          {/* Content */}
          <div className="p-3 h-1/3 flex flex-col justify-center">
            <h3 className="text-sm lg:text-base font-orbitron font-bold text-white group-hover:text-gradient transition-all duration-300 text-center tracking-tight">
              {project.name}
            </h3>
            <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300 text-center mt-1 tracking-wide">
              {project.category}
            </p>
          </div>
        </div>
        
        {/* Enhanced Hover Info Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? 0 : 10 
          }}
          transition={{ duration: 0.3 }}
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-48 lg:w-56 pointer-events-none z-20"
        >
          <div className="glass-strong rounded-lg p-4 neon-glow-accent border border-primary-400/30 backdrop-blur-xl">
            <p className="text-xs text-slate-300 text-center line-clamp-3 leading-relaxed tracking-wide">
              {project.shortDescription}
            </p>
          </div>
        </motion.div>
        
        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                i % 2 === 0 ? 'w-1 h-1 bg-primary-400/60' : 'w-0.5 h-0.5 bg-accent-400/80'
              }`}
              style={{
                left: `${15 + i * 20}%`,
                top: `${10 + i * 15}%`,
              }}
              animate={{
                y: [-8, 8, -8],
                x: [-4, 4, -4],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
        
        {/* Orbital ring effect */}
        <div className="absolute inset-0 border border-primary-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};

export default ProjectCard;