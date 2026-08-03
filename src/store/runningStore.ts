import {create} from 'zustand';
import type {SplitPace} from '../types/domain';

interface RunningState {
  isRunning: boolean;
  isPaused: boolean;

  clientRunId: string | null;
  startedAt: string | null;

  distanceKm: number;
  durationSec: number;
  longestNonstopSec: number;
  splitPaces: SplitPace[];

  startRun: (clientRunId: string) => void;
  pauseRun: () => void;
  resumeRun: () => void;
  updateStats: (patch: Partial<Pick<RunningState, 'distanceKm' | 'durationSec' | 'longestNonstopSec' | 'splitPaces'>>) => void;
  resetRun: () => void;
}

const initialStats = {
  distanceKm: 0,
  durationSec: 0,
  longestNonstopSec: 0,
  splitPaces: [] as SplitPace[],
};

export const useRunningStore = create<RunningState>((set) => ({
  isRunning: false,
  isPaused: false,
  clientRunId: null,
  startedAt: null,
  ...initialStats,

  startRun: (clientRunId) =>
    set({
      isRunning: true,
      isPaused: false,
      clientRunId,
      startedAt: new Date().toISOString(),
      ...initialStats,
    }),

  pauseRun: () => set({isPaused: true}),
  resumeRun: () => set({isPaused: false}),

  updateStats: (patch) => set((s) => ({...s, ...patch})),

  resetRun: () =>
    set({
      isRunning: false,
      isPaused: false,
      clientRunId: null,
      startedAt: null,
      ...initialStats,
    }),
}));
