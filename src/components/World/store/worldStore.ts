import { create } from "zustand";

export type WeatherType = 'clear' | 'rain' | 'snow' | 'midnight';

interface WorldState {
    score: number;
    stamina: number;
    weather: WeatherType;
    shrinesFound: number[];
    setWeather: (w: WeatherType) => void;
    addScore: (pts: number) => void;
    useStamina: (amount: number) => void;
    recoverStamina: (amount: number) => void;
    foundShrine: (id: number) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
    score: 0,
    stamina: 100,
    weather: 'clear',
    shrinesFound: [],
    setWeather: (w) => set({ weather: w }),
    addScore: (pts) => set((s) => ({ score: s.score + pts })),
    useStamina: (amt) => set((s) => ({ stamina: Math.max(0, s.stamina - amt) })),
    recoverStamina: (amt) => set((s) => ({ stamina: Math.min(100, s.stamina + amt) })),
    foundShrine: (id) => set((s) => ({ shrinesFound: s.shrinesFound.includes(id) ? s.shrinesFound : [...s.shrinesFound, id] })),
}));
