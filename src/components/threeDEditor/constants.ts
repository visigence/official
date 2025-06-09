import { CameraPreset } from './types';

export const cameraPresets: CameraPreset[] = [
  { name: 'Default', position: [5, 5, 5], target: [0, 0, 0] },
  { name: 'Top', position: [0, 10, 0], target: [0, 0, 0] },
  { name: 'Front', position: [0, 0, 10], target: [0, 0, 0] },
  { name: 'Side', position: [10, 0, 0], target: [0, 0, 0] },
  { name: 'Isometric', position: [7, 7, 7], target: [0, 0, 0] },
];