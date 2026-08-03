// TODO: react-native-encrypted-storage 또는 @react-native-async-storage/async-storage 설치 후 교체
// 현재는 인메모리 임시 구현

let _accessToken: string | null = null;
let _refreshToken: string | null = null;

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return _accessToken;
  },

  async getRefreshToken(): Promise<string | null> {
    return _refreshToken;
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    _accessToken = accessToken;
    _refreshToken = refreshToken;
  },

  async clearTokens(): Promise<void> {
    _accessToken = null;
    _refreshToken = null;
  },
};
