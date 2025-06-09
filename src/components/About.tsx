import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Palette } from 'lucide-react';
import { AppSection } from '../App';
import { Project, featuredProjects } from '../data/projects';
import OrbitingProjects from './OrbitingProjects';

interface AboutProps {
  setActiveSection: (section: AppSection) => void;
  onProjectClick: (project: Project) => void;
}

// Section Header Component
const SectionHeader: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="text-center mb-20"
  >
    <h2 className="text-4xl lg:text-6xl font-orbitron font-black text-gradient mb-8 leading-tight tracking-tighter">
      DIGITAL ARCHITECT
    </h2>
    <p className="text-xl text-slate-300 max-w-text-content mx-auto leading-relaxed tracking-wide">
      Explore the intersection of technology and creativity through interactive project experiences
    </p>
  </motion.div>
);

// Interaction Hint Component
const InteractionHint: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 1 }}
    viewport={{ once: true }}
    className="text-center mt-20"
  >
    <div className="glass-strong px-6 py-3 rounded-full inline-block">
      <p className="text-sm text-slate-300 tracking-wide">
        Click on any orbiting project to explore • Projects rotate automatically
      </p>
    </div>
  </motion.div>
);

// Main About Component
const About: React.FC<AboutProps> = ({ setActiveSection, onProjectClick }) => {
  return (
    <section id="about" className="py-24 lg:py-40 relative overflow-hidden min-h-screen">
      <SectionHeader />
      <OrbitingProjects 
        projects={featuredProjects} 
        onProjectClick={onProjectClick}
      />
      <InteractionHint />
    </section>
  );
};

export default About;