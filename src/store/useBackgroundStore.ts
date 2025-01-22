import { create } from 'zustand';

interface BackgroundState {
  matrixSeed: number;
  regenerateMatrix: () => void;
}

export const useBackgroundStore = create<BackgroundState>((set) => ({
  matrixSeed: Math.random(),
  regenerateMatrix: () => set({ matrixSeed: Math.random() })
}));