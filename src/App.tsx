import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import ThreeDEditor from './components/ThreeDEditor';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectDetailView from './components/ProjectDetailView';
import { Project } from './data/projects';

export type AppSection = 'home' | 'about' | 'editor' | 'contact';

function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    // Smooth scrolling polyfill for older browsers
    if (!('scrollBehavior' in document.documentElement.style)) {
      import('smoothscroll-polyfill').then(smoothscroll => {
        smoothscroll.polyfill();
      });
    }

    // Set page title
    document.title = 'Visigence - Digital Visionary | Omry Damari';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Visigence - Premium digital experiences through cutting-edge web development, 3D modeling, and AI solutions. Founded by Omry Damari.'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Visigence - Premium digital experiences through cutting-edge web development, 3D modeling, and AI solutions. Founded by Omry Damari.';
      document.head.appendChild(meta);
    }
  }, []);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setActiveSection('editor');
  };

  const handleCloseProjectDetail = () => {
    setSelectedProject(null);
    setActiveSection('about');
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <Hero setActiveSection={setActiveSection} />;
      case 'about':
        return <About setActiveSection={setActiveSection} onProjectClick={handleProjectClick} />;
      case 'editor':
        return selectedProject?.liveComponent ? (
          <selectedProject.liveComponent />
        ) : (
          <ThreeDEditor />
        );
      case 'contact':
        return <Contact />;
      default:
        return <Hero setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="relative">
      {/* Global Loading Animation */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed inset-0 z-50 bg-dark-900 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"
        />
      </motion.div>

      {/* Header */}
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content with Section Transitions */}
      <main className={`relative ${activeSection === 'editor' && selectedProject ? 'fixed inset-0 z-40' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && activeSection === 'editor' && (
          <ProjectDetailView
            project={selectedProject}
            onClose={handleCloseProjectDetail}
          />
        )}
      </AnimatePresence>

      {/* Footer - only show on home and contact sections */}
      <AnimatePresence>
        {(activeSection === 'home' || activeSection === 'contact') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Footer setActiveSection={setActiveSection} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/10 via-transparent to-accent-500/10 animate-gradient" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden opacity-60">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${6 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;