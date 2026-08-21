import {create} from 'zustand';
import type {OnboardingStatus, AuthProvider} from '../types/api';
import {tokenStorage} from '../utils/tokenStorage';

interface AuthState {
  isAuthenticated: boolean;
  /** 앱 시작 시 저장된 토큰 존재 여부 확인이 끝났는지 (스플래시/라우팅 분기용) */
  isHydrated: boolean;
  onboardingStatus: OnboardingStatus | null;
  provider: AuthProvider | null;

  /** 앱 시작 시 1회 호출: 저장된 토큰 유무만 확인해 isAuthenticated를 복원한다. */
  hydrate: () => Promise<void>;

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
  isHydrated: false,
  onboardingStatus: null,
  provider: null,

  hydrate: async () => {
    const token = await tokenStorage.getAccessToken();
    set({isAuthenticated: !!token, isHydrated: true});
  },

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
