import {apiClient} from '../utils/apiClient';
import type {AuthProvider, OnboardingStatus} from '../types/api';
import type {TokenPair} from '../types/domain';

export interface LoginResult extends TokenPair {
  onboardingStatus: OnboardingStatus;
}

export interface SocialLoginResult {
  isNewUser: boolean;
  onboardingStatus: OnboardingStatus;
  accessToken: string | null;
  refreshToken: string | null;
}

export const authApi = {
  sendEmailCode: (email: string) =>
    apiClient.post('/auth/email/send-code', {email}),

  verifyEmailCode: (email: string, code: string) =>
    apiClient.post('/auth/email/verify-code', {email, code}),

  signup: (params: {email: string; password: string; nickname: string; agreedTerms: boolean}) =>
    apiClient.post<LoginResult>('/auth/signup', params),

  login: (email: string, password: string) =>
    apiClient.post<LoginResult>('/auth/login', {email, password}),

  socialLogin: (provider: Exclude<AuthProvider, 'EMAIL'>, token: string, agreedTerms?: boolean) =>
    apiClient.post<SocialLoginResult>('/auth/social/login', {provider, token, agreedTerms}),

  refresh: (refreshToken: string) =>
    apiClient.post<TokenPair>('/auth/refresh', {refreshToken}),

  logout: () => apiClient.post('/auth/logout'),

  sendPasswordCode: (email: string) =>
    apiClient.post('/auth/password/send-code', {email}),

  verifyPasswordCode: (email: string, code: string) =>
    apiClient.post('/auth/password/verify-code', {email, code}),

  resetPassword: (email: string, newPassword: string) =>
    apiClient.post('/auth/password/reset', {email, newPassword}),

  checkNickname: (nickname: string) =>
    apiClient.get<{available: boolean}>(`/users/nickname/check?nickname=${encodeURIComponent(nickname)}`),
};
