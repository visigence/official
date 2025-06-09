import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Play } from 'lucide-react';
import { Project } from '../data/projects';

interface ProjectDetailViewProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, onClose }) => {
  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const IconComponent = project.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden glass-strong rounded-2xl neon-glow-accent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 glass rounded-lg neon-glow hover:neon-glow-accent transition-all duration-300"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Content Container */}
        <div className="relative h-full">
          {/* Live Component View for 3D Editor */}
          {project.liveComponent && project.id === 'enterprise-3d-editor' ? (
            <div className="relative h-full">
              {/* Blur Overlay that fades out */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 2, delay: 1 }}
                className="absolute inset-0 z-10 backdrop-blur-md bg-black/20 flex items-center justify-center"
              >
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full mx-auto"
                  />
                  <p className="text-white font-orbitron text-lg tracking-wide">
                    Initializing 3D Editor...
                  </p>
                </div>
              </motion.div>
              
              {/* Live 3D Editor Component */}
              <project.liveComponent isModalView={true} />
            </div>
          ) : (
            /* Static Project Details */
            <div className="h-full overflow-y-auto custom-scrollbar">
              {/* Hero Image */}
              <div className="relative h-80 lg:h-96 overflow-hidden">
                <img
                  src={project.previewImg}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Project Icon */}
                <div className="absolute top-6 left-6 p-4 glass rounded-xl neon-glow">
                  <IconComponent className="w-8 h-8 text-primary-400" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12 space-y-8">
                {/* Header */}
                <div className="space-y-6">
                  <div className="flex items-start justify-between flex-wrap gap-6">
                    <div className="space-y-4">
                      <h1 className="text-4xl lg:text-5xl font-orbitron font-bold text-gradient tracking-tighter">
                        {project.name}
                      </h1>
                      <span className="inline-block glass px-6 py-3 rounded-full text-primary-400 font-medium tracking-wide">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-xl leading-relaxed tracking-wide max-w-4xl">
                    {project.longDescription}
                  </p>
                </div>

                {/* Technologies */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-orbitron font-bold text-white tracking-tight">
                    Technologies Used
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 glass rounded-full text-sm text-white border border-primary-400/30 tracking-wide hover:border-primary-400/60 transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-6 pt-4">
                  {project.liveUrl && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 glass-strong px-8 py-4 rounded-full neon-glow-accent hover:neon-glow transition-all duration-300"
                    >
                      <ExternalLink className="w-5 h-5 text-accent-400" />
                      <span className="text-white font-medium tracking-wide">View Live</span>
                    </motion.a>
                  )}
                  
                  {project.sourceUrl && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 glass px-8 py-4 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
                    >
                      <Github className="w-5 h-5 text-slate-300" />
                      <span className="text-white font-medium tracking-wide">View Code</span>
                    </motion.a>
                  )}
                  
                  {project.liveComponent && project.id !== 'enterprise-3d-editor' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-3 glass px-8 py-4 rounded-full border border-accent-400/30 hover:border-accent-400/60 transition-all duration-300"
                    >
                      <Play className="w-5 h-5 text-accent-400" />
                      <span className="text-white font-medium tracking-wide">Launch Demo</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetailView;