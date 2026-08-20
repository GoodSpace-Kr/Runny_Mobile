import { apiClient } from '../utils/apiClient';
import type { AuthProvider } from '../types/api';
import type { AuthResult, Terms, VerifyCodeResult } from '../types/domain';

export interface SocialLoginResult {
  isNewUser: boolean;
  onboardingStatus: OnboardingStatusOrNull;
  provider: AuthProvider;
  accessToken: string | null;
  refreshToken: string | null;
}

type OnboardingStatusOrNull = AuthResult['onboardingStatus'] | null;

export const authApi = {
  /** 가입용 이메일 인증코드 발송 */
  sendEmailCode: (email: string) =>
    apiClient.post<string>('/auth/email/send-code', { email }),

  /** 가입용 인증코드 검증. 불일치 AUTH_005, 만료 AUTH_006 */
  verifyEmailCode: (email: string, code: string) =>
    apiClient.post<VerifyCodeResult>('/auth/email/verify-code', {
      email,
      code,
    }),

  /** 이메일 가입. 인증 완료 상태 필요, 필수 약관 3종 동의, 비밀번호 8자+영문/숫자/특수문자 */
  signup: (params: {
    email: string;
    password: string;
    passwordConfirm: string;
    terms: Terms;
  }) => apiClient.post<AuthResult>('/auth/signup', params),

  /** 이메일 로그인. 자격 불일치 시 AUTH_012 단일 응답 */
  login: (email: string, password: string) =>
    apiClient.post<AuthResult>('/auth/login', { email, password }),

  /** 소셜 로그인/가입 통합 */
  socialLogin: (
    provider: Exclude<AuthProvider, 'EMAIL'>,
    token: string,
    terms?: Terms,
  ) =>
    apiClient.post<SocialLoginResult>('/auth/social/login', {
      provider,
      token,
      terms,
    }),

  /** refresh 토큰 검증 후 access/refresh 회전 발급 */
  refresh: (refreshToken: string) =>
    apiClient.post<AuthResult>('/auth/refresh', { refreshToken }),

  /** 서버 refresh 토큰 무효화. Authorization 헤더의 access 토큰 필요 */
  logout: () => apiClient.post<string>('/auth/logout'),

  /** 비밀번호 찾기 1단계 - 코드 발송. 자체 가입(EMAIL) 유저만 가능, 소셜 유저는 USER_008 */
  sendPasswordCode: (email: string) =>
    apiClient.post<string>('/auth/password/send-code', { email }),

  /** 비밀번호 찾기 2단계 - 코드 검증. 성공 시 resetToken 반환 (10분 유효) */
  verifyPasswordCode: (email: string, code: string) =>
    apiClient.post<VerifyCodeResult>('/auth/password/verify-code', {
      email,
      code,
    }),

  /** 비밀번호 찾기 3단계 - 재설정. resetToken 검증 후 새 비밀번호 저장, 기존 refresh 무효화 */
  resetPassword: (params: {
    email: string;
    resetToken: string;
    newPassword: string;
    newPasswordConfirm: string;
  }) => apiClient.post<string>('/auth/password/reset', params),

  checkNickname: (nickname: string) =>
    apiClient.get<{ available: boolean }>(
      `/users/nickname/check?nickname=${encodeURIComponent(nickname)}`,
    ),
};
