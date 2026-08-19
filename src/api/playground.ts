import {apiClient} from '../utils/apiClient';
import type {PlaygroundData} from '../types/domain';

export const playgroundApi = {
  getPlayground: () => apiClient.get<PlaygroundData>('/playground'),

  updateInvites: (friendUserIds: number[]) =>
    apiClient.put('/playground/invites', {friendUserIds}),
};
