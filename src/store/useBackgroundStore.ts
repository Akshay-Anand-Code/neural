import { create } from 'zustand';

interface BackgroundState {
  regenerateMatrix: () => void;
}

export const useBackgroundStore = create<BackgroundState>(() => ({
  regenerateMatrix: () => {}
}));