import type {
  ItemCategory,
  ItemTier,
  RelationStatus,
  QuestType,
  QuestConditionType,
  CrewRole,
  AuthProvider,
  OnboardingStatus,
} from './api';

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult extends TokenPair {
  onboardingStatus: OnboardingStatus;
  isNewUser?: boolean;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  userId: number;
  nickname: string;
  email: string;
  provider: AuthProvider;
}

// ─── Dog ─────────────────────────────────────────────────────────────────────

export interface Breed {
  breedId: number;
  name: string;
  modelUrl: string;
  achievementLocked: boolean;
  unlocked: boolean;
}

export interface EquippedItem {
  category: ItemCategory;
  itemId: number;
  modelUrl: string;
}

export interface Dog {
  dogId: number;
  name: string;
  breedName: string;
  level: number;
  breedModelUrl: string;
  equippedItems: EquippedItem[];
}

// ─── Playground ──────────────────────────────────────────────────────────────

export interface PlaygroundData {
  me: {
    userId: number;
    nickname: string;
    dog: Dog;
  };
  invitedFriends: Friend[];
  coin: number;
  hasDogProfileBadge: boolean;
}

// ─── Friend ──────────────────────────────────────────────────────────────────

export interface Friend {
  userId: number;
  nickname: string;
  dog: Dog;
  relationStatus: RelationStatus;
}

// ─── Item / Dressroom / Shop ──────────────────────────────────────────────────

export interface Item {
  itemId: number;
  name: string;
  category: ItemCategory;
  modelUrl: string;
  tier: ItemTier;
  price: number;
  owned: boolean;
}

export interface Equipment {
  collar: EquippedItem | null;
  clothes: EquippedItem | null;
  hat: EquippedItem | null;
  shoes: EquippedItem | null;
  toy: EquippedItem | null;
  effect: EquippedItem | null;
}

// ─── Quest ───────────────────────────────────────────────────────────────────

export interface UserQuest {
  userQuestId: number;
  type: QuestType;
  conditionType: QuestConditionType;
  title: string;
  targetValue: number;
  progress: number;
  rewardExp: number;
  rewardCoin: number;
  completed: boolean;
  claimed: boolean;
}

// ─── Achievement ─────────────────────────────────────────────────────────────

export interface Achievement {
  achievementId: number;
  code: string;
  title: string;
  description: string;
  imageUrl: string;
  achieved: boolean;
  claimed: boolean;
}

// ─── Running ─────────────────────────────────────────────────────────────────

export interface SplitPace {
  km: number;
  paceSec: number;
}

export interface RunningRecord {
  recordId: number;
  distanceKm: number;
  durationSec: number;
  avgPaceSec: number;
  startedAt: string;
  endedAt: string;
  routeImageUrl: string;
}

// ─── Crew ─────────────────────────────────────────────────────────────────────

export interface Crew {
  crewId: number;
  name: string;
  intro: string;
  imageUrl: string;
  memberCount: number;
  capacity: number;
  role: CrewRole;
  pendingRequestCount: number;
}
