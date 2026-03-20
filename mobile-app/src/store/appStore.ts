import { create } from 'zustand';

type AppState = {
  language: string;
  mobile: string;
  selectedPlan: 'Starter' | 'Standard' | 'Shield';
  platforms: string[];
  setLanguage: (language: string) => void;
  setMobile: (mobile: string) => void;
  setSelectedPlan: (plan: AppState['selectedPlan']) => void;
  togglePlatform: (platform: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  language: 'हिंदी',
  mobile: '',
  selectedPlan: 'Standard',
  platforms: [],
  setLanguage: (language) => set({ language }),
  setMobile: (mobile) => set({ mobile }),
  setSelectedPlan: (selectedPlan) => set({ selectedPlan }),
  togglePlatform: (platform) =>
    set((state) => ({
      platforms: state.platforms.includes(platform)
        ? state.platforms.filter((value) => value !== platform)
        : [...state.platforms, platform],
    })),
}));
