import {apiClient} from '../utils/apiClient';
import type {UserQuest} from '../types/domain';

interface TodayQuests {
  daily: UserQuest[];
  weekly: UserQuest[];
}

export const questApi = {
  getTodayQuests: () => apiClient.get<TodayQuests>('/quests/today'),

  claimQuest: (userQuestId: number) =>
    apiClient.post<{rewardExp: number; rewardCoin: number}>(`/quests/${userQuestId}/claim`),

  sendDecorateEnterEvent: () =>
    apiClient.post('/quests/events/decorate-enter'),

  sendDecorateEvent: () =>
    apiClient.post('/quests/events/decorate'),
};
