import {create} from 'zustand';
import type {OnboardingStatus, AuthProvider} from '../types/api';
import {tokenStorage} from '../utils/tokenStorage';

interface AuthState {
  isAuthenticated: boolean;
  onboardingStatus: OnboardingStatus | null;
  provider: AuthProvider | null;

  setAuth: (params: {
    accessToken: string;
    refreshToken: string;
    onboardingStatus: OnboardingStatus;
    provider?: AuthProvider;
  }) => Promise<void>;

  setOnboardingStatus: (status: OnboardingStatus) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  onboardingStatus: null,
  provider: null,

  setAuth: async ({accessToken, refreshToken, onboardingStatus, provider}) => {
    await tokenStorage.setTokens(accessToken, refreshToken);
    set({isAuthenticated: true, onboardingStatus, provider: provider ?? null});
  },

  setOnboardingStatus: (status) => set({onboardingStatus: status}),

  logout: async () => {
    await tokenStorage.clearTokens();
    set({isAuthenticated: false, onboardingStatus: null, provider: null});
  },
}));
