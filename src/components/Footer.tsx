import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Heart, Zap } from 'lucide-react';
import { AppSection } from '../App';

interface FooterProps {
  setActiveSection: (section: AppSection) => void;
}

const Footer: React.FC<FooterProps> = ({ setActiveSection }) => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/visigence', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/omrydamari', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/visigence', label: 'Twitter' },
    { icon: Mail, href: 'mailto:omry@visigence.com', label: 'Email' },
  ];

  const quickLinks = [
    { name: 'Home', section: 'home' as AppSection },
    { name: 'About', section: 'about' as AppSection },
    { name: 'Editor', section: 'editor' as AppSection },
    { name: 'Contact', section: 'contact' as AppSection },
  ];

  const services = [
    'Web Development',
    '3D Modeling',
    'AI Solutions',
    'UI/UX Design',
  ];

  const navigateToSection = (section: AppSection) => {
    setActiveSection(section);
  };

  const scrollToTop = () => {
    setActiveSection('home');
  };

  return (
    <footer className="relative bg-dark-800/50 backdrop-blur-sm border-t border-white/10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-radial opacity-5" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-8 sm:px-16 lg:px-24 relative z-10">
        {/* Main Footer Content */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={scrollToTop}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="relative">
                <Zap className="w-8 h-8 text-primary-400 group-hover:text-accent-400 transition-colors duration-300" />
              </div>
              <span className="text-2xl font-orbitron font-bold text-gradient tracking-tight">
                VISIGENCE
              </span>
            </motion.div>
            
            <p className="text-slate-400 leading-relaxed tracking-wide max-w-prose">
              Transforming digital visions into extraordinary realities through 
              cutting-edge technology and innovative design.
            </p>

            {/* Social Links */}
            <div className="flex space-x-6">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 glass rounded-lg neon-glow hover:neon-glow-accent transition-all duration-300 group"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-lg font-orbitron font-bold text-white tracking-tight">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigateToSection(link.section)}
                    className="text-slate-400 hover:text-white transition-colors duration-300 tracking-wide"
                  >
                    {link.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-lg font-orbitron font-bold text-white tracking-tight">
              Services
            </h3>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-slate-400 hover:text-primary-400 transition-colors duration-300 cursor-default tracking-wide">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-lg font-orbitron font-bold text-white tracking-tight">
              Contact
            </h3>
            <div className="space-y-4">
              <a
                href="mailto:omry@visigence.com"
                className="block text-slate-400 hover:text-accent-400 transition-colors duration-300 tracking-wide"
              >
                omry@visigence.com
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="py-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0"
        >
          <div className="flex items-center space-x-3 text-slate-400 tracking-wide">
            <span>© {currentYear} Visigence. Made with</span>
            <Heart className="w-4 h-4 text-red-400 animate-pulse" />
            <span>and cutting-edge tech</span>
          </div>
          
          <div className="flex items-center space-x-8 text-sm text-slate-400">
            <button className="hover:text-white transition-colors duration-300 tracking-wide">
              Privacy Policy
            </button>
            <button className="hover:text-white transition-colors duration-300 tracking-wide">
              Terms of Service
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;