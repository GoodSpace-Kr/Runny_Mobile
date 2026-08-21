export const Routes = {
  // Auth
  Start: 'Start',
  Login: 'Login',
  Signup: 'Signup',
  EmailVerify: 'EmailVerify',
  PasswordReset: 'PasswordReset',

  // Onboarding
  Terms: 'Terms',
  ProfileSetup: 'ProfileSetup',
  DogSelect: 'DogSelect',

  // Main Tab
  Playground: 'Playground',
  Running: 'Running',
  Crew: 'Crew',
  Quest: 'Quest',
  Settings: 'Settings',

  // Playground
  FriendList: 'FriendList',
  FriendSearch: 'FriendSearch',
  FriendDetail: 'FriendDetail',
  DogProfile: 'DogProfile',

  // Running
  RunningActive: 'RunningActive',
  RunningReport: 'RunningReport',
  RunningHistory: 'RunningHistory',

  // Dressroom & Shop
  Dressroom: 'Dressroom',
  Shop: 'Shop',

  // Crew
  CrewMain: 'CrewMain',
  CrewSearch: 'CrewSearch',
  CrewDetail: 'CrewDetail',
  CrewCreate: 'CrewCreate',

  // Quest & Achievement
  QuestList: 'QuestList',
  AchievementList: 'AchievementList',

  // Settings
  SettingsMain: 'SettingsMain',
  NotificationSettings: 'NotificationSettings',
  NotificationList: 'NotificationList',
  CoinHistory: 'CoinHistory',
  ProfileEdit: 'ProfileEdit',
} as const;

export type RouteName = (typeof Routes)[keyof typeof Routes];
