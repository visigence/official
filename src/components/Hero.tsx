import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Zap } from 'lucide-react';
import { AppSection } from '../App';

interface HeroProps {
  setActiveSection: (section: AppSection) => void;
}

const Hero: React.FC<HeroProps> = ({ setActiveSection }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 0,
        maxLife: Math.random() * 200 + 100,
      };
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add new particles
      if (particles.length < 50 && Math.random() < 0.1) {
        particles.push(createParticle());
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        if (particle.life > particle.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = 1 - particle.life / particle.maxLife;
        const hue = (particle.life * 2) % 360;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `hsl(${240 + hue * 0.1}, 100%, 70%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const navigateToEditor = () => {
    setActiveSection('editor');
  };

  const navigateToAbout = () => {
    setActiveSection('about');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-30"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-radial opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-accent-500/20" />
      
      {/* Floating Elements */}
      <div className="absolute top-24 left-16 animate-float">
        <Sparkles className="w-6 h-6 text-primary-400 opacity-60" />
      </div>
      <div className="absolute top-40 right-16 animate-float" style={{ animationDelay: '-2s' }}>
        <Zap className="w-8 h-8 text-accent-400 opacity-40" />
      </div>
      <div className="absolute bottom-32 left-24 animate-float" style={{ animationDelay: '-4s' }}>
        <Sparkles className="w-5 h-5 text-primary-500 opacity-50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-8 sm:px-16 lg:px-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-16"
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-orbitron font-black leading-tight tracking-tighter"
          >
            <span className="block text-gradient">DIGITAL</span>
            <span className="block text-white">VISIONARY</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl sm:text-2xl lg:text-2xl text-slate-300 font-light max-w-text-content mx-auto leading-relaxed tracking-wide"
          >
            Crafting <span className="text-primary-400 font-medium">next-generation</span> digital experiences through{' '}
            <span className="text-accent-400 font-medium">cutting-edge technology</span>,{' '}
            innovative design, and artificial intelligence
          </motion.p>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {['3D Editor', 'Web Design', 'AI Solutions'].map((service, index) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass px-8 py-4 rounded-full neon-glow cursor-default"
              >
                <span className="text-white font-medium tracking-wide">{service}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="pt-16 flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={navigateToEditor}
              className="group relative inline-flex items-center space-x-4 glass-strong px-10 py-5 rounded-full neon-glow-accent transition-all duration-300"
            >
              <span className="text-white font-medium text-lg tracking-wide">Try 3D Editor</span>
              <ArrowDown className="w-5 h-5 text-accent-400 group-hover:translate-y-1 transition-transform duration-300" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={navigateToAbout}
              className="group relative inline-flex items-center space-x-4 glass px-10 py-5 rounded-full border border-white/20 hover:border-primary-400/50 transition-all duration-300"
            >
              <span className="text-white font-medium text-lg tracking-wide">Explore Projects</span>
              <Sparkles className="w-5 h-5 text-primary-400 group-hover:rotate-12 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;