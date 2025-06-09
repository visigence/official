import React, { Suspense, useRef, useState, useMemo, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Text, 
  OrbitControls, 
  Environment, 
  Html,
  useTexture,
  Plane,
  RoundedBox,
  MeshTransmissionMaterial
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Vector3, Color, DoubleSide } from 'three';
import { X, ExternalLink, Github } from 'lucide-react';
import { featuredProjects, Project } from '../data/projects';

// Memoized 3D Project Card Component for performance
const ProjectCard3D = memo<{
  project: Project;
  position: [number, number, number];
  index: number;
  onSelect: (project: Project) => void;
  isSelected: boolean;
}>(({ project, position, index, onSelect, isSelected }) => {
  const meshRef = useRef<any>();
  const [hovered, setHovered] = useState(false);
  
  // Load project image as texture with optimized settings
  const texture = useTexture(project.image, (texture) => {
    // Optimize texture for maximum performance
    texture.generateMipmaps = false;
    texture.minFilter = 1006; // LinearFilter
    texture.magFilter = 1006; // LinearFilter
    texture.flipY = false; // Prevent unnecessary texture flipping
  });
  
  // Static positioning without floating animation for Unity-style precision
  useFrame((state) => {
    if (meshRef.current) {
      // Static positioning - no floating animation
      meshRef.current.position.set(position[0], position[1], position[2]);
      
      // Optimized hover effects with lerp for smooth transitions
      const targetScale = hovered ? 1.05 : 1;
      meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.1);
      
      // Subtle hover rotation for interactivity feedback
      if (hovered) {
        const time = state.clock.elapsedTime;
        meshRef.current.rotation.y = Math.sin(time * 2) * 0.02;
      } else {
        meshRef.current.rotation.y = 0;
      }
      
      // Efficient selection glow
      if (isSelected) {
        meshRef.current.material.emissive.setHex(0x4dafff);
        meshRef.current.material.emissiveIntensity = 0.2;
      } else {
        meshRef.current.material.emissive.setHex(0x000000);
        meshRef.current.material.emissiveIntensity = 0;
      }
    }
  });

  return (
    <group position={position}>
      {/* Optimized glass frame with reduced samples */}
      <RoundedBox
        ref={meshRef}
        args={[3, 4, 0.1]}
        radius={0.1}
        smoothness={4}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => onSelect(project)}
      >
        <MeshTransmissionMaterial
          backside
          samples={4} // Reduced from 8 for better performance
          resolution={128} // Reduced from 256 for better performance
          transmission={0.85}
          roughness={0.15}
          thickness={0.3}
          ior={1.4}
          chromaticAberration={0.05}
          anisotropy={0.2}
          distortion={0.05}
          distortionScale={0.05}
          temporalDistortion={0.05}
          color={new Color(0.1, 0.1, 0.3)}
        />
      </RoundedBox>
      
      {/* Optimized project image */}
      <Plane args={[2.5, 3]} position={[0, 0.2, 0.06]}>
        <meshStandardMaterial 
          map={texture} 
          transparent 
          opacity={0.9}
          side={DoubleSide}
        />
      </Plane>
      
      {/* Optimized text rendering */}
      <Text
        position={[0, -1.5, 0.1]}
        fontSize={0.18}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
        font="/fonts/orbitron-bold.woff"
        characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?. "
      >
        {project.title}
      </Text>
      
      {/* Category badge */}
      <Text
        position={[0, -1.8, 0.1]}
        fontSize={0.1}
        color="#4dafff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
        font="/fonts/orbitron-bold.woff"
      >
        {project.category}
      </Text>
      
      {/* Optimized neon glow effect */}
      <Plane args={[3.2, 4.2]} position={[0, 0, -0.05]}>
        <meshBasicMaterial 
          color={hovered ? "#4dafff" : "#7855ff"} 
          transparent 
          opacity={hovered ? 0.2 : 0.08}
          side={DoubleSide}
        />
      </Plane>
    </group>
  );
});

// Memoized Gallery Layout Component
const Gallery3D = memo<{
  projects: Project[];
  onSelectProject: (project: Project) => void;
  selectedProject: Project | null;
}>(({ projects, onSelectProject, selectedProject }) => {
  const { viewport } = useThree();
  
  // Memoized positions calculation for optimal performance
  const positions = useMemo(() => {
    const cols = viewport.width > 8 ? 3 : 2;
    const spacing = 4;
    const positions: [number, number, number][] = [];
    
    projects.forEach((_, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = (col - (cols - 1) / 2) * spacing;
      const y = -row * spacing;
      const z = 0;
      positions.push([x, y, z]);
    });
    
    return positions;
  }, [projects, viewport.width]);

  return (
    <>
      {projects.map((project, index) => (
        <ProjectCard3D
          key={project.id}
          project={project}
          position={positions[index]}
          index={index}
          onSelect={onSelectProject}
          isSelected={selectedProject?.id === project.id}
        />
      ))}
    </>
  );
});

// Simplified Environment for Unity-style viewer
const CyberpunkEnvironment = memo(() => {
  // Reduced particle count for better performance - static positioning
  const particlePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 20; i++) { // Reduced from 40
      positions.push([
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 50,
      ]);
    }
    return positions;
  }, []);

  return (
    <>
      {/* Optimized environment lighting */}
      <Environment preset="night" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#4dafff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#7855ff" />
      <pointLight position={[0, 5, 0]} intensity={0.6} color="#a259fa" />
      
      {/* Static particles - no floating animation for Unity-style precision */}
      <group>
        {particlePositions.map((position, index) => (
          <mesh key={index} position={position as [number, number, number]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial 
              color={index % 3 === 0 ? "#4dafff" : index % 3 === 1 ? "#7855ff" : "#a259fa"} 
              transparent 
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
      
      {/* Optimized atmospheric fog planes */}
      <Plane args={[100, 100]} position={[0, 0, -20]} rotation={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#1a0066" 
          transparent 
          opacity={0.1}
          side={DoubleSide}
        />
      </Plane>
      
      <Plane args={[80, 80]} position={[0, 0, -15]} rotation={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#7855ff" 
          transparent 
          opacity={0.05}
          side={DoubleSide}
        />
      </Plane>
    </>
  );
});

// Optimized Loading Component
const LoadingScreen = memo(() => (
  <Html center>
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-3 border-primary-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-white font-orbitron tracking-wide text-sm">Loading 3D Gallery...</p>
    </div>
  </Html>
));

// Main 3D Portfolio Component optimized for Unity-style viewer behavior
const ThreeDPortfolio: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section id="portfolio" className="relative h-screen overflow-hidden">
      {/* Unity-style 3D Canvas with continuous rendering */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ 
          antialias: true, // Enabled for crisp visuals
          alpha: false, // Disabled for better performance
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]} // Optimized pixel ratio
        className="bg-black" // Solid black background for professional viewer
        frameloop="always" // Continuous rendering for responsive interaction
      >
        <Suspense fallback={<LoadingScreen />}>
          {/* Environment and lighting */}
          <CyberpunkEnvironment />
          
          {/* Gallery */}
          <Gallery3D
            projects={featuredProjects}
            onSelectProject={handleSelectProject}
            selectedProject={selectedProject}
          />
          
          {/* Unity-style camera controls - dominant interaction handler */}
          <OrbitControls
            makeDefault={true} // Make this the primary interaction handler
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            target={[0, 0, 0]} // Focus on scene center
            maxDistance={50} // Extended range for better exploration
            minDistance={1} // Close inspection capability
            maxPolarAngle={Math.PI} // Full rotation freedom
            enableDamping={true}
            dampingFactor={0.1} // Improved responsiveness
          />
          
          {/* Post-processing effects disabled for raw performance */}
          {/* 
          <EffectComposer>
            <Bloom intensity={0.15} luminanceThreshold={0.95} luminanceSmoothing={0.9} height={128} />
            <ChromaticAberration offset={[0.0002, 0.0002]} />
          </EffectComposer>
          */}
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-auto"
        >
          <h2 className="text-4xl lg:text-6xl font-orbitron font-black text-gradient mb-4 leading-tight tracking-tighter">
            3D PORTFOLIO
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed tracking-wide">
            Navigate through a professional 3D gallery of digital experiences
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-auto"
        >
          <div className="glass-strong px-6 py-3 rounded-full">
            <p className="text-sm text-slate-300 tracking-wide">
              Drag to rotate • Scroll to zoom • Click cards for details
            </p>
          </div>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto glass-strong rounded-2xl neon-glow-accent"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 z-10 p-3 glass rounded-lg neon-glow hover:neon-glow-accent transition-all duration-300"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Modal Content */}
              <div className="p-8 lg:p-10">
                {/* Optimized image with lazy loading */}
                <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden mb-8">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Header */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center justify-between flex-wrap gap-6">
                    <h2 className="text-3xl lg:text-4xl font-orbitron font-bold text-gradient tracking-tighter">
                      {selectedProject.title}
                    </h2>
                    <span className="glass px-6 py-3 rounded-full text-primary-400 font-medium tracking-wide">
                      {selectedProject.category}
                    </span>
                  </div>
                  
                  <p className="text-slate-300 text-lg leading-relaxed tracking-wide">
                    {selectedProject.longDescription}
                  </p>
                </div>

                {/* Tags */}
                <div className="mb-8">
                  <h3 className="text-lg font-orbitron font-bold text-white mb-4 tracking-tight">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 glass rounded-full text-sm text-white border border-primary-400/30 tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-6">
                  {selectedProject.liveUrl && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 glass-strong px-8 py-4 rounded-full neon-glow-accent hover:neon-glow transition-all duration-300"
                    >
                      <ExternalLink className="w-5 h-5 text-accent-400" />
                      <span className="text-white font-medium tracking-wide">View Live</span>
                    </motion.a>
                  )}
                  
                  {selectedProject.sourceUrl && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={selectedProject.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 glass px-8 py-4 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
                    >
                      <Github className="w-5 h-5 text-slate-300" />
                      <span className="text-white font-medium tracking-wide">View Code</span>
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ThreeDPortfolio;