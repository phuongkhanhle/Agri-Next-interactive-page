import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import type {
  AdminDashboardData,
  AgeGroup,
  BehaviorEventRecord,
  CommunityInsightRecord,
  GameSessionRecord,
  GameType,
  GiftClaimRecord,
  GiftStatus,
  InterestFocus,
  LeaderboardEntry,
  PlayerProfile,
  PublicInsightsSummary,
  RegionOption,
  SustainabilityPersona,
} from './src/types.ts';
import {
  STICKER_PASS_SCORE,
  STICKER_QUESTIONS,
  STICKER_QUIZ_LENGTH,
} from './src/data/projectShowcase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'agrinext-db.json');

interface DatabaseSchema {
  players: PlayerProfile[];
  sessions: GameSessionRecord[];
  events: BehaviorEventRecord[];
  insights: CommunityInsightRecord[];
  gifts: GiftClaimRecord[];
  giftTotal?: number;
  adminCredentialHash?: string | null;
}

const DEFAULT_GIFT_TOTAL = Math.max(0, Math.min(1000, Number(process.env.GIFT_TOTAL) || 30));

const ADMIN_TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
const adminSessions = new Map<string, number>();
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getEnvAdminPasscode(): string {
  return (process.env.ADMIN_PASSCODE || '').trim();
}

function hashAdminPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyScryptPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, expectedHex] = parts;
  if (!salt || !expectedHex) return false;
  const expectedBuf = Buffer.from(expectedHex, 'hex');
  const derivedBuf = crypto.scryptSync(password, salt, expectedBuf.length);
  if (derivedBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(derivedBuf, expectedBuf);
}

function verifyPlaintextConstantTime(candidate: string, expected: string): boolean {
  const a = crypto.createHash('sha256').update(candidate).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

function issueAdminToken(): string {
  const now = Date.now();
  for (const [tok, exp] of adminSessions.entries()) {
    if (exp <= now) adminSessions.delete(tok);
  }
  const token = crypto.randomBytes(32).toString('hex');
  adminSessions.set(token, now + ADMIN_TOKEN_TTL_MS);
  return token;
}

function extractBearerToken(req: express.Request): string | null {
  const header = req.headers.authorization;
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  return token || null;
}

function requireAdminAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const token = extractBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị viên.' });
    return;
  }
  const exp = adminSessions.get(token);
  if (!exp || exp <= Date.now()) {
    if (exp) adminSessions.delete(token);
    res.status(401).json({ error: 'Phiên đăng nhập quản trị đã hết hạn.' });
    return;
  }
  next();
}

const VALID_AGE_GROUPS: AgeGroup[] = ['16-22', '23-30', '31-45', '45+'];
const VALID_REGIONS: RegionOption[] = [
  'Cao Bằng',
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Các tỉnh miền núi phía Bắc',
  'Tỉnh/Thành khác',
];
const VALID_INTERESTS: InterestFocus[] = [
  'Tiêu dùng nông sản sạch',
  'Khởi nghiệp nông nghiệp xanh',
  'Du lịch trải nghiệm Cao Bằng',
  'Học tập & Nghiên cứu khí hậu',
];
const VALID_GAME_TYPES: GameType[] = ['farm_sim', 'cao_bang_quiz', 'market_basket'];
const VALID_PERSONAS: SustainabilityPersona[] = [
  'eco_guardian',
  'market_builder',
  'community_weaver',
  'agri_innovator',
];

const PERSONA_NAMES: Record<SustainabilityPersona, string> = {
  eco_guardian: 'Người Gìn Giữ Hệ Sinh Thái',
  market_builder: 'Kiến Trúc Sư Chuỗi Giá Trị',
  community_weaver: 'Người Kết Nối Cộng Đồng Trẻ',
  agri_innovator: 'Nhà Tiên Phong Nông Nghiệp Số',
};

function computeRankTitle(totalScore: number): string {
  if (totalScore >= 1400) return 'Thủ Lĩnh Nông Nghiệp Xanh';
  if (totalScore >= 950) return 'Đại Sứ Non Nước Cao Bằng';
  if (totalScore >= 550) return 'Người Gieo Hạt Tái Sinh';
  return 'Mầm Xanh Khám Phá';
}

function generateCheckInCode(): string {
  return `AGRI-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
}

function computeBadges(p: Pick<PlayerProfile, 'bestFarmScore' | 'bestQuizScore' | 'bestMarketScore'>): string[] {
  const list: string[] = [];
  if (p.bestFarmScore > 0) list.push('badge_farm_sim');
  if (p.bestQuizScore > 0) list.push('badge_quiz');
  if (p.bestMarketScore > 0) list.push('badge_market');
  if (list.length === 3) list.push('badge_master');
  return list;
}

function hydratePlayer(raw: Partial<PlayerProfile> & { id: string; name: string }): PlayerProfile {
  const bestFarmScore = Number(raw.bestFarmScore) || 0;
  const bestQuizScore = Number(raw.bestQuizScore) || 0;
  const bestMarketScore = Number(raw.bestMarketScore) || 0;
  return {
    id: raw.id,
    name: raw.name,
    ageGroup: raw.ageGroup ?? '16-22',
    region: raw.region ?? 'Hà Nội',
    interest: raw.interest ?? 'Tiêu dùng nông sản sạch',
    avatarType: raw.avatarType === 'grain' ? 'grain' : 'leaf',
    totalScore: Number(raw.totalScore) || 0,
    bestFarmScore,
    bestQuizScore,
    bestMarketScore,
    gamesPlayed: Number(raw.gamesPlayed) || 0,
    avgAccuracy: Number(raw.avgAccuracy) || 0,
    persona: raw.persona ?? null,
    wtpPremium: typeof raw.wtpPremium === 'number' ? raw.wtpPremium : null,
    favoriteSpecialty: raw.favoriteSpecialty ?? null,
    buyingFactors: Array.isArray(raw.buyingFactors) ? raw.buyingFactors : [],
    preferredChannel: raw.preferredChannel ?? null,
    rankTitle: raw.rankTitle || computeRankTitle(Number(raw.totalScore) || 0),
    badges:
      Array.isArray(raw.badges) && raw.badges.length > 0
        ? raw.badges
        : computeBadges({ bestFarmScore, bestQuizScore, bestMarketScore }),
    checkInCode: raw.checkInCode || generateCheckInCode(),
    createdAt: raw.createdAt || new Date().toISOString(),
    lastActiveAt: raw.lastActiveAt || new Date().toISOString(),
  };
}

function sanitizeText(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLen);
}

function createInitialSeedData(): DatabaseSchema {
  const now = Date.now();
  const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString();

  const rawSeedPlayers: Array<Omit<PlayerProfile, 'badges' | 'checkInCode'>> = [
    {
      id: 'pl-linh-cb',
      name: 'Nông Khánh Linh',
      ageGroup: '16-22',
      region: 'Cao Bằng',
      interest: 'Khởi nghiệp nông nghiệp xanh',
      avatarType: 'leaf',
      totalScore: 1585,
      bestFarmScore: 620,
      bestQuizScore: 715,
      bestMarketScore: 250,
      gamesPlayed: 5,
      avgAccuracy: 94,
      persona: 'community_weaver',
      wtpPremium: 20,
      favoriteSpecialty: 'Hạt dẻ Trùng Khánh',
      buyingFactors: [
        'Ủng hộ sinh kế thanh niên & đồng bào vùng cao',
        'Canh tác hữu cơ, bảo vệ đất & khí hậu',
      ],
      preferredChannel: 'TikTok / Video ngắn kể chuyện nông dân',
      rankTitle: 'Thủ Lĩnh Nông Nghiệp Xanh',
      createdAt: hoursAgo(96),
      lastActiveAt: hoursAgo(3),
    },
    {
      id: 'pl-minh-hn',
      name: 'Trần Nhật Minh',
      ageGroup: '23-30',
      region: 'Hà Nội',
      interest: 'Tiêu dùng nông sản sạch',
      avatarType: 'grain',
      totalScore: 1490,
      bestFarmScore: 590,
      bestQuizScore: 650,
      bestMarketScore: 250,
      gamesPlayed: 4,
      avgAccuracy: 88,
      persona: 'eco_guardian',
      wtpPremium: 20,
      favoriteSpecialty: 'Miến dong Phia Đén',
      buyingFactors: [
        'Nguồn gốc minh bạch (QR / Chỉ dẫn địa lý)',
        'Canh tác hữu cơ, bảo vệ đất & khí hậu',
      ],
      preferredChannel: 'Website chính thức của Agri-Next',
      rankTitle: 'Thủ Lĩnh Nông Nghiệp Xanh',
      createdAt: hoursAgo(84),
      lastActiveAt: hoursAgo(5),
    },
    {
      id: 'pl-thao-hcm',
      name: 'Lê Phương Thảo',
      ageGroup: '23-30',
      region: 'TP. Hồ Chí Minh',
      interest: 'Du lịch trải nghiệm Cao Bằng',
      avatarType: 'leaf',
      totalScore: 1410,
      bestFarmScore: 560,
      bestQuizScore: 600,
      bestMarketScore: 250,
      gamesPlayed: 3,
      avgAccuracy: 86,
      persona: 'agri_innovator',
      wtpPremium: 30,
      favoriteSpecialty: 'Hạt dẻ Trùng Khánh',
      buyingFactors: [
        'Bao bì xanh, đẹp để làm quà tặng',
        'Nguồn gốc minh bạch (QR / Chỉ dẫn địa lý)',
      ],
      preferredChannel: 'Facebook / Instagram cộng đồng xanh',
      rankTitle: 'Thủ Lĩnh Nông Nghiệp Xanh',
      createdAt: hoursAgo(72),
      lastActiveAt: hoursAgo(7),
    },
    {
      id: 'pl-hung-cb',
      name: 'Hoàng Văn Hùng',
      ageGroup: '16-22',
      region: 'Cao Bằng',
      interest: 'Khởi nghiệp nông nghiệp xanh',
      avatarType: 'grain',
      totalScore: 1295,
      bestFarmScore: 545,
      bestQuizScore: 500,
      bestMarketScore: 250,
      gamesPlayed: 4,
      avgAccuracy: 79,
      persona: 'agri_innovator',
      wtpPremium: 10,
      favoriteSpecialty: 'Thạch đen Đông Khê',
      buyingFactors: [
        'Ủng hộ sinh kế thanh niên & đồng bào vùng cao',
        'Hương vị đặc sản bản địa độc đáo',
      ],
      preferredChannel: 'TikTok / Video ngắn kể chuyện nông dân',
      rankTitle: 'Đại Sứ Non Nước Cao Bằng',
      createdAt: hoursAgo(68),
      lastActiveAt: hoursAgo(9),
    },
    {
      id: 'pl-anh-hn',
      name: 'Nguyễn Ngọc Anh',
      ageGroup: '16-22',
      region: 'Hà Nội',
      interest: 'Học tập & Nghiên cứu khí hậu',
      avatarType: 'leaf',
      totalScore: 1210,
      bestFarmScore: 510,
      bestQuizScore: 450,
      bestMarketScore: 250,
      gamesPlayed: 3,
      avgAccuracy: 75,
      persona: 'eco_guardian',
      wtpPremium: 20,
      favoriteSpecialty: 'Lê & Dược liệu Bảo Lạc',
      buyingFactors: [
        'Canh tác hữu cơ, bảo vệ đất & khí hậu',
        'Nguồn gốc minh bạch (QR / Chỉ dẫn địa lý)',
      ],
      preferredChannel: 'Facebook / Instagram cộng đồng xanh',
      rankTitle: 'Đại Sứ Non Nước Cao Bằng',
      createdAt: hoursAgo(60),
      lastActiveAt: hoursAgo(12),
    },
    {
      id: 'pl-quynh-mb',
      name: 'Đàm Thúy Quỳnh',
      ageGroup: '23-30',
      region: 'Các tỉnh miền núi phía Bắc',
      interest: 'Khởi nghiệp nông nghiệp xanh',
      avatarType: 'leaf',
      totalScore: 1085,
      bestFarmScore: 485,
      bestQuizScore: 350,
      bestMarketScore: 250,
      gamesPlayed: 3,
      avgAccuracy: 72,
      persona: 'community_weaver',
      wtpPremium: 10,
      favoriteSpecialty: 'Thạch đen Đông Khê',
      buyingFactors: [
        'Hương vị đặc sản bản địa độc đáo',
        'Giá cả hợp lý & dễ đặt mua online',
      ],
      preferredChannel: 'Sàn TMĐT (Shopee / Lazada Mall OCOP)',
      rankTitle: 'Đại Sứ Non Nước Cao Bằng',
      createdAt: hoursAgo(50),
      lastActiveAt: hoursAgo(15),
    },
    {
      id: 'pl-duc-hn',
      name: 'Phạm Gia Đức',
      ageGroup: '31-45',
      region: 'Hà Nội',
      interest: 'Tiêu dùng nông sản sạch',
      avatarType: 'grain',
      totalScore: 990,
      bestFarmScore: 440,
      bestQuizScore: 300,
      bestMarketScore: 250,
      gamesPlayed: 3,
      avgAccuracy: 68,
      persona: 'market_builder',
      wtpPremium: 20,
      favoriteSpecialty: 'Miến dong Phia Đén',
      buyingFactors: [
        'Nguồn gốc minh bạch (QR / Chỉ dẫn địa lý)',
        'Hương vị đặc sản bản địa độc đáo',
      ],
      preferredChannel: 'Sàn TMĐT (Shopee / Lazada Mall OCOP)',
      rankTitle: 'Đại Sứ Non Nước Cao Bằng',
      createdAt: hoursAgo(42),
      lastActiveAt: hoursAgo(18),
    },
    {
      id: 'pl-vy-hcm',
      name: 'Võ Tường Vy',
      ageGroup: '16-22',
      region: 'TP. Hồ Chí Minh',
      interest: 'Học tập & Nghiên cứu khí hậu',
      avatarType: 'leaf',
      totalScore: 865,
      bestFarmScore: 465,
      bestQuizScore: 400,
      bestMarketScore: 0,
      gamesPlayed: 2,
      avgAccuracy: 78,
      persona: 'eco_guardian',
      wtpPremium: 10,
      favoriteSpecialty: 'Hạt dẻ Trùng Khánh',
      buyingFactors: ['Canh tác hữu cơ, bảo vệ đất & khí hậu'],
      preferredChannel: 'TikTok / Video ngắn kể chuyện nông dân',
      rankTitle: 'Người Gieo Hạt Tái Sinh',
      createdAt: hoursAgo(36),
      lastActiveAt: hoursAgo(20),
    },
    {
      id: 'pl-khoa-dn',
      name: 'Bùi Đăng Khoa',
      ageGroup: '23-30',
      region: 'Tỉnh/Thành khác',
      interest: 'Du lịch trải nghiệm Cao Bằng',
      avatarType: 'grain',
      totalScore: 730,
      bestFarmScore: 480,
      bestQuizScore: 0,
      bestMarketScore: 250,
      gamesPlayed: 2,
      avgAccuracy: 82,
      persona: 'market_builder',
      wtpPremium: 10,
      favoriteSpecialty: 'Lê & Dược liệu Bảo Lạc',
      buyingFactors: [
        'Hương vị đặc sản bản địa độc đáo',
        'Bao bì xanh, đẹp để làm quà tặng',
      ],
      preferredChannel: 'Hội chợ nông sản & Du lịch trải nghiệm tại Cao Bằng',
      rankTitle: 'Người Gieo Hạt Tái Sinh',
      createdAt: hoursAgo(28),
      lastActiveAt: hoursAgo(22),
    },
    {
      id: 'pl-mai-cb',
      name: 'Triệu Thị Mai',
      ageGroup: '16-22',
      region: 'Cao Bằng',
      interest: 'Khởi nghiệp nông nghiệp xanh',
      avatarType: 'leaf',
      totalScore: 610,
      bestFarmScore: 360,
      bestQuizScore: 250,
      bestMarketScore: 0,
      gamesPlayed: 2,
      avgAccuracy: 65,
      persona: 'community_weaver',
      wtpPremium: 0,
      favoriteSpecialty: 'Thạch đen Đông Khê',
      buyingFactors: ['Giá cả hợp lý & dễ đặt mua online'],
      preferredChannel: 'Facebook / Instagram cộng đồng xanh',
      rankTitle: 'Người Gieo Hạt Tái Sinh',
      createdAt: hoursAgo(16),
      lastActiveAt: hoursAgo(6),
    },
  ];

  const seedSessions: GameSessionRecord[] = [
    {
      id: 'ss-1',
      playerId: 'pl-linh-cb',
      playerName: 'Nông Khánh Linh',
      region: 'Cao Bằng',
      gameType: 'farm_sim',
      score: 620,
      maxScore: 680,
      accuracy: 92,
      durationSec: 118,
      metadata: { persona: 'community_weaver' },
      createdAt: hoursAgo(90),
    },
    {
      id: 'ss-2',
      playerId: 'pl-linh-cb',
      playerName: 'Nông Khánh Linh',
      region: 'Cao Bằng',
      gameType: 'cao_bang_quiz',
      score: 715,
      maxScore: 800,
      accuracy: 100,
      durationSec: 64,
      metadata: {
        quizTopics: [
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: true },
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: true },
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: true },
          { topic: 'Nông nghiệp tái sinh', correct: true },
          { topic: 'Thích ứng khí hậu Cao Bằng', correct: true },
          { topic: 'Nông nghiệp tái sinh', correct: true },
          { topic: 'Khởi nghiệp xanh & OCOP', correct: true },
          { topic: 'Khởi nghiệp xanh & OCOP', correct: true },
        ],
      },
      createdAt: hoursAgo(88),
    },
    {
      id: 'ss-3',
      playerId: 'pl-linh-cb',
      playerName: 'Nông Khánh Linh',
      region: 'Cao Bằng',
      gameType: 'market_basket',
      score: 250,
      maxScore: 250,
      accuracy: 100,
      durationSec: 52,
      metadata: {
        selectedProducts: ['Hạt dẻ Trùng Khánh rang củi (500g)', 'Trà lá Thạch đen Đông Khê hữu cơ', 'Voucher Trải nghiệm Ruộng mẫu 1.000 m²'],
        wtpPremium: 20,
        buyingFactors: ['Ủng hộ sinh kế thanh niên & đồng bào vùng cao', 'Canh tác hữu cơ, bảo vệ đất & khí hậu'],
        preferredChannel: 'TikTok / Video ngắn kể chuyện nông dân',
        totalSpent: 405000,
      },
      createdAt: hoursAgo(3),
    },
    {
      id: 'ss-4',
      playerId: 'pl-minh-hn',
      playerName: 'Trần Nhật Minh',
      region: 'Hà Nội',
      gameType: 'farm_sim',
      score: 590,
      maxScore: 680,
      accuracy: 88,
      durationSec: 132,
      metadata: { persona: 'eco_guardian' },
      createdAt: hoursAgo(80),
    },
    {
      id: 'ss-5',
      playerId: 'pl-minh-hn',
      playerName: 'Trần Nhật Minh',
      region: 'Hà Nội',
      gameType: 'cao_bang_quiz',
      score: 650,
      maxScore: 800,
      accuracy: 88,
      durationSec: 75,
      metadata: {
        quizTopics: [
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: true },
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: true },
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: false },
          { topic: 'Nông nghiệp tái sinh', correct: true },
          { topic: 'Thích ứng khí hậu Cao Bằng', correct: true },
          { topic: 'Nông nghiệp tái sinh', correct: true },
          { topic: 'Khởi nghiệp xanh & OCOP', correct: true },
          { topic: 'Khởi nghiệp xanh & OCOP', correct: true },
        ],
      },
      createdAt: hoursAgo(78),
    },
    {
      id: 'ss-6',
      playerId: 'pl-minh-hn',
      playerName: 'Trần Nhật Minh',
      region: 'Hà Nội',
      gameType: 'market_basket',
      score: 250,
      maxScore: 250,
      accuracy: 100,
      durationSec: 49,
      metadata: {
        selectedProducts: ['Hạt dẻ Trùng Khánh rang củi (500g)', 'Miến dong Phia Đén nguyên chất (500g)', 'Mật ong hoa rừng Non Nước (250ml)'],
        wtpPremium: 20,
        buyingFactors: ['Nguồn gốc minh bạch (QR / Chỉ dẫn địa lý)', 'Canh tác hữu cơ, bảo vệ đất & khí hậu'],
        preferredChannel: 'Website chính thức của Agri-Next',
        totalSpent: 405000,
      },
      createdAt: hoursAgo(5),
    },
    {
      id: 'ss-7',
      playerId: 'pl-thao-hcm',
      playerName: 'Lê Phương Thảo',
      region: 'TP. Hồ Chí Minh',
      gameType: 'cao_bang_quiz',
      score: 600,
      maxScore: 800,
      accuracy: 75,
      durationSec: 82,
      metadata: {
        quizTopics: [
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: true },
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: true },
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: false },
          { topic: 'Nông nghiệp tái sinh', correct: false },
          { topic: 'Thích ứng khí hậu Cao Bằng', correct: true },
          { topic: 'Nông nghiệp tái sinh', correct: true },
          { topic: 'Khởi nghiệp xanh & OCOP', correct: true },
          { topic: 'Khởi nghiệp xanh & OCOP', correct: true },
        ],
      },
      createdAt: hoursAgo(40),
    },
    {
      id: 'ss-8',
      playerId: 'pl-thao-hcm',
      playerName: 'Lê Phương Thảo',
      region: 'TP. Hồ Chí Minh',
      gameType: 'market_basket',
      score: 250,
      maxScore: 250,
      accuracy: 100,
      durationSec: 61,
      metadata: {
        selectedProducts: ['Hạt dẻ Trùng Khánh rang củi (500g)', 'Trà thảo dược & Lê sấy dẻo Bảo Lạc', 'Voucher Trải nghiệm Ruộng mẫu 1.000 m²'],
        wtpPremium: 30,
        buyingFactors: ['Bao bì xanh, đẹp để làm quà tặng', 'Nguồn gốc minh bạch (QR / Chỉ dẫn địa lý)'],
        preferredChannel: 'Facebook / Instagram cộng đồng xanh',
        totalSpent: 430000,
      },
      createdAt: hoursAgo(7),
    },
    {
      id: 'ss-9',
      playerId: 'pl-hung-cb',
      playerName: 'Hoàng Văn Hùng',
      region: 'Cao Bằng',
      gameType: 'cao_bang_quiz',
      score: 500,
      maxScore: 800,
      accuracy: 63,
      durationSec: 91,
      metadata: {
        quizTopics: [
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: true },
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: true },
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: true },
          { topic: 'Nông nghiệp tái sinh', correct: false },
          { topic: 'Thích ứng khí hậu Cao Bằng', correct: true },
          { topic: 'Nông nghiệp tái sinh', correct: false },
          { topic: 'Khởi nghiệp xanh & OCOP', correct: false },
          { topic: 'Khởi nghiệp xanh & OCOP', correct: true },
        ],
      },
      createdAt: hoursAgo(30),
    },
    {
      id: 'ss-10',
      playerId: 'pl-anh-hn',
      playerName: 'Nguyễn Ngọc Anh',
      region: 'Hà Nội',
      gameType: 'cao_bang_quiz',
      score: 450,
      maxScore: 800,
      accuracy: 63,
      durationSec: 88,
      metadata: {
        quizTopics: [
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: true },
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: false },
          { topic: 'Đặc sản & Chỉ dẫn địa lý', correct: false },
          { topic: 'Nông nghiệp tái sinh', correct: true },
          { topic: 'Thích ứng khí hậu Cao Bằng', correct: true },
          { topic: 'Nông nghiệp tái sinh', correct: true },
          { topic: 'Khởi nghiệp xanh & OCOP', correct: true },
          { topic: 'Khởi nghiệp xanh & OCOP', correct: false },
        ],
      },
      createdAt: hoursAgo(24),
    },
    {
      id: 'ss-11',
      playerId: 'pl-duc-hn',
      playerName: 'Phạm Gia Đức',
      region: 'Hà Nội',
      gameType: 'market_basket',
      score: 250,
      maxScore: 250,
      accuracy: 100,
      durationSec: 55,
      metadata: {
        selectedProducts: ['Miến dong Phia Đén nguyên chất (500g)', 'Hạt dẻ Trùng Khánh rang củi (500g)', 'Trà lá Thạch đen Đông Khê hữu cơ'],
        wtpPremium: 20,
        buyingFactors: ['Nguồn gốc minh bạch (QR / Chỉ dẫn địa lý)', 'Hương vị đặc sản bản địa độc đáo'],
        preferredChannel: 'Sàn TMĐT (Shopee / Lazada Mall OCOP)',
        totalSpent: 350000,
      },
      createdAt: hoursAgo(18),
    },
    {
      id: 'ss-12',
      playerId: 'pl-quynh-mb',
      playerName: 'Đàm Thúy Quỳnh',
      region: 'Các tỉnh miền núi phía Bắc',
      gameType: 'market_basket',
      score: 250,
      maxScore: 250,
      accuracy: 100,
      durationSec: 59,
      metadata: {
        selectedProducts: ['Trà lá Thạch đen Đông Khê hữu cơ', 'Miến dong Phia Đén nguyên chất (500g)', 'Trà thảo dược & Lê sấy dẻo Bảo Lạc'],
        wtpPremium: 10,
        buyingFactors: ['Hương vị đặc sản bản địa độc đáo', 'Giá cả hợp lý & dễ đặt mua online'],
        preferredChannel: 'Sàn TMĐT (Shopee / Lazada Mall OCOP)',
        totalSpent: 340000,
      },
      createdAt: hoursAgo(15),
    },
  ];

  const seedEvents: BehaviorEventRecord[] = [
    ...Array.from({ length: 42 }, (_, idx) => ({
      id: `ev-pv-${idx}`,
      sessionId: `seed-s-${idx}`,
      playerId: idx < seedPlayers.length ? seedPlayers[idx].id : null,
      eventType: 'page_view' as const,
      target: 'landing',
      durationMs: 0,
      createdAt: hoursAgo(idx + 1),
    })),
    ...Array.from({ length: 28 }, (_, idx) => ({
      id: `ev-crop-${idx}`,
      sessionId: `seed-s-${idx}`,
      playerId: idx < seedPlayers.length ? seedPlayers[idx].id : null,
      eventType: 'crop_explored' as const,
      target: ['hat-de-trung-khanh', 'thach-den-dong-khe', 'mien-dong-phia-den', 'le-duoc-lieu-bao-lac'][idx % 4],
      durationMs: 3200,
      createdAt: hoursAgo(idx + 1),
    })),
    ...Array.from({ length: 18 }, (_, idx) => ({
      id: `ev-gs-${idx}`,
      sessionId: `seed-s-${idx}`,
      playerId: seedPlayers[idx % seedPlayers.length].id,
      eventType: 'game_started' as const,
      target: VALID_GAME_TYPES[idx % 3],
      durationMs: 0,
      createdAt: hoursAgo(idx + 2),
    })),
    ...seedSessions.map((s, idx) => ({
      id: `ev-gc-${idx}`,
      sessionId: `seed-gc-${idx}`,
      playerId: s.playerId,
      eventType: 'game_completed' as const,
      target: s.gameType,
      durationMs: s.durationSec * 1000,
      createdAt: s.createdAt,
    })),
  ];

  const seedInsights: CommunityInsightRecord[] = [
    {
      id: 'ins-1',
      playerId: 'pl-linh-cb',
      authorName: 'Nông Khánh Linh',
      region: 'Cao Bằng',
      topic: 'Bootcamp Thanh niên',
      favoriteCrop: 'Hạt dẻ Trùng Khánh',
      message:
        'Mình mong Agri-Next mở thêm buổi thực hành quay video ngắn kể chuyện mùa dẻ ngay tại Trùng Khánh để các bạn trẻ dân tộc Tày, Nùng tự tin giới thiệu đặc sản quê mình.',
      createdAt: hoursAgo(22),
    },
    {
      id: 'ins-2',
      playerId: 'pl-minh-hn',
      authorName: 'Trần Nhật Minh',
      region: 'Hà Nội',
      topic: 'Nông sản Cao Bằng',
      favoriteCrop: 'Miến dong Phia Đén',
      message:
        'Ở Hà Nội rất khó phân biệt miến dong Phia Đén thật và hàng pha tạp. Nếu có mã QR xem trực tiếp nhật ký canh tác ruộng mẫu thì mình sẵn sàng đặt mua định kỳ cho gia đình.',
      createdAt: hoursAgo(14),
    },
    {
      id: 'ins-3',
      playerId: 'pl-thao-hcm',
      authorName: 'Lê Phương Thảo',
      region: 'TP. Hồ Chí Minh',
      topic: 'Kênh phân phối',
      favoriteCrop: 'Hạt dẻ Trùng Khánh',
      message:
        'Bộ hộp quà kết hợp hạt dẻ Trùng Khánh, trà thạch đen và lê sấy Bảo Lạc với bao bì thổ cẩm tối giản sẽ cực kỳ thu hút giới trẻ làm quà tặng dịp lễ Tết.',
      createdAt: hoursAgo(8),
    },
    {
      id: 'ins-4',
      playerId: 'pl-anh-hn',
      authorName: 'Nguyễn Ngọc Anh',
      region: 'Hà Nội',
      topic: 'Nông nghiệp Tái sinh',
      favoriteCrop: 'Lê & Dược liệu Bảo Lạc',
      message:
        'Chơi game Mùa Vụ Tái Sinh giúp mình lần đầu hiểu rõ tác dụng của việc ủ bã dong riềng thành phân compost chống rửa trôi đất dốc ở Cao Bằng!',
      createdAt: hoursAgo(4),
    },
  ];

  const seedPlayers: PlayerProfile[] = rawSeedPlayers.map((p, idx) =>
    hydratePlayer({ ...p, checkInCode: `AGRI-CB${String(idx + 11).padStart(2, '0')}` })
  );

  return {
    players: seedPlayers,
    sessions: seedSessions,
    events: seedEvents,
    insights: seedInsights,
    gifts: [],
  };
}

function loadDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const seed = createInitialSeedData();
      fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
      return seed;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
    if (!Array.isArray(parsed.players) || !Array.isArray(parsed.sessions)) {
      const seed = createInitialSeedData();
      fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
      return seed;
    }
    return {
      players: parsed.players.map((p) => hydratePlayer(p)),
      sessions: parsed.sessions,
      events: Array.isArray(parsed.events) ? parsed.events : [],
      insights: Array.isArray(parsed.insights) ? parsed.insights : [],
      gifts: Array.isArray(parsed.gifts) ? parsed.gifts : [],
      giftTotal: typeof parsed.giftTotal === 'number' ? parsed.giftTotal : undefined,
      adminCredentialHash:
        typeof parsed.adminCredentialHash === 'string' ? parsed.adminCredentialHash : null,
    };
  } catch (err) {
    console.error('Failed to load DB, initializing fresh seed:', err);
    return createInitialSeedData();
  }
}

let db: DatabaseSchema = loadDb();

function saveDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist DB:', err);
  }
}

function getGiftTotal(): number {
  return typeof db.giftTotal === 'number' ? db.giftTotal : DEFAULT_GIFT_TOTAL;
}

function buildGiftStatus(): GiftStatus {
  const total = getGiftTotal();
  const claimed = db.gifts.length;
  return {
    total,
    claimed,
    redeemed: db.gifts.filter((g) => g.redeemedAt).length,
    remaining: Math.max(0, total - claimed),
  };
}

const GIFT_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function generateGiftCode(slot: number): string {
  let suffix = '';
  const bytes = crypto.randomBytes(3);
  for (const b of bytes) suffix += GIFT_CODE_ALPHABET[b % GIFT_CODE_ALPHABET.length];
  return `AN-${String(slot).padStart(2, '0')}-${suffix}`;
}

function buildPublicInsightsSummary(): PublicInsightsSummary {
  const wtpPlayers = db.players.filter((p) => typeof p.wtpPremium === 'number');
  const avgWtpPremium =
    wtpPlayers.length > 0
      ? Math.round(
          (wtpPlayers.reduce((sum, p) => sum + (p.wtpPremium ?? 0), 0) / wtpPlayers.length) * 10
        ) / 10
      : 0;

  const specialtyCounts = new Map<string, number>();
  for (const p of db.players) {
    if (p.favoriteSpecialty) {
      specialtyCounts.set(p.favoriteSpecialty, (specialtyCounts.get(p.favoriteSpecialty) ?? 0) + 1);
    }
  }
  for (const ins of db.insights) {
    if (ins.favoriteCrop) {
      specialtyCounts.set(ins.favoriteCrop, (specialtyCounts.get(ins.favoriteCrop) ?? 0) + 1);
    }
  }
  const totalSpecVotes = Array.from(specialtyCounts.values()).reduce((a, b) => a + b, 0) || 1;
  const topSpecialties = Array.from(specialtyCounts.entries())
    .map(([name, count]) => ({
      name,
      count,
      share: Math.round((count / totalSpecVotes) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const personaCounts = new Map<SustainabilityPersona, number>();
  for (const key of VALID_PERSONAS) personaCounts.set(key, 0);
  for (const p of db.players) {
    if (p.persona && personaCounts.has(p.persona)) {
      personaCounts.set(p.persona, (personaCounts.get(p.persona) ?? 0) + 1);
    }
  }
  const totalPersonas = Array.from(personaCounts.values()).reduce((a, b) => a + b, 0) || 1;
  const personaBreakdown = VALID_PERSONAS.map((key) => {
    const count = personaCounts.get(key) ?? 0;
    return {
      key,
      label: PERSONA_NAMES[key],
      count,
      share: Math.round((count / totalPersonas) * 100),
    };
  }).sort((a, b) => b.count - a.count);

  return {
    totalPlayers: db.players.length,
    totalSessions: db.sessions.length,
    totalInsights: db.insights.length,
    avgWtpPremium,
    topSpecialties,
    personaBreakdown,
    recentInsights: [...db.insights]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 12),
  };
}

function buildAdminDashboard(): AdminDashboardData {
  const totalPlayers = db.players.length;
  const totalSessions = db.sessions.length;
  const avgScore =
    totalPlayers > 0
      ? Math.round(db.players.reduce((sum, p) => sum + p.totalScore, 0) / totalPlayers)
      : 0;

  const startedCount = Math.max(
    db.events.filter((e) => e.eventType === 'game_started').length,
    totalSessions
  );
  const completionRate =
    startedCount > 0 ? Math.min(100, Math.round((totalSessions / startedCount) * 100)) : 0;

  const wtpValues = db.players
    .map((p) => p.wtpPremium)
    .filter((v): v is number => typeof v === 'number');
  const avgWtpPremium =
    wtpValues.length > 0
      ? Math.round((wtpValues.reduce((a, b) => a + b, 0) / wtpValues.length) * 10) / 10
      : 0;

  // Funnel
  const pageViews = Math.max(
    db.events.filter((e) => e.eventType === 'page_view').length,
    totalPlayers * 3
  );
  const cropExplores = db.events.filter((e) => e.eventType === 'crop_explored').length;
  const gameCompletedPlayers = db.players.filter((p) => p.gamesPlayed > 0).length;
  const marketCompletedPlayers = db.players.filter((p) => p.bestMarketScore > 0).length;

  const funnelSteps = [
    { step: 'Lượt truy cập Mini Web', count: pageViews },
    { step: 'Khám phá Nông sản Cao Bằng', count: Math.min(pageViews, cropExplores) },
    { step: 'Đăng ký hồ sơ người chơi', count: totalPlayers },
    { step: 'Hoàn thành ít nhất 1 trò chơi', count: gameCompletedPlayers },
    { step: 'Hoàn thành Khảo sát Giỏ Xanh', count: marketCompletedPlayers },
  ];
  const funnel = funnelSteps.map((s) => ({
    ...s,
    conversionPct: pageViews > 0 ? Math.round((s.count / pageViews) * 100) : 0,
  }));

  // Per-game stats
  const gameLabels: Record<GameType, string> = {
    farm_sim: 'Mùa Vụ Tái Sinh',
    cao_bang_quiz: 'Thử Thách Kiến Thức',
    market_basket: 'Giỏ Quà Xanh & Thị Trường',
  };
  const gameStats = VALID_GAME_TYPES.map((gt) => {
    const list = db.sessions.filter((s) => s.gameType === gt);
    const plays = list.length;
    return {
      gameType: gt,
      label: gameLabels[gt],
      plays,
      avgScore: plays > 0 ? Math.round(list.reduce((a, s) => a + s.score, 0) / plays) : 0,
      avgAccuracy: plays > 0 ? Math.round(list.reduce((a, s) => a + s.accuracy, 0) / plays) : 0,
      avgDurationSec:
        plays > 0 ? Math.round(list.reduce((a, s) => a + s.durationSec, 0) / plays) : 0,
    };
  });

  // Knowledge gaps from quiz sessions
  const topicTotals = new Map<string, { answered: number; correct: number }>();
  for (const s of db.sessions) {
    if (s.gameType === 'cao_bang_quiz' && Array.isArray(s.metadata.quizTopics)) {
      for (const item of s.metadata.quizTopics) {
        const prev = topicTotals.get(item.topic) ?? { answered: 0, correct: 0 };
        prev.answered += 1;
        if (item.correct) prev.correct += 1;
        topicTotals.set(item.topic, prev);
      }
    }
  }
  const knowledgeGaps = Array.from(topicTotals.entries())
    .map(([topic, stat]) => ({
      topic,
      totalAnswered: stat.answered,
      correctRate: stat.answered > 0 ? Math.round((stat.correct / stat.answered) * 100) : 0,
    }))
    .sort((a, b) => a.correctRate - b.correctRate);

  // Buying factors
  const factorCounts = new Map<string, number>();
  for (const p of db.players) {
    for (const f of p.buyingFactors || []) {
      factorCounts.set(f, (factorCounts.get(f) ?? 0) + 1);
    }
  }
  const buyingFactorStats = Array.from(factorCounts.entries())
    .map(([factor, count]) => ({ factor, count }))
    .sort((a, b) => b.count - a.count);

  // WTP Distribution
  const wtpMap = new Map<number, number>([
    [0, 0],
    [10, 0],
    [20, 0],
    [30, 0],
  ]);
  for (const p of db.players) {
    if (typeof p.wtpPremium === 'number') {
      const bucket = p.wtpPremium >= 30 ? 30 : p.wtpPremium >= 20 ? 20 : p.wtpPremium >= 10 ? 10 : 0;
      wtpMap.set(bucket, (wtpMap.get(bucket) ?? 0) + 1);
    }
  }
  const wtpDistribution = [
    { tier: '0% (Giá thường)', count: wtpMap.get(0) ?? 0 },
    { tier: '+10% Xanh', count: wtpMap.get(10) ?? 0 },
    { tier: '+20% Tái sinh', count: wtpMap.get(20) ?? 0 },
    { tier: '+30%+ Ủng hộ', count: wtpMap.get(30) ?? 0 },
  ];

  // Product demand from market_basket sessions
  const productCounts = new Map<string, number>();
  for (const s of db.sessions) {
    if (s.gameType === 'market_basket' && Array.isArray(s.metadata.selectedProducts)) {
      for (const prod of s.metadata.selectedProducts) {
        productCounts.set(prod, (productCounts.get(prod) ?? 0) + 1);
      }
    }
  }
  const productDemand = Array.from(productCounts.entries())
    .map(([product, selections]) => ({ product, selections }))
    .sort((a, b) => b.selections - a.selections);

  // Channel stats
  const channelCounts = new Map<string, number>();
  for (const p of db.players) {
    if (p.preferredChannel) {
      channelCounts.set(p.preferredChannel, (channelCounts.get(p.preferredChannel) ?? 0) + 1);
    }
  }
  const channelStats = Array.from(channelCounts.entries())
    .map(([channel, count]) => ({ channel, count }))
    .sort((a, b) => b.count - a.count);

  // Persona stats
  const personaCounts = new Map<SustainabilityPersona, number>();
  for (const p of db.players) {
    if (p.persona) {
      personaCounts.set(p.persona, (personaCounts.get(p.persona) ?? 0) + 1);
    }
  }
  const personaStats = VALID_PERSONAS.map((key) => ({
    persona: PERSONA_NAMES[key],
    count: personaCounts.get(key) ?? 0,
  }));

  // Region stats
  const regionCounts = new Map<string, number>();
  for (const p of db.players) {
    regionCounts.set(p.region, (regionCounts.get(p.region) ?? 0) + 1);
  }
  const regionStats = Array.from(regionCounts.entries())
    .map(([region, players]) => ({ region, players }))
    .sort((a, b) => b.players - a.players);

  return {
    kpis: {
      totalPlayers,
      totalSessions,
      avgScore,
      completionRate,
      avgWtpPremium,
      totalInsights: db.insights.length,
    },
    funnel,
    gameStats,
    knowledgeGaps,
    buyingFactorStats,
    wtpDistribution,
    productDemand,
    channelStats,
    personaStats,
    regionStats,
    players: [...db.players].sort((a, b) => b.totalScore - a.totalScore),
    insights: [...db.insights].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}

function escapeCsvCell(val: unknown): string {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  // Health
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', players: db.players.length });
  });

  // Register / update player profile
  app.post('/api/players/register', (req, res) => {
    const body = req.body ?? {};
    const existingId = sanitizeText(body.id, 64);
    const name = sanitizeText(body.name, 48);
    if (name.length < 2) {
      res.status(400).json({ error: 'Vui lòng nhập tên hiển thị từ 2 ký tự trở lên.' });
      return;
    }

    const ageGroup: AgeGroup = VALID_AGE_GROUPS.includes(body.ageGroup) ? body.ageGroup : '16-22';
    const region: RegionOption = VALID_REGIONS.includes(body.region) ? body.region : 'Hà Nội';
    const interest: InterestFocus = VALID_INTERESTS.includes(body.interest)
      ? body.interest
      : 'Tiêu dùng nông sản sạch';
    const avatarType = body.avatarType === 'grain' ? 'grain' : 'leaf';
    const nowIso = new Date().toISOString();

    if (existingId) {
      const found = db.players.find((p) => p.id === existingId);
      if (found) {
        found.name = name;
        found.ageGroup = ageGroup;
        found.region = region;
        found.interest = interest;
        found.avatarType = avatarType;
        found.lastActiveAt = nowIso;
        saveDb();
        res.json({ player: found });
        return;
      }
    }

    const newPlayer: PlayerProfile = hydratePlayer({
      id: `pl-${crypto.randomBytes(5).toString('hex')}`,
      name,
      ageGroup,
      region,
      interest,
      avatarType,
      totalScore: 0,
      bestFarmScore: 0,
      bestQuizScore: 0,
      bestMarketScore: 0,
      gamesPlayed: 0,
      avgAccuracy: 0,
      persona: null,
      wtpPremium: null,
      favoriteSpecialty: null,
      buyingFactors: [],
      preferredChannel: null,
      rankTitle: computeRankTitle(0),
      createdAt: nowIso,
      lastActiveAt: nowIso,
    });

    db.players.push(newPlayer);
    saveDb();
    res.status(201).json({ player: newPlayer });
  });

  // Optional 1-line name claim directly on Check-in Badge Card (no login required)
  app.patch('/api/players/:id/claim', (req, res) => {
    const player = db.players.find((p) => p.id === req.params.id);
    if (!player) {
      res.status(404).json({ error: 'Không tìm thấy hồ sơ người chơi.' });
      return;
    }
    const name = sanitizeText(req.body?.name, 48);
    if (name.length >= 2) {
      player.name = name;
    }
    if (VALID_REGIONS.includes(req.body?.region)) {
      player.region = req.body.region;
    }
    player.lastActiveAt = new Date().toISOString();
    // Sync session display names too
    for (const s of db.sessions) {
      if (s.playerId === player.id) {
        s.playerName = player.name;
        s.region = player.region;
      }
    }
    saveDb();
    const sorted = [...db.players].sort((a, b) => b.totalScore - a.totalScore);
    const rank = sorted.findIndex((p) => p.id === player.id) + 1;
    res.json({ player, rank, totalPlayers: db.players.length });
  });

  // Get single player profile
  app.get('/api/players/:id', (req, res) => {
    const player = db.players.find((p) => p.id === req.params.id);
    if (!player) {
      res.status(404).json({ error: 'Không tìm thấy hồ sơ người chơi.' });
      return;
    }
    const history = db.sessions
      .filter((s) => s.playerId === player.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json({ player, history });
  });

  // Submit completed game/survey session — works immediately with ZERO login!
  app.post('/api/games/submit', (req, res) => {
    const body = req.body ?? {};
    const gameType = body.gameType as GameType;
    if (!VALID_GAME_TYPES.includes(gameType)) {
      res.status(400).json({ error: 'Loại trò chơi không hợp lệ.' });
      return;
    }

    const playerId = sanitizeText(body.playerId, 64);
    let player = playerId ? db.players.find((p) => p.id === playerId) : undefined;
    if (!player) {
      const nowIso = new Date().toISOString();
      const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
      player = hydratePlayer({
        id: `pl-${crypto.randomBytes(5).toString('hex')}`,
        name: `Bạn trẻ Xanh #${suffix}`,
        ageGroup: '16-22',
        region: 'Hà Nội',
        interest: 'Tiêu dùng nông sản sạch',
        avatarType: gameType === 'cao_bang_quiz' ? 'grain' : 'leaf',
        totalScore: 0,
        bestFarmScore: 0,
        bestQuizScore: 0,
        bestMarketScore: 0,
        gamesPlayed: 0,
        avgAccuracy: 0,
        persona: null,
        wtpPremium: null,
        favoriteSpecialty: null,
        buyingFactors: [],
        preferredChannel: null,
        rankTitle: computeRankTitle(0),
        createdAt: nowIso,
        lastActiveAt: nowIso,
      });
      db.players.push(player);
    }

    const score = Math.max(0, Math.min(2000, Math.round(Number(body.score) || 0)));
    const maxScore = Math.max(1, Math.min(2000, Math.round(Number(body.maxScore) || 1000)));
    const accuracy = Math.max(0, Math.min(100, Math.round(Number(body.accuracy) || 0)));
    const durationSec = Math.max(1, Math.min(3600, Math.round(Number(body.durationSec) || 10)));
    const rawMeta = body.metadata && typeof body.metadata === 'object' ? body.metadata : {};

    const cleanMeta: GameSessionRecord['metadata'] = {};
    if (VALID_PERSONAS.includes(rawMeta.persona)) {
      cleanMeta.persona = rawMeta.persona;
      player.persona = rawMeta.persona;
    }
    if (Array.isArray(rawMeta.dilemmaChoices)) {
      cleanMeta.dilemmaChoices = rawMeta.dilemmaChoices.slice(0, 12);
    }
    if (Array.isArray(rawMeta.quizTopics)) {
      cleanMeta.quizTopics = rawMeta.quizTopics.slice(0, 20).map((t: { topic?: unknown; correct?: unknown }) => ({
        topic: sanitizeText(t.topic, 80),
        correct: Boolean(t.correct),
      }));
    }
    if (Array.isArray(rawMeta.selectedProducts)) {
      const products: string[] = rawMeta.selectedProducts
        .slice(0, 10)
        .map((s: unknown) => sanitizeText(s, 100))
        .filter(Boolean);
      cleanMeta.selectedProducts = products;
      if (products.length > 0) {
        const first = products[0];
        if (first.includes('Hạt dẻ')) player.favoriteSpecialty = 'Hạt dẻ Trùng Khánh';
        else if (first.includes('Thạch đen')) player.favoriteSpecialty = 'Thạch đen Đông Khê';
        else if (first.includes('Miến dong')) player.favoriteSpecialty = 'Miến dong Phia Đén';
        else if (first.includes('Lê') || first.includes('Bảo Lạc')) player.favoriteSpecialty = 'Lê & Dược liệu Bảo Lạc';
      }
    }
    if (typeof rawMeta.wtpPremium === 'number' && [0, 10, 20, 30].includes(rawMeta.wtpPremium)) {
      cleanMeta.wtpPremium = rawMeta.wtpPremium;
      player.wtpPremium = rawMeta.wtpPremium;
    }
    if (Array.isArray(rawMeta.buyingFactors)) {
      const factors: string[] = rawMeta.buyingFactors
        .slice(0, 6)
        .map((s: unknown) => sanitizeText(s, 100))
        .filter(Boolean);
      cleanMeta.buyingFactors = factors;
      player.buyingFactors = factors;
    }
    if (typeof rawMeta.preferredChannel === 'string' && rawMeta.preferredChannel.trim()) {
      cleanMeta.preferredChannel = sanitizeText(rawMeta.preferredChannel, 100);
      player.preferredChannel = cleanMeta.preferredChannel;
    }
    if (typeof rawMeta.totalSpent === 'number') {
      cleanMeta.totalSpent = Math.max(0, Math.min(1000000, Math.round(rawMeta.totalSpent)));
    }

    const nowIso = new Date().toISOString();
    const sessionRecord: GameSessionRecord = {
      id: `ss-${crypto.randomBytes(5).toString('hex')}`,
      playerId: player.id,
      playerName: player.name,
      region: player.region,
      gameType,
      score,
      maxScore,
      accuracy,
      durationSec,
      metadata: cleanMeta,
      createdAt: nowIso,
    };

    db.sessions.push(sessionRecord);
    db.events.push({
      id: `ev-${crypto.randomBytes(4).toString('hex')}`,
      sessionId: sessionRecord.id,
      playerId: player.id,
      eventType: 'game_completed',
      target: gameType,
      durationMs: durationSec * 1000,
      createdAt: nowIso,
    });

    // Update player aggregate stats
    if (gameType === 'farm_sim') player.bestFarmScore = Math.max(player.bestFarmScore, score);
    if (gameType === 'cao_bang_quiz') player.bestQuizScore = Math.max(player.bestQuizScore, score);
    if (gameType === 'market_basket') player.bestMarketScore = Math.max(player.bestMarketScore, score);

    const playerSessions = db.sessions.filter((s) => s.playerId === player.id);
    player.gamesPlayed = playerSessions.length;
    player.avgAccuracy =
      playerSessions.length > 0
        ? Math.round(
            playerSessions.reduce((acc, s) => acc + s.accuracy, 0) / playerSessions.length
          )
        : accuracy;
    player.totalScore = player.bestFarmScore + player.bestQuizScore + player.bestMarketScore;
    player.rankTitle = computeRankTitle(player.totalScore);
    player.badges = computeBadges(player);
    player.lastActiveAt = nowIso;

    saveDb();

    // Compute live rank
    const sorted = [...db.players].sort((a, b) => b.totalScore - a.totalScore);
    const rank = sorted.findIndex((p) => p.id === player.id) + 1;

    res.status(201).json({
      session: sessionRecord,
      player,
      rank,
      totalPlayers: db.players.length,
    });
  });

  // Track customer behavior events
  app.post('/api/events', (req, res) => {
    const body = req.body ?? {};
    const validTypes = [
      'page_view',
      'crop_explored',
      'game_started',
      'game_completed',
      'insight_submitted',
      'social_clicked',
    ];
    if (!validTypes.includes(body.eventType)) {
      res.status(400).json({ error: 'Invalid eventType' });
      return;
    }

    const record: BehaviorEventRecord = {
      id: `ev-${crypto.randomBytes(4).toString('hex')}`,
      sessionId: sanitizeText(body.sessionId, 64) || 'anon',
      playerId: body.playerId ? sanitizeText(body.playerId, 64) : null,
      eventType: body.eventType,
      target: sanitizeText(body.target, 100) || 'unknown',
      durationMs: Math.max(0, Math.min(3_600_000, Math.round(Number(body.durationMs) || 0))),
      createdAt: new Date().toISOString(),
    };
    db.events.push(record);
    // Keep event log bounded neatly
    if (db.events.length > 5000) {
      db.events = db.events.slice(-4000);
    }
    saveDb();
    res.status(201).json({ ok: true });
  });

  // Leaderboard
  app.get('/api/leaderboard', (req, res) => {
    const gameFilter = sanitizeText(req.query.game, 32) || 'all';
    const regionFilter = sanitizeText(req.query.region, 64) || 'all';

    let list = [...db.players];
    if (regionFilter !== 'all') {
      list = list.filter((p) => p.region === regionFilter);
    }

    const scoreFor = (p: PlayerProfile) => {
      if (gameFilter === 'farm_sim') return p.bestFarmScore;
      if (gameFilter === 'cao_bang_quiz') return p.bestQuizScore;
      if (gameFilter === 'market_basket') return p.bestMarketScore;
      return p.totalScore;
    };

    const ranked: LeaderboardEntry[] = list
      .sort((a, b) => scoreFor(b) - scoreFor(a) || b.avgAccuracy - a.avgAccuracy)
      .map((p, idx) => ({
        ...p,
        rank: idx + 1,
        displayScore: scoreFor(p),
      }));

    res.json({
      entries: ranked,
      totalPlayers: db.players.length,
      totalSessions: db.sessions.length,
    });
  });

  // Public community insights snapshot
  app.get('/api/insights/public', (_req, res) => {
    res.json(buildPublicInsightsSummary());
  });

  // Submit qualitative insight
  app.post('/api/insights', (req, res) => {
    const body = req.body ?? {};
    const authorName = sanitizeText(body.authorName, 48);
    const message = sanitizeText(body.message, 500);
    const favoriteCrop = sanitizeText(body.favoriteCrop, 80) || 'Hạt dẻ Trùng Khánh';
    const validTopics: CommunityInsightRecord['topic'][] = [
      'Nông sản Cao Bằng',
      'Bootcamp Thanh niên',
      'Nông nghiệp Tái sinh',
      'Kênh phân phối',
    ];
    const topic = validTopics.includes(body.topic) ? body.topic : 'Nông sản Cao Bằng';
    const region: RegionOption = VALID_REGIONS.includes(body.region) ? body.region : 'Hà Nội';

    if (authorName.length < 2 || message.length < 10) {
      res.status(400).json({ error: 'Vui lòng nhập tên và nội dung chia sẻ tối thiểu 10 ký tự.' });
      return;
    }

    const insight: CommunityInsightRecord = {
      id: `ins-${crypto.randomBytes(5).toString('hex')}`,
      playerId: body.playerId ? sanitizeText(body.playerId, 64) : null,
      authorName,
      region,
      topic,
      favoriteCrop,
      message,
      createdAt: new Date().toISOString(),
    };
    db.insights.push(insight);
    db.events.push({
      id: `ev-${crypto.randomBytes(4).toString('hex')}`,
      sessionId: sanitizeText(body.sessionId, 64) || 'web',
      playerId: insight.playerId,
      eventType: 'insight_submitted',
      target: topic,
      durationMs: 0,
      createdAt: insight.createdAt,
    });
    saveDb();
    res.status(201).json({ insight });
  });

  // Admin auth status (public check whether first-run password setup is needed)
  app.get('/api/admin/status', (_req, res) => {
    const envConfigured = Boolean(getEnvAdminPasscode());
    const hasSavedHash = Boolean(db.adminCredentialHash);
    res.json({
      needsSetup: !envConfigured && !hasSavedHash,
      configuredViaEnv: envConfigured,
    });
  });

  // One-time first-run admin password setup (locked permanently once claimed or when ADMIN_PASSCODE env is set)
  app.post('/api/admin/setup', (req, res) => {
    if (getEnvAdminPasscode() || db.adminCredentialHash) {
      res.status(409).json({ error: 'Mật khẩu quản trị đã được thiết lập trước đó.' });
      return;
    }
    const password = typeof req.body?.password === 'string' ? req.body.password.trim() : '';
    if (password.length < 6 || password.length > 128) {
      res.status(400).json({ error: 'Mật khẩu quản trị cần có từ 6 đến 128 ký tự.' });
      return;
    }
    db.adminCredentialHash = hashAdminPassword(password);
    saveDb();
    const token = issueAdminToken();
    res.status(201).json({ token });
  });

  // Admin login (server-side verification against ADMIN_PASSCODE env or scrypt hash)
  app.post('/api/admin/login', (req, res) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const attempt = loginAttempts.get(ip);
    if (attempt && attempt.resetAt > now && attempt.count >= 10) {
      res.status(429).json({ error: 'Thử sai quá nhiều lần. Vui lòng đợi vài phút rồi thử lại.' });
      return;
    }

    const password = typeof req.body?.password === 'string' ? req.body.password.trim() : '';
    if (!password) {
      res.status(400).json({ error: 'Vui lòng nhập mật khẩu quản trị.' });
      return;
    }

    const envPasscode = getEnvAdminPasscode();
    let valid = false;
    if (envPasscode) {
      // Configured process.env passcode always overrides any claimed fallback hash
      valid = verifyPlaintextConstantTime(password, envPasscode);
    } else if (db.adminCredentialHash) {
      valid = verifyScryptPassword(password, db.adminCredentialHash);
    } else {
      res.status(409).json({ error: 'Chưa thiết lập mật khẩu quản trị. Vui lòng thiết lập lần đầu.' });
      return;
    }

    if (!valid) {
      const nextCount = attempt && attempt.resetAt > now ? attempt.count + 1 : 1;
      loginAttempts.set(ip, { count: nextCount, resetAt: now + 5 * 60 * 1000 });
      res.status(401).json({ error: 'Mật khẩu quản trị chưa đúng.' });
      return;
    }

    loginAttempts.delete(ip);
    const token = issueAdminToken();
    res.json({ token });
  });

  // Admin logout
  app.post('/api/admin/logout', (req, res) => {
    const token = extractBearerToken(req);
    if (token) adminSessions.delete(token);
    res.json({ ok: true });
  });

  // ---------------------------------------------------------------------------
  // "Săn Sticker" — limited booth gifts (default 30). Answers are graded here so
  // the slot counter cannot be drained by simply calling the API.
  // ---------------------------------------------------------------------------
  app.get('/api/gifts/status', (_req, res) => {
    res.json(buildGiftStatus());
  });

  app.get('/api/gifts/mine/:deviceId', (req, res) => {
    const deviceId = sanitizeText(req.params.deviceId, 64);
    const claim = db.gifts.find((g) => g.deviceId === deviceId) ?? null;
    res.json({ claim, status: buildGiftStatus() });
  });

  app.post('/api/gifts/claim', (req, res) => {
    const body = req.body ?? {};
    const deviceId = sanitizeText(body.deviceId, 64);
    const name = sanitizeText(body.name, 40);
    const playerId = sanitizeText(body.playerId, 64) || null;
    if (!deviceId || deviceId.length < 8) {
      res.status(400).json({ error: 'Thiếu mã thiết bị. Vui lòng tải lại trang.' });
      return;
    }
    if (name.length < 2) {
      res.status(400).json({ error: 'Bạn nhập tên (ít nhất 2 ký tự) để staff gọi khi phát quà nhé!' });
      return;
    }

    const existing = db.gifts.find((g) => g.deviceId === deviceId);
    if (existing) {
      res.json({ claim: existing, status: buildGiftStatus(), alreadyClaimed: true });
      return;
    }

    const rawAnswers: Array<{ id?: unknown; choice?: unknown }> = Array.isArray(body.answers)
      ? body.answers.slice(0, STICKER_QUIZ_LENGTH)
      : [];
    const seen = new Set<string>();
    let correct = 0;
    for (const a of rawAnswers) {
      const q = STICKER_QUESTIONS.find((x) => x.id === a.id);
      if (!q || seen.has(q.id)) continue;
      seen.add(q.id);
      if (Number(a.choice) === q.answer) correct += 1;
    }
    if (seen.size < STICKER_QUIZ_LENGTH || correct < STICKER_PASS_SCORE) {
      res.status(422).json({
        error: `Cần trả lời đúng ít nhất ${STICKER_PASS_SCORE}/${STICKER_QUIZ_LENGTH} câu để nhận quà.`,
        correct,
      });
      return;
    }

    const status = buildGiftStatus();
    if (status.remaining <= 0) {
      res.status(410).json({ error: 'Đã hết 30 suất sticker rồi 😢', soldOut: true, status });
      return;
    }

    const usedSlots = new Set(db.gifts.map((g) => g.slot));
    let slot = 1;
    while (usedSlots.has(slot)) slot += 1;
    const claim: GiftClaimRecord = {
      id: `gf-${crypto.randomBytes(5).toString('hex')}`,
      slot,
      code: generateGiftCode(slot),
      name,
      deviceId,
      playerId,
      score: correct,
      outOf: STICKER_QUIZ_LENGTH,
      createdAt: new Date().toISOString(),
      redeemedAt: null,
    };
    db.gifts.push(claim);
    saveDb();
    res.status(201).json({ claim, status: buildGiftStatus() });
  });

  // Admin: list gift claims
  app.get('/api/admin/gifts', requireAdminAuth, (_req, res) => {
    const gifts = [...db.gifts].sort((a, b) => a.slot - b.slot);
    res.json({ gifts, status: buildGiftStatus() });
  });

  // Admin: mark a gift as handed out (or undo)
  app.patch('/api/admin/gifts/:id', requireAdminAuth, (req, res) => {
    const gift = db.gifts.find((g) => g.id === req.params.id);
    if (!gift) {
      res.status(404).json({ error: 'Không tìm thấy mã quà.' });
      return;
    }
    gift.redeemedAt = req.body?.redeemed ? new Date().toISOString() : null;
    saveDb();
    res.json({ gift, status: buildGiftStatus() });
  });

  // Admin: cancel a claim (frees the slot)
  app.delete('/api/admin/gifts/:id', requireAdminAuth, (req, res) => {
    const before = db.gifts.length;
    db.gifts = db.gifts.filter((g) => g.id !== req.params.id);
    if (db.gifts.length === before) {
      res.status(404).json({ error: 'Không tìm thấy mã quà.' });
      return;
    }
    saveDb();
    res.json({ ok: true, status: buildGiftStatus() });
  });

  // Admin: change the number of gifts available
  app.post('/api/admin/gifts/config', requireAdminAuth, (req, res) => {
    const total = Math.round(Number(req.body?.total));
    if (!Number.isFinite(total) || total < db.gifts.length || total > 1000) {
      res.status(400).json({ error: `Số suất quà phải từ ${db.gifts.length} đến 1000.` });
      return;
    }
    db.giftTotal = total;
    saveDb();
    res.json({ status: buildGiftStatus() });
  });

  // Admin dashboard analytics (protected — Admin only)
  app.get('/api/admin/dashboard', requireAdminAuth, (_req, res) => {
    res.json(buildAdminDashboard());
  });

  // Admin delete insight (protected — Admin only)
  app.delete('/api/admin/insights/:id', requireAdminAuth, (req, res) => {
    const before = db.insights.length;
    db.insights = db.insights.filter((i) => i.id !== req.params.id);
    if (db.insights.length === before) {
      res.status(404).json({ error: 'Không tìm thấy insight.' });
      return;
    }
    saveDb();
    res.json({ ok: true });
  });

  // Admin CSV export (protected — Admin only, UTF-8 BOM for clean Vietnamese Excel import)
  app.get('/api/admin/export.csv', requireAdminAuth, (_req, res) => {
    const headers = [
      'ID',
      'Họ tên',
      'Nhóm tuổi',
      'Khu vực',
      'Mối quan tâm',
      'Tổng điểm',
      'Điểm Mùa Vụ Tái Sinh',
      'Điểm Thử Thách Kiến Thức',
      'Điểm Giỏ Quà Xanh',
      'Số lượt chơi',
      'Độ chính xác (%)',
      'Chân dung Bền vững',
      'Đặc sản yêu thích',
      'Sẵn sàng trả thêm (%)',
      'Yếu tố mua hàng',
      'Kênh ưa thích',
      'Hoạt động gần nhất',
    ];
    const rows = db.players.map((p) => [
      p.id,
      p.name,
      p.ageGroup,
      p.region,
      p.interest,
      p.totalScore,
      p.bestFarmScore,
      p.bestQuizScore,
      p.bestMarketScore,
      p.gamesPlayed,
      p.avgAccuracy,
      p.persona ? PERSONA_NAMES[p.persona] : '',
      p.favoriteSpecialty ?? '',
      p.wtpPremium ?? '',
      (p.buyingFactors || []).join(' | '),
      p.preferredChannel ?? '',
      p.lastActiveAt,
    ]);

    const csvBody =
      '\uFEFF' +
      [headers, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="agrinext-caobang-insights.csv"');
    res.send(csvBody);
  });

  // Mount Vite dev middleware or production static assets
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Agri-Next Vietnam server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server error:', err);
  process.exit(1);
});
