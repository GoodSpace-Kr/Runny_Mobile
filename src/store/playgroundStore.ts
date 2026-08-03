import {create} from 'zustand';
import type {PlaygroundData} from '../types/domain';

interface PlaygroundState {
  data: PlaygroundData | null;
  setData: (data: PlaygroundData) => void;
  clear: () => void;
}

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  data: null,
  setData: (data) => set({data}),
  clear: () => set({data: null}),
}));
