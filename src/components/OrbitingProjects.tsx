import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Palette } from 'lucide-react';
import { Project } from '../data/projects';
import ProjectCard from './ProjectCard';

interface OrbitingProjectsProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const OrbitingProjects: React.FC<OrbitingProjectsProps> = ({ 
  projects, 
  onProjectClick
}) => {
  const [radius, setRadius] = useState(450);

  // Enhanced responsive radius adjustment with larger distances
  useEffect(() => {
    const updateRadius = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setRadius(250);  // Increased from 200
      } else if (width < 1024) {
        setRadius(350);  // Increased from 250
      } else {
        setRadius(450);  // Increased from 300
      }
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // Calculate positions for each project in orbit
  const getProjectPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y, angle };
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh]">
      {/* Central Profile Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="relative inline-block mb-8"
      >
        <div className="w-64 h-64 mx-auto relative">
          <div className="absolute inset-0 rounded-full bg-gradient-main opacity-30" />
          <div className="absolute inset-2 rounded-full glass-strong backdrop-blur-lg overflow-hidden neon-glow">
            <img
              src="/AD426902-0D29-4D16-8F67-A99D342AC311.jpeg"
              alt="Omry Damari - Founder of Visigence"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating Icons */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <Brain className="absolute top-4 right-4 w-6 h-6 text-primary-400" />
            <Code className="absolute bottom-4 left-4 w-6 h-6 text-accent-400" />
            <Palette className="absolute top-1/2 -right-2 w-6 h-6 text-purple-400" />
          </motion.div>
        </div>
      </motion.div>

      {/* Name and Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-8"
      >
        <h2 className="text-4xl lg:text-5xl font-orbitron font-bold text-gradient leading-tight tracking-tighter">
          OMRY DAMARI
        </h2>
        <p className="text-lg text-slate-300 mt-4 tracking-wide">
          Founder & Digital Visionary
        </p>
      </motion.div>

      {/* Orbiting Container */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Enhanced Orbit Ring Visual */}
        <div 
          className="absolute border-2 border-primary-400/30 rounded-full"
          style={{
            width: radius * 2,
            height: radius * 2,
            boxShadow: '0 0 30px rgba(120, 85, 255, 0.15), inset 0 0 15px rgba(120, 85, 255, 0.05)'
          }}
        />
        
        {/* Project Cards */}
        {projects.map((project, index) => {
          const position = getProjectPosition(index, projects.length);
          
          return (
            <motion.div
              key={project.id}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
              // Counter-rotate to keep cards upright
              animate={{ rotate: -360 }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <ProjectCard
                project={project}
                onClick={() => onProjectClick(project)}
                index={index}
                style={{
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Enhanced Ambient Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Enhanced Central Glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary-500/15 rounded-full blur-3xl opacity-15" />
        
        {/* Enhanced Orbit Glow */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-primary-400/15 rounded-full opacity-15"
          style={{
            width: radius * 2.5,
            height: radius * 2.5,
          }}
        />
        
        {/* Enhanced Floating Particles with variety */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'w-1 h-1 bg-white/50' : 
              i % 3 === 1 ? 'w-2 h-2 bg-primary-400/50' : 
              'w-3 h-3 bg-accent-400/40'
            }`}
            style={{
              left: `${10 + (i * 5)}%`,
              top: `${10 + (i * 5)}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-15, 15, -15],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.6, 1.4, 0.6],
            }}
            transition={{
              duration: 6 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
        
        {/* Additional atmospheric layers */}
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-accent-400/5 opacity-30" />
        <div className="absolute inset-0 bg-gradient-conic from-primary-400/10 via-transparent to-accent-400/10 opacity-20 animate-spin" 
             style={{ animationDuration: '120s' }} />
      </div>
    </div>
  );
};

export default OrbitingProjects;