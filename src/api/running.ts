import {apiClient} from '../utils/apiClient';
import type {RunningRecord, SplitPace} from '../types/domain';
import type {Achievement, UserQuest} from '../types/domain';

export interface CompleteRunningRequest {
  clientRunId: string;
  distanceKm: number;
  durationSec: number;
  avgPaceSec: number;
  cadence: number;
  avgHeartRate: number | null;
  longestNonstopSec: number;
  splitPaces: SplitPace[];
  elevationM: number;
  routeImageUrl: string;
  routeLineImageUrl: string;
  startedAt: string;
  endedAt: string;
  visitedLandmarkIds: number[];
  newRoute: boolean;
  steadyPaceKm: number;
}

export interface CompleteRunningResponse {
  discarded: boolean;
  idempotent: boolean;
  report: RunningRecord | null;
  statDelta: Record<string, number>;
  completedQuests: UserQuest[];
  achievedAchievements: Achievement[];
}

export const runningApi = {
  startRunning: () => apiClient.post<{runningId: number}>('/runnings/start'),

  completeRunning: (body: CompleteRunningRequest) =>
    apiClient.post<CompleteRunningResponse>('/runnings/complete', body),

  getReport: (recordId: number) =>
    apiClient.get<RunningRecord>(`/runnings/${recordId}/report`),

  getHistory: (year: number, month: number) =>
    apiClient.get<RunningRecord[]>(`/runnings/history?year=${year}&month=${month}`),

  getUncheckedExists: () =>
    apiClient.get<{exists: boolean}>('/runnings/unchecked-exists'),

  uploadRouteImage: async (imageUri: string): Promise<string> => {
    const formData = new FormData();
    formData.append('image', {uri: imageUri, name: 'route.png', type: 'image/png'} as never);
    // TODO: multipart 업로드 구현
    throw new Error('Not implemented');
  },
};
