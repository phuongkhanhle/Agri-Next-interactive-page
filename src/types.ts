export type GameType = 'farm_sim' | 'cao_bang_quiz' | 'market_basket';

export type AgeGroup = '16-22' | '23-30' | '31-45' | '45+';

export type RegionOption =
  | 'Cao Bằng'
  | 'Hà Nội'
  | 'TP. Hồ Chí Minh'
  | 'Các tỉnh miền núi phía Bắc'
  | 'Tỉnh/Thành khác';

export type InterestFocus =
  | 'Tiêu dùng nông sản sạch'
  | 'Khởi nghiệp nông nghiệp xanh'
  | 'Du lịch trải nghiệm Cao Bằng'
  | 'Học tập & Nghiên cứu khí hậu';

export type SustainabilityPersona =
  | 'eco_guardian'
  | 'market_builder'
  | 'community_weaver'
  | 'agri_innovator';

export interface PlayerProfile {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  region: RegionOption;
  interest: InterestFocus;
  avatarType: 'leaf' | 'grain';
  totalScore: number;
  bestFarmScore: number;
  bestQuizScore: number;
  bestMarketScore: number;
  gamesPlayed: number;
  avgAccuracy: number;
  persona: SustainabilityPersona | null;
  wtpPremium: number | null; // 0, 10, 20, 30 (%)
  favoriteSpecialty: string | null;
  buyingFactors: string[];
  preferredChannel: string | null;
  rankTitle: string;
  badges: string[];
  checkInCode: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface GameSessionRecord {
  id: string;
  playerId: string;
  playerName: string;
  region: RegionOption;
  gameType: GameType;
  score: number;
  maxScore: number;
  accuracy: number; // 0..100
  durationSec: number;
  metadata: {
    persona?: SustainabilityPersona;
    dilemmaChoices?: Array<{ dilemmaId: string; choiceId: string; tag: SustainabilityPersona }>;
    quizTopics?: Array<{ topic: string; correct: boolean }>;
    selectedProducts?: string[];
    wtpPremium?: number;
    buyingFactors?: string[];
    preferredChannel?: string;
    totalSpent?: number;
  };
  createdAt: string;
}

export interface BehaviorEventRecord {
  id: string;
  sessionId: string;
  playerId: string | null;
  eventType:
    | 'page_view'
    | 'crop_explored'
    | 'game_started'
    | 'game_completed'
    | 'insight_submitted'
    | 'social_clicked';
  target: string;
  durationMs: number;
  createdAt: string;
}

export interface CommunityInsightRecord {
  id: string;
  playerId: string | null;
  authorName: string;
  region: RegionOption;
  topic: 'Nông sản Cao Bằng' | 'Bootcamp Thanh niên' | 'Nông nghiệp Tái sinh' | 'Kênh phân phối';
  message: string;
  favoriteCrop: string;
  createdAt: string;
}

export interface LeaderboardEntry extends PlayerProfile {
  rank: number;
  displayScore: number;
}

export interface PublicInsightsSummary {
  totalPlayers: number;
  totalSessions: number;
  totalInsights: number;
  avgWtpPremium: number;
  topSpecialties: Array<{ name: string; count: number; share: number }>;
  personaBreakdown: Array<{ key: SustainabilityPersona; label: string; count: number; share: number }>;
  recentInsights: CommunityInsightRecord[];
}

export interface AdminDashboardData {
  kpis: {
    totalPlayers: number;
    totalSessions: number;
    avgScore: number;
    completionRate: number;
    avgWtpPremium: number;
    totalInsights: number;
  };
  funnel: Array<{ step: string; count: number; conversionPct: number }>;
  gameStats: Array<{
    gameType: GameType;
    label: string;
    plays: number;
    avgScore: number;
    avgAccuracy: number;
    avgDurationSec: number;
  }>;
  knowledgeGaps: Array<{
    topic: string;
    totalAnswered: number;
    correctRate: number;
  }>;
  buyingFactorStats: Array<{ factor: string; count: number }>;
  wtpDistribution: Array<{ tier: string; count: number }>;
  productDemand: Array<{ product: string; selections: number }>;
  channelStats: Array<{ channel: string; count: number }>;
  personaStats: Array<{ persona: string; count: number }>;
  regionStats: Array<{ region: string; players: number }>;
  players: PlayerProfile[];
  insights: CommunityInsightRecord[];
}
