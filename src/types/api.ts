/** 공통 API 응답 wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
}

/** 온보딩 상태 */
export type OnboardingStatus = 'PROFILE_REQUIRED' | 'DOG_REQUIRED' | 'COMPLETED';

/** 아이템 카테고리 */
export type ItemCategory = 'collar' | 'clothes' | 'hat' | 'shoes' | 'toy' | 'effect';

/** 아이템 가격대 */
export type ItemTier = 'CHEAP' | 'MID' | 'PREMIUM';

/** 친구 관계 상태 */
export type RelationStatus = 'NONE' | 'REQUESTED' | 'RECEIVED' | 'FRIEND';

/** 퀘스트 타입 */
export type QuestType = 'DAILY_FIXED' | 'DAILY_RANDOM' | 'WEEKLY';

/** 퀘스트 조건 타입 */
export type QuestConditionType = 'DISTANCE' | 'DURATION' | 'COUNT' | 'PACE';

/** 크루 역할 */
export type CrewRole = 'LEADER' | 'MEMBER';

/** 소셜 로그인 제공자 */
export type AuthProvider = 'EMAIL' | 'KAKAO' | 'APPLE';
