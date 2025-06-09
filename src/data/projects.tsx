import { ComponentType } from 'react';
import { DivideIcon as LucideIcon, Box, Palette, Brain, Code, Zap, Globe } from 'lucide-react';
import ThreeDEditor from '../components/ThreeDEditor';

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  previewImg: string;
  liveComponent?: ComponentType<any>;
  liveUrl?: string;
  sourceUrl?: string;
  icon: LucideIcon;
  category: string;
  tags: string[];
  featured: boolean;
}

export const allProjects: Project[] = [
  {
    id: 'enterprise-3d-editor',
    name: '3D Editor',
    shortDescription: 'Professional-grade 3D scene creation and manipulation platform with real-time rendering.',
    longDescription: 'A comprehensive 3D editor built with Three.js and React, featuring advanced material controls, real-time rendering, transform tools, scene hierarchy management, and enterprise-level features. Includes support for multiple object types, lighting systems, camera controls, and export capabilities.',
    previewImg: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=800',
    liveComponent: ThreeDEditor,
    icon: Box,
    category: 'Interactive Tools',
    tags: ['Three.js', 'React', 'WebGL', 'TypeScript', 'Real-time', 'Enterprise'],
    featured: true
  },
  {
    id: 'ai-design-studio',
    name: 'AI Design Studio',
    shortDescription: 'Next-generation design platform powered by artificial intelligence for automated layout generation.',
    longDescription: 'An innovative AI-powered design platform that revolutionizes the creative process through intelligent automation. Features include smart layout generation, color palette suggestions, typography optimization, and design pattern recognition. Built with cutting-edge machine learning algorithms to enhance designer productivity.',
    previewImg: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    liveUrl: '#',
    sourceUrl: 'https://github.com/visigence/ai-design-studio',
    icon: Brain,
    category: 'AI Solutions',
    tags: ['AI/ML', 'Design', 'Automation', 'React', 'Python', 'TensorFlow'],
    featured: true
  },
  {
    id: 'web-experience-platform',
    name: 'Web Platform',
    shortDescription: 'Cutting-edge web experience platform with advanced animations and performance optimization.',
    longDescription: 'A state-of-the-art web experience platform designed for maximum performance and user engagement. Features include advanced animation systems, responsive design patterns, performance optimization techniques, and accessibility compliance. Built with modern web technologies for scalable enterprise applications.',
    previewImg: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    liveUrl: 'https://platform.visigence.com',
    sourceUrl: 'https://github.com/visigence/web-platform',
    icon: Globe,
    category: 'Web Development',
    tags: ['React', 'Next.js', 'TypeScript', 'Performance', 'UX', 'Accessibility'],
    featured: true
  },
  {
    id: 'creative-toolkit',
    name: 'Creative Toolkit',
    shortDescription: 'Comprehensive creative toolkit with advanced color theory and design pattern libraries.',
    longDescription: 'A complete creative toolkit for designers and developers, featuring advanced color theory tools, typography systems, design pattern libraries, and component generators. Includes real-time collaboration features, version control, and integration with popular design tools.',
    previewImg: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
    liveUrl: 'https://toolkit.visigence.com',
    sourceUrl: 'https://github.com/visigence/creative-toolkit',
    icon: Palette,
    category: 'Design Tools',
    tags: ['Design Systems', 'UI/UX', 'Creative', 'Tools', 'Collaboration'],
    featured: true
  }
];

export const featuredProjects = allProjects.filter(project => project.featured);