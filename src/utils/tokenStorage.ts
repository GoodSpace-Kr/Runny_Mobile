import EncryptedStorage from 'react-native-encrypted-storage';

const ACCESS_TOKEN_KEY = 'runny_access_token';
const REFRESH_TOKEN_KEY = 'runny_refresh_token';

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return EncryptedStorage.getItem(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return EncryptedStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      EncryptedStorage.setItem(ACCESS_TOKEN_KEY, accessToken),
      EncryptedStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      EncryptedStorage.removeItem(ACCESS_TOKEN_KEY),
      EncryptedStorage.removeItem(REFRESH_TOKEN_KEY),
    ]);
  },
};
