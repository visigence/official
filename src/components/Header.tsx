import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { AppSection } from '../App';

interface HeaderProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', section: 'home' as AppSection },
    { name: 'About', section: 'about' as AppSection },
    { name: 'Editor', section: 'editor' as AppSection },
    { name: 'Contact', section: 'contact' as AppSection },
  ];

  const navigateToSection = (section: AppSection) => {
    setActiveSection(section);
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-strong backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 sm:px-16 lg:px-24">
        <div className="flex items-center justify-between h-18 lg:h-22">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigateToSection('home')}
          >
            <div className="relative">
              <Zap className="w-8 h-8 text-primary-400" />
            </div>
            <span className="text-xl lg:text-2xl font-orbitron font-bold text-gradient tracking-tight">
              VISIGENCE
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateToSection(item.section)}
                className={`relative font-medium group tracking-wide transition-colors duration-300 ${
                  activeSection === item.section 
                    ? 'text-primary-400' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.name}
                <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-400 to-accent-400 transition-all duration-300 ${
                  activeSection === item.section ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 glass rounded-lg neon-glow"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-strong backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-8 py-8 space-y-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  onClick={() => navigateToSection(item.section)}
                  className={`block w-full text-left text-lg py-3 tracking-wide transition-colors duration-300 ${
                    activeSection === item.section 
                      ? 'text-primary-400' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;