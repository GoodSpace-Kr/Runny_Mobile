import {tokenStorage} from './tokenStorage';

const BASE_URL = 'http://localhost:8080/api'; // TODO: 환경변수로 분리

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await tokenStorage.getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? {Authorization: `Bearer ${token}`} : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {...options, headers});

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      throw new ApiError('AUTH_001', '로그인이 필요합니다.');
    }
    return request<T>(path, options);
  }

  const json = await res.json();

  if (!json.success) {
    throw new ApiError(json.error?.code ?? 'UNKNOWN', json.error?.message ?? '오류가 발생했습니다.');
  }

  return json.data as T;
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) return false;

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({refreshToken}),
    });

    const json = await res.json();
    if (!json.success) return false;

    await tokenStorage.setTokens(json.data.accessToken, json.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, {method: 'GET'}),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {method: 'POST', body: body ? JSON.stringify(body) : undefined}),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {method: 'PATCH', body: body ? JSON.stringify(body) : undefined}),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {method: 'PUT', body: body ? JSON.stringify(body) : undefined}),
  delete: <T>(path: string) => request<T>(path, {method: 'DELETE'}),
};
