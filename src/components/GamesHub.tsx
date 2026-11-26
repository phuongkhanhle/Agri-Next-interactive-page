import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  Flame,
  Gift,
  Lock,
  QrCode,
  RotateCcw,
  ShoppingBasket,
  Sprout,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import {
  BUYING_FACTORS,
  CAO_BANG_QUIZ,
  FARM_DILEMMAS,
  MARKET_PRODUCTS,
  PERSONA_LABELS,
  PREFERRED_CHANNELS,
  WTP_TIERS,
} from '../data/agriNextContent';
import type { GameType, PlayerProfile, RegionOption, SustainabilityPersona } from '../types';
import { gameSound, getSoundMuted, setSoundMuted } from '../utils/sound';
import { launchConfetti } from '../utils/confetti';
import { BrocadeStrip, GrainMascot, LeafMascot } from './BrandAssets';
import { BADGE_CATALOG, CheckInBadgeCard } from './CheckInBadgeCard';
import type { QrTarget } from './QrPlayModal';

interface GamesHubProps {
  currentPlayer: PlayerProfile | null;
  initialGame: GameType;
  autoStart?: boolean;
  onAutoStartConsumed?: () => void;
  onOpenQrModal: (target?: QrTarget) => void;
  onGameStarted: (gameType: GameType) => void;
  onGameCompleted: (payload: {
    gameType: GameType;
    score: number;
    maxScore: number;
    accuracy: number;
    durationSec: number;
    metadata: Record<string, unknown>;
  }) => Promise<{ player?: PlayerProfile; rank?: number; totalPlayers?: number } | null>;
  onClaimName: (name: string, region: RegionOption) => Promise<void>;
  onGoLeaderboard: () => void;
}

const GAME_TABS: Array<{
  id: GameType;
  badgeId: string;
  num: string;
  title: string;
  shortDesc: string;
  whatIsIt: string;
  howToPlay: string;
  rewardHint: string;
  duration: string;
  icon: React.FC<{ className?: string }>;
}> = [
  {
    id: 'farm_sim',
    badgeId: 'badge_farm_sim',
    num: '01',
    title: 'Mùa Vụ Tái Sinh',
    shortDesc: '6 mùa vụ quyết định trên ruộng mẫu 1.000 m² Cao Bằng',
    whatIsIt:
      'Bạn hóa thân thành thủ lĩnh trẻ dẫn dắt ruộng mẫu 1.000 m² của Agri-Next tại Cao Bằng, đối mặt với 6 tình huống thực tế như đất dốc bạc màu, hạn hán thất thường, thanh niên rời bản và bảo vệ thương hiệu Hạt dẻ Trùng Khánh.',
    howToPlay:
      'Ở mỗi mùa vụ, chọn 1 trong 3 giải pháp để cân bằng 4 chỉ số: Đất & Khí hậu, Thu nhập nông hộ, Cộng đồng trẻ và Chất lượng nông sản.',
    rewardHint: 'Huy hiệu Người Gieo Hạt Tái Sinh + điểm xếp hạng',
    duration: '~2 phút · 6 tình huống',
    icon: Sprout,
  },
  {
    id: 'cao_bang_quiz',
    badgeId: 'badge_quiz',
    num: '02',
    title: 'Thử Thách Kiến Thức',
    shortDesc: '8 câu đố đặc sản & thích ứng khí hậu nhân điểm combo',
    whatIsIt:
      'Trò chơi đố vui nhanh giúp bạn khám phá câu chuyện phía sau 4 đặc sản trứ danh Cao Bằng (Hạt dẻ Trùng Khánh, Thạch đen Đông Khê, Miến dong Phia Đén, Lê Bảo Lạc) và cách nông nghiệp tái sinh thích ứng biến đổi khí hậu.',
    howToPlay:
      'Chọn đáp án đúng cho 8 câu hỏi. Trả lời đúng liên tiếp sẽ nhân điểm chuỗi (x1.25 và x1.5) và xem ngay giải thích ngắn từ Bé Hạt.',
    rewardHint: 'Huy hiệu Thông Thái Nông Sản Cao Bằng',
    duration: '~2 phút · 8 câu đố',
    icon: Compass,
  },
  {
    id: 'market_basket',
    badgeId: 'badge_market',
    num: '03',
    title: 'Khảo Sát Giỏ Quà Xanh',
    shortDesc: 'Phối đặc sản với 500.000đ ảo & chia sẻ thói quen mua sắm',
    whatIsIt:
      'Trò chơi khảo sát tương tác giúp bạn tìm hiểu sâu hơn về đặc sản Cao Bằng đồng thời chia sẻ góc nhìn tiêu dùng bền vững cho dự án Agri-Next.',
    howToPlay:
      'Bước 1: Dùng 500.000đ ngân sách ảo chọn các đặc sản bạn thích nhất. Bước 2: Trả lời 3 câu hỏi nhanh về thói quen mua nông sản xanh.',
    rewardHint: 'Huy hiệu Check-in Đại Sứ Nông Sản Xanh để tải & chia sẻ MXH',
    duration: '~90 giây · 2 bước nhanh',
    icon: ShoppingBasket,
  },
];

const BADGE_ORDER = ['badge_farm_sim', 'badge_quiz', 'badge_market', 'badge_master'];

export const GamesHub: React.FC<GamesHubProps> = ({
  currentPlayer,
  initialGame,
  autoStart = false,
  onAutoStartConsumed,
  onOpenQrModal,
  onGameStarted,
  onGameCompleted,
  onClaimName,
  onGoLeaderboard,
}) => {
  const [activeGame, setActiveGame] = useState<GameType>(initialGame);
  const [muted, setMuted] = useState<boolean>(getSoundMuted());
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [previewBadgeId, setPreviewBadgeId] = useState<string | null>(null);
  const [unlockedToast, setUnlockedToast] = useState<{ title: string; isMaster: boolean } | null>(
    null
  );
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const badgesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveGame(initialGame);
    setShowGuide(true);
  }, [initialGame]);

  useEffect(() => {
    if (autoStart) {
      onAutoStartConsumed?.();
    }
  }, [autoStart, onAutoStartConsumed]);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
  };

  const handleCompletedWithCelebration: GamesHubProps['onGameCompleted'] = async (payload) => {
    const prevBadges = new Set(currentPlayer?.badges ?? []);
    // Instant celebratory burst when finishing a game/survey
    launchConfetti('game');

    const res = await onGameCompleted(payload);
    const updatedBadges = res?.player?.badges ?? [];
    const newlyUnlocked = updatedBadges.filter((b) => !prevBadges.has(b));

    if (newlyUnlocked.includes('badge_master')) {
      launchConfetti('master');
      setUnlockedToast({
        title: BADGE_CATALOG.badge_master.title,
        isMaster: true,
      });
    } else if (newlyUnlocked.length > 0) {
      launchConfetti('badge');
      const firstBadge = BADGE_CATALOG[newlyUnlocked[0]];
      if (firstBadge) {
        setUnlockedToast({
          title: firstBadge.title,
          isMaster: false,
        });
      }
    }

    return res;
  };

  const unlockedBadges = currentPlayer?.badges ?? [];
  const activeMeta = GAME_TABS.find((t) => t.id === activeGame) ?? GAME_TABS[0];

  const handleSwitchGame = (gameId: GameType) => {
    gameSound.click();
    setPreviewBadgeId(null);
    setActiveGame(gameId);
    setShowGuide(true);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-5 sm:space-y-6">
      {/* Newly Unlocked Badge Celebration Banner */}
      {unlockedToast && (
        <div
          role="status"
          className="rounded-xl bg-[#EFF5D2] border border-[#F4991A] px-5 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-[#F4991A] shrink-0" />
            <div className="text-sm text-[#212122]">
              <span className="font-extrabold text-[#556B2F]">
                {unlockedToast.isMaster
                  ? 'Thành tựu đặc biệt! Bạn vừa mở khóa Huy hiệu tối cao: '
                  : 'Chúc mừng! Bạn vừa thu thập huy hiệu mới: '}
              </span>
              <span className="font-extrabold">{unlockedToast.title}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUnlockedToast(null)}
            className="text-xs font-bold text-[#556B2F] hover:underline cursor-pointer whitespace-nowrap"
          >
            Đóng thông báo
          </button>
        </div>
      )}

      {/* COMPACT GAME SWITCHER BAR — Keeps the active game immediately above the fold on mobile! */}
      <div className="rounded-2xl bg-[#556B2F] text-white border border-[#3E5021] overflow-hidden">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 flex flex-wrap items-center justify-between gap-3">
          {/* 3 Single-Line Game Tabs */}
          <div
            role="tablist"
            aria-label="Chọn trò chơi Agri-Next Cao Bằng"
            className="flex flex-wrap items-center gap-1.5"
          >
            {GAME_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeGame === tab.id;
              const isUnlocked = unlockedBadges.includes(tab.badgeId);
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => handleSwitchGame(tab.id)}
                  className={`min-h-[42px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#EFF5D2] text-[#212122] shadow-xs'
                      : 'bg-white/10 text-[#EFF5D2] hover:bg-white/20'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#556B2F]' : 'text-[#C6D870]'}`} />
                  <span>
                    {tab.num}. {tab.title}
                  </span>
                  {isUnlocked && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#556B2F]' : 'text-[#C6D870]'}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Utility Controls: QR, Sound, Jump to Badges */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onOpenQrModal(activeGame)}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F4991A] hover:bg-[#D9810D] text-xs font-bold text-[#212122] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <QrCode className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Mã QR</span>
            </button>

            <button
              type="button"
              onClick={toggleSound}
              className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#EFF5D2] transition-colors cursor-pointer"
              aria-label={muted ? 'Bật âm thanh trò chơi' : 'Tắt âm thanh trò chơi'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => badgesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="min-h-[40px] inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#EFF5D2] hover:bg-white text-[#212122] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Award className="w-4 h-4 text-[#556B2F] shrink-0" />
              <span className="font-mono-num text-xs font-extrabold text-[#556B2F]">
                {unlockedBadges.length}/4
              </span>
              {currentPlayer && currentPlayer.totalScore > 0 && (
                <span className="hidden sm:inline font-mono-num text-xs font-extrabold text-[#212122]">
                  · {currentPlayer.totalScore}đ
                </span>
              )}
            </button>
          </div>
        </div>
        <BrocadeStrip tone="moss" heightClass="h-3" />
      </div>

      {/* CLEAR INLINE GAME EXPLANATION CARD — Explains what this game is right before/above live play! */}
      <div className="parchment-surface rounded-2xl border border-[#556B2F]/20 overflow-hidden">
        <div className="px-5 py-3.5 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <BookOpen className="w-4 h-4 text-[#556B2F] shrink-0" />
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-extrabold text-[#212122]">
                Giới thiệu trò chơi: {activeMeta.title}
              </span>
              <span className="hidden sm:inline text-xs font-medium text-[#585A56] ml-2">
                · {activeMeta.duration} · Chơi ngay bên dưới không cần đăng nhập
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide((v) => !v)}
            className="min-h-[36px] inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[#556B2F] hover:bg-[#556B2F]/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{showGuide ? 'Thu gọn' : 'Xem giải thích'}</span>
            {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showGuide && (
          <div className="px-5 pb-4 sm:px-6 sm:pb-5 pt-2 border-t border-[#556B2F]/12 grid md:grid-cols-12 gap-4 text-xs sm:text-sm">
            <div className="md:col-span-5 space-y-1">
              <div className="text-xs font-extrabold text-[#556B2F]">Trò chơi này là gì?</div>
              <p className="text-[#212122] leading-relaxed">{activeMeta.whatIsIt}</p>
            </div>
            <div className="md:col-span-4 space-y-1">
              <div className="text-xs font-extrabold text-[#556B2F]">Cách chơi nhanh</div>
              <p className="text-[#585A56] leading-relaxed">{activeMeta.howToPlay}</p>
            </div>
            <div className="md:col-span-3 space-y-1">
              <div className="text-xs font-extrabold text-[#D9810D]">Phần thưởng hoàn thành</div>
              <div className="inline-flex items-start gap-1.5 text-[#212122] font-semibold leading-relaxed">
                <Gift className="w-4 h-4 text-[#F4991A] shrink-0 mt-0.5" />
                <span>{activeMeta.rewardHint}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ACTIVE GAME / SURVEY ARENA — Immediately playable right after scanning QR! */}
      <div ref={arenaRef} className="scroll-mt-20">
        {activeGame === 'farm_sim' && (
          <FarmSimulatorGame
            currentPlayer={currentPlayer}
            onStart={() => onGameStarted('farm_sim')}
            onComplete={handleCompletedWithCelebration}
            onClaimName={onClaimName}
            onGoLeaderboard={onGoLeaderboard}
          />
        )}

        {activeGame === 'cao_bang_quiz' && (
          <CaoBangQuizGame
            currentPlayer={currentPlayer}
            onStart={() => onGameStarted('cao_bang_quiz')}
            onComplete={handleCompletedWithCelebration}
            onClaimName={onClaimName}
            onGoLeaderboard={onGoLeaderboard}
          />
        )}

        {activeGame === 'market_basket' && (
          <MarketBasketGame
            currentPlayer={currentPlayer}
            onStart={() => onGameStarted('market_basket')}
            onComplete={handleCompletedWithCelebration}
            onClaimName={onClaimName}
            onGoLeaderboard={onGoLeaderboard}
          />
        )}
      </div>

      {/* Collectible Badges & Check-in Vault Strip (Neatly below the active game) */}
      <div
        ref={badgesRef}
        className="scroll-mt-20 parchment-surface rounded-2xl border border-[#556B2F]/20 p-5 sm:p-6 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#212122]">
              Bộ sưu tập Huy hiệu Check-in đã biết về Agri-Next
            </h2>
            <p className="text-xs text-[#585A56]">
              Hoàn thành các trò chơi hiểu về nông nghiệp Cao Bằng để mở khóa huy hiệu check-in, tải
              ảnh và chia sẻ lên mạng xã hội.
            </p>
          </div>
          {unlockedBadges.length > 0 && (
            <div className="font-mono-num text-xs font-bold text-[#556B2F]">
              Đã sưu tập: {unlockedBadges.length}/4 huy hiệu
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {BADGE_ORDER.map((bId) => {
            const meta = BADGE_CATALOG[bId];
            const owned = unlockedBadges.includes(bId);
            const selected = previewBadgeId === bId;
            return (
              <button
                key={bId}
                type="button"
                onClick={() => {
                  if (owned) {
                    gameSound.click();
                    setPreviewBadgeId(selected ? null : bId);
                  } else if (meta.gameType !== 'master') {
                    handleSwitchGame(meta.gameType);
                    arenaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  owned
                    ? selected
                      ? 'bg-[#556B2F] text-white border-[#3E5021]'
                      : 'bg-white border-[#8FA31E] hover:bg-[#F9FBF1]'
                    : 'bg-white/55 border-[#556B2F]/15 opacity-75 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    owned ? 'bg-[#EFF5D2]' : 'bg-[#E8E9EB]'
                  }`}
                >
                  {owned ? (
                    meta.mascot === 'grain' ? (
                      <GrainMascot className="w-8 h-8" />
                    ) : (
                      <LeafMascot mood="happy" className="w-8 h-8" />
                    )
                  ) : (
                    <Lock className="w-4 h-4 text-[#585A56]" />
                  )}
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-xs font-extrabold truncate ${
                      selected ? 'text-white' : 'text-[#212122]'
                    }`}
                  >
                    {meta.title}
                  </div>
                  <div
                    className={`text-[11px] font-semibold mt-0.5 ${
                      selected
                        ? 'text-[#C6D870]'
                        : owned
                          ? 'text-[#556B2F]'
                          : 'text-[#585A56]'
                    }`}
                  >
                    {owned ? 'Bấm để xem thẻ check-in' : 'Chơi để mở khóa'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Inline Re-openable Check-in Card when clicking any earned badge */}
        {previewBadgeId && currentPlayer && (
          <div className="pt-2">
            <CheckInBadgeCard
              badgeId={previewBadgeId}
              scoreLabel={`Tổng điểm tích lũy: ${currentPlayer.totalScore.toLocaleString('vi-VN')} điểm`}
              highlightDetail={`Đã mở khóa ${currentPlayer.badges.length}/4 huy hiệu Agri-Next Cao Bằng`}
              player={currentPlayer}
              onClaimName={onClaimName}
              onGoLeaderboard={onGoLeaderboard}
            />
          </div>
        )}
      </div>
    </section>
  );
};

/* ============================================================================
   GAME 1: MÙA VỤ TÁI SINH (6-Season Climate-Smart Farm Decision Simulator)
   ============================================================================ */
interface SingleGameProps {
  currentPlayer: PlayerProfile | null;
  autoStart?: boolean;
  onAutoStartConsumed?: () => void;
  onStart: () => void;
  onComplete: GamesHubProps['onGameCompleted'];
  onClaimName: (name: string, region: RegionOption) => Promise<void>;
  onGoLeaderboard: () => void;
}

const FarmSimulatorGame: React.FC<SingleGameProps> = ({
  currentPlayer,
  onStart,
  onComplete,
  onClaimName,
  onGoLeaderboard,
}) => {
  const [state, setState] = useState<'PLAYING' | 'RESULT'>('PLAYING');
  const [seasonIdx, setSeasonIdx] = useState(0);
  const [meters, setMeters] = useState({ soil: 55, income: 55, community: 55, quality: 55 });
  const [lastOutcome, setLastOutcome] = useState<{
    note: string;
    effects: { soil: number; income: number; community: number; quality: number };
  } | null>(null);
  const [choicesLog, setChoicesLog] = useState<
    Array<{ dilemmaId: string; choiceId: string; tag: SustainabilityPersona }>
  >([]);
  const [rankResult, setRankResult] = useState<{ rank?: number; totalPlayers?: number } | null>(
    null
  );
  const [latestPlayer, setLatestPlayer] = useState<PlayerProfile | null>(currentPlayer);
  const startTimeRef = useRef<number>(Date.now());
  const startedOnce = useRef(false);

  useEffect(() => {
    if (currentPlayer) setLatestPlayer(currentPlayer);
  }, [currentPlayer]);

  const startGame = () => {
    gameSound.select();
    setState('PLAYING');
    setSeasonIdx(0);
    setMeters({ soil: 55, income: 55, community: 55, quality: 55 });
    setLastOutcome(null);
    setChoicesLog([]);
    setRankResult(null);
    startTimeRef.current = Date.now();
    startedOnce.current = true;
    onStart();
  };

  const clampMeter = (v: number) => Math.max(0, Math.min(100, v));
  const currentDilemma = FARM_DILEMMAS[seasonIdx];

  const handleChoose = (choiceIdx: number) => {
    if (lastOutcome) return;
    if (!startedOnce.current) {
      startedOnce.current = true;
      startTimeRef.current = Date.now();
      onStart();
    }
    const choice = currentDilemma.choices[choiceIdx];
    const positiveTotal =
      choice.effects.soil + choice.effects.income + choice.effects.community + choice.effects.quality;
    if (positiveTotal >= 20) gameSound.correct();
    else gameSound.select();

    setMeters((prev) => ({
      soil: clampMeter(prev.soil + choice.effects.soil),
      income: clampMeter(prev.income + choice.effects.income),
      community: clampMeter(prev.community + choice.effects.community),
      quality: clampMeter(prev.quality + choice.effects.quality),
    }));
    setChoicesLog((prev) => [
      ...prev,
      { dilemmaId: currentDilemma.id, choiceId: choice.id, tag: choice.tag },
    ]);
    setLastOutcome({ note: choice.outcomeNote, effects: choice.effects });
  };

  const computeDominantPersona = (
    log: Array<{ tag: SustainabilityPersona }>
  ): SustainabilityPersona => {
    const counts: Record<SustainabilityPersona, number> = {
      eco_guardian: 0,
      market_builder: 0,
      community_weaver: 0,
      agri_innovator: 0,
    };
    for (const entry of log) counts[entry.tag] += 1;
    return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      'eco_guardian') as SustainabilityPersona;
  };

  const handleNextSeason = async () => {
    gameSound.click();
    if (seasonIdx < FARM_DILEMMAS.length - 1) {
      setSeasonIdx((s) => s + 1);
      setLastOutcome(null);
      return;
    }

    gameSound.harvest();
    setState('RESULT');
    const avgMeter = Math.round(
      (meters.soil + meters.income + meters.community + meters.quality) / 4
    );
    const balanceBonus =
      Math.min(meters.soil, meters.income, meters.community, meters.quality) >= 65 ? 120 : 40;
    const finalScore = Math.min(680, Math.round(avgMeter * 5.6 + balanceBonus));
    const dominantPersona = computeDominantPersona(choicesLog);
    const durationSec = Math.max(5, Math.round((Date.now() - startTimeRef.current) / 1000));

    const res = await onComplete({
      gameType: 'farm_sim',
      score: finalScore,
      maxScore: 680,
      accuracy: avgMeter,
      durationSec,
      metadata: {
        persona: dominantPersona,
        dilemmaChoices: choicesLog,
      },
    });
    if (res?.player) setLatestPlayer(res.player);
    setRankResult(res);
  };

  const avgMeter = Math.round(
    (meters.soil + meters.income + meters.community + meters.quality) / 4
  );
  const balanceBonus =
    Math.min(meters.soil, meters.income, meters.community, meters.quality) >= 65 ? 120 : 40;
  const finalScore = Math.min(680, Math.round(avgMeter * 5.6 + balanceBonus));
  const dominantPersona = computeDominantPersona(choicesLog);
  const personaMeta = PERSONA_LABELS[dominantPersona];

  const meterList = [
    { key: 'soil', label: 'Đất & Khí hậu', val: meters.soil, color: '#556B2F' },
    { key: 'income', label: 'Thu nhập nông hộ', val: meters.income, color: '#F4991A' },
    { key: 'community', label: 'Cộng đồng trẻ', val: meters.community, color: '#8FA31E' },
    { key: 'quality', label: 'Chất lượng nông sản', val: meters.quality, color: '#3E5021' },
  ] as const;

  const meterStatusText = (val: number) =>
    val >= 75 ? 'Vững mạnh' : val >= 50 ? 'Ổn định' : 'Cần cải thiện';

  return (
    <div className="rounded-2xl overflow-hidden border border-[#556B2F]/20 bg-white">
      <div className="relative h-44 sm:h-52 w-full bg-[#EFF5D2] overflow-hidden">
        <img
          src="/src/assets/images/game_farm_backdrop_1795619411591.jpg"
          alt="Bản đồ mô phỏng ruộng mẫu 1000m2 tại thung lũng núi Cao Bằng"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#212122]/85 via-[#212122]/35 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex flex-wrap items-end justify-between gap-4 text-white">
          <div>
            <div className="text-xs font-semibold text-[#C6D870]">
              Mô phỏng Quản trị Ruộng mẫu 1.000 m² · Cao Bằng
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold mt-0.5">
              {state === 'PLAYING'
                ? currentDilemma.seasonTitle
                : 'Hoàn thành 1 năm canh tác tái sinh tại Cao Bằng'}
            </h2>
          </div>
          {state === 'PLAYING' && (
            <div className="font-mono-num text-xs sm:text-sm font-bold text-[#EFF5D2]">
              Mùa {seasonIdx + 1} / {FARM_DILEMMAS.length}
            </div>
          )}
        </div>
      </div>

      {state === 'PLAYING' && (
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-5 border-b border-[#556B2F]/15">
            {meterList.map((m) => {
              const delta = lastOutcome?.effects[m.key];
              return (
                <div key={m.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#212122]">
                    <span>{m.label}</span>
                    <span className="font-mono-num">
                      {m.val}/100
                      {typeof delta === 'number' && delta !== 0 && (
                        <span className={`ml-1 ${delta > 0 ? 'text-[#556B2F]' : 'text-red-600'}`}>
                          ({delta > 0 ? `+${delta}` : delta})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#E8E9EB] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${m.val}%`, backgroundColor: m.color }}
                    />
                  </div>
                  <div className="text-[11px] font-medium text-[#585A56]">
                    Trạng thái: {meterStatusText(m.val)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="parchment-surface rounded-xl p-5 sm:p-6 border border-[#556B2F]/15 flex flex-col sm:flex-row items-start gap-4">
            <LeafMascot mood={lastOutcome ? 'happy' : 'curious'} className="w-16 h-16 shrink-0" />
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#556B2F]">{currentDilemma.location}</div>
              <p className="text-sm sm:text-base font-semibold text-[#212122] leading-relaxed">
                {currentDilemma.situation}
              </p>
              <p className="text-xs text-[#585A56] italic">
                Gợi ý từ Bé Mầm: “{currentDilemma.mascotHint}”
              </p>
            </div>
          </div>

          {!lastOutcome ? (
            <div className="grid md:grid-cols-3 gap-3.5 sm:gap-4">
              {currentDilemma.choices.map((ch, idx) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleChoose(idx)}
                  className="text-left min-h-[120px] p-4 sm:p-5 rounded-xl border border-[#556B2F]/20 hover:border-[#556B2F] hover:bg-[#EFF5D2]/50 active:scale-[0.98] transition-all flex flex-col justify-between space-y-3 cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="font-mono-num text-xs font-bold text-[#8FA31E]">
                      Phương án 0{idx + 1}
                    </div>
                    <div className="font-bold text-sm sm:text-base text-[#212122] leading-snug">
                      {ch.label}
                    </div>
                    <p className="text-xs text-[#585A56] leading-relaxed">{ch.detail}</p>
                  </div>
                  <div className="text-xs font-bold text-[#556B2F] inline-flex items-center gap-1 pt-2">
                    <span>Chọn giải pháp này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-[#556B2F] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#C6D870]">Kết quả mùa vụ</div>
                <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
                  {lastOutcome.note}
                </p>
              </div>
              <button
                type="button"
                onClick={handleNextSeason}
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F4991A] hover:bg-[#D9810D] active:scale-[0.98] text-[#212122] font-bold text-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>
                  {seasonIdx < FARM_DILEMMAS.length - 1
                    ? 'Sang mùa vụ tiếp theo'
                    : 'Nhận Huy hiệu Check-in'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {state === 'RESULT' && (
        <div className="p-6 sm:p-8 space-y-6">
          <CheckInBadgeCard
            badgeId="badge_farm_sim"
            scoreLabel={`Điểm Mùa Vụ Tái Sinh: ${finalScore} / 680 · Cân bằng ${avgMeter}/100`}
            highlightDetail={`Chân dung của bạn: ${personaMeta.title} — ${personaMeta.subtitle}`}
            player={latestPlayer}
            rankInfo={rankResult}
            onClaimName={onClaimName}
            onGoLeaderboard={onGoLeaderboard}
          />
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={startGame}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#556B2F]/25 text-[#556B2F] hover:bg-[#EFF5D2] font-bold text-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại Mùa Vụ Tái Sinh</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   GAME 2: THỬ THÁCH NÔNG SẢN CAO BẰNG (Timed Quiz + Combo + Knowledge Gaps)
   ============================================================================ */
const CaoBangQuizGame: React.FC<SingleGameProps> = ({
  currentPlayer,
  onStart,
  onComplete,
  onClaimName,
  onGoLeaderboard,
}) => {
  const [state, setState] = useState<'PLAYING' | 'RESULT'>('PLAYING');
  const [qIdx, setQIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [topicResults, setTopicResults] = useState<Array<{ topic: string; correct: boolean }>>([]);
  const [rankResult, setRankResult] = useState<{ rank?: number; totalPlayers?: number } | null>(
    null
  );
  const [latestPlayer, setLatestPlayer] = useState<PlayerProfile | null>(currentPlayer);
  const startTimeRef = useRef<number>(Date.now());
  const startedOnce = useRef(false);

  useEffect(() => {
    if (currentPlayer) setLatestPlayer(currentPlayer);
  }, [currentPlayer]);

  const startQuiz = () => {
    gameSound.select();
    setState('PLAYING');
    setQIdx(0);
    setSelectedIdx(null);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setTopicResults([]);
    setRankResult(null);
    startTimeRef.current = Date.now();
    startedOnce.current = true;
    onStart();
  };

  const currentQ = CAO_BANG_QUIZ[qIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedIdx !== null) return;
    if (!startedOnce.current) {
      startedOnce.current = true;
      startTimeRef.current = Date.now();
      onStart();
    }
    setSelectedIdx(idx);
    const isCorrect = idx === currentQ.correctIndex;
    const nextStreak = isCorrect ? streak + 1 : 0;
    const multiplier = nextStreak >= 4 ? 1.5 : nextStreak >= 2 ? 1.25 : 1;
    const earned = isCorrect ? Math.round(75 * multiplier) : 0;

    if (isCorrect) {
      gameSound.correct();
      setScore((s) => s + earned);
      setCorrectCount((c) => c + 1);
    } else {
      gameSound.wrong();
    }
    setStreak(nextStreak);
    setTopicResults((prev) => [...prev, { topic: currentQ.topic, correct: isCorrect }]);
  };

  const handleNext = async () => {
    gameSound.click();
    if (qIdx < CAO_BANG_QUIZ.length - 1) {
      setQIdx((i) => i + 1);
      setSelectedIdx(null);
      return;
    }

    gameSound.harvest();
    setState('RESULT');
    const accuracy = Math.round((correctCount / CAO_BANG_QUIZ.length) * 100);
    const durationSec = Math.max(5, Math.round((Date.now() - startTimeRef.current) / 1000));

    const res = await onComplete({
      gameType: 'cao_bang_quiz',
      score,
      maxScore: 800,
      accuracy,
      durationSec,
      metadata: {
        quizTopics: topicResults,
      },
    });
    if (res?.player) setLatestPlayer(res.player);
    setRankResult(res);
  };

  return (
    <div className="rounded-2xl border border-[#556B2F]/20 bg-white overflow-hidden">

      {state === 'PLAYING' && (
        <div className="p-6 sm:p-9 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#556B2F]/15">
            <div className="text-xs sm:text-sm font-bold text-[#556B2F]">
              Câu {qIdx + 1}/{CAO_BANG_QUIZ.length} · {currentQ.topic}
            </div>
            <div className="flex items-center gap-5 text-xs sm:text-sm font-bold">
              <div className="inline-flex items-center gap-1.5 text-[#D9810D]">
                <Flame className="w-4 h-4" />
                <span className="font-mono-num">Chuỗi x{streak}</span>
              </div>
              <div className="font-mono-num text-[#556B2F]">{score} điểm</div>
            </div>
          </div>

          <div className="h-2 rounded-full bg-[#EFF5D2] overflow-hidden">
            <div
              className="h-full bg-[#8FA31E] transition-all duration-300"
              style={{ width: `${((qIdx + 1) / CAO_BANG_QUIZ.length) * 100}%` }}
            />
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-[#212122] leading-snug">
            {currentQ.question}
          </h3>

          <div className="grid sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let cardClass =
                'border-[#556B2F]/20 bg-white hover:border-[#556B2F] hover:bg-[#EFF5D2]/40 text-[#212122]';
              if (selectedIdx !== null) {
                if (isCorrect) {
                  cardClass = 'border-[#556B2F] bg-[#EFF5D2] text-[#212122]';
                } else if (isSelected) {
                  cardClass = 'border-red-500 bg-red-50 text-red-900';
                } else {
                  cardClass = 'border-[#E8E9EB] bg-[#F9FBF1] text-[#585A56] opacity-70';
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={selectedIdx !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`text-left min-h-[56px] p-4 sm:p-5 rounded-xl border font-semibold text-sm active:scale-[0.98] transition-all flex items-start justify-between gap-3 cursor-pointer disabled:cursor-default ${cardClass}`}
                >
                  <span>
                    <span className="font-mono-num text-xs font-bold text-[#8FA31E] mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </span>
                  {selectedIdx !== null && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-[#556B2F] shrink-0" />
                  )}
                  {selectedIdx !== null && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedIdx !== null && (
            <div className="rounded-xl bg-[#556B2F] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <GrainMascot className="w-12 h-12 shrink-0 hidden sm:block" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#C6D870]">
                    {selectedIdx === currentQ.correctIndex
                      ? 'Chính xác! Bé Hạt giải thích thêm:'
                      : 'Chưa đúng rồi! Kiến thức cần nhớ:'}
                  </div>
                  <p className="text-sm text-[#EFF5D2] leading-relaxed">{currentQ.explanation}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F4991A] hover:bg-[#D9810D] active:scale-[0.98] text-[#212122] font-bold text-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>
                  {qIdx < CAO_BANG_QUIZ.length - 1 ? 'Câu tiếp theo' : 'Nhận Huy hiệu Check-in'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {state === 'RESULT' && (
        <div className="p-6 sm:p-8 space-y-6">
          <CheckInBadgeCard
            badgeId="badge_quiz"
            scoreLabel={`Điểm Thử Thách: ${score} điểm · Trả lời đúng ${correctCount}/${CAO_BANG_QUIZ.length} câu (${Math.round((correctCount / CAO_BANG_QUIZ.length) * 100)}%)`}
            highlightDetail="Kiến thức của bạn đã góp phần hoàn thiện Bản đồ Nhận thức Nông nghiệp Cao Bằng!"
            player={latestPlayer}
            rankInfo={rankResult}
            onClaimName={onClaimName}
            onGoLeaderboard={onGoLeaderboard}
          />
          <div>
            <button
              type="button"
              onClick={startQuiz}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#556B2F]/25 text-[#556B2F] hover:bg-[#EFF5D2] font-bold text-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại để phá kỷ lục</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   GAME 3: KHẢO SÁT GIỎ QUÀ XANH & GÓC NHÌN THỊ TRƯỜNG (Survey + Check-in Reward)
   ============================================================================ */
const VIRTUAL_BUDGET = 500000;

const MarketBasketGame: React.FC<SingleGameProps> = ({
  currentPlayer,
  onStart,
  onComplete,
  onClaimName,
  onGoLeaderboard,
}) => {
  const [step, setStep] = useState<'BASKET' | 'INSIGHTS' | 'DONE'>('BASKET');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [buyingFactors, setBuyingFactors] = useState<string[]>([BUYING_FACTORS[0]]);
  const [wtpPremium, setWtpPremium] = useState<number>(20);
  const [preferredChannel, setPreferredChannel] = useState<string>(PREFERRED_CHANNELS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [rankResult, setRankResult] = useState<{ rank?: number; totalPlayers?: number } | null>(
    null
  );
  const [latestPlayer, setLatestPlayer] = useState<PlayerProfile | null>(currentPlayer);
  const startTimeRef = useRef<number>(Date.now());
  const startedOnce = useRef(false);

  useEffect(() => {
    if (currentPlayer) setLatestPlayer(currentPlayer);
  }, [currentPlayer]);

  const selectedItems = MARKET_PRODUCTS.filter((p) => selectedIds.includes(p.id));
  const totalSpent = selectedItems.reduce((sum, item) => sum + item.priceVnd, 0);
  const remaining = VIRTUAL_BUDGET - totalSpent;

  const toggleProduct = (id: string, price: number) => {
    if (!startedOnce.current) {
      startedOnce.current = true;
      startTimeRef.current = Date.now();
      onStart();
    }
    if (selectedIds.includes(id)) {
      gameSound.click();
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } else if (totalSpent + price <= VIRTUAL_BUDGET) {
      gameSound.select();
      setSelectedIds((prev) => [...prev, id]);
    } else {
      gameSound.wrong();
    }
  };

  const toggleFactor = (factor: string) => {
    gameSound.click();
    setBuyingFactors((prev) =>
      prev.includes(factor)
        ? prev.length > 1
          ? prev.filter((f) => f !== factor)
          : prev
        : prev.length < 3
          ? [...prev, factor]
          : prev
    );
  };

  const handleFinish = async () => {
    gameSound.harvest();
    setSubmitting(true);
    const durationSec = Math.max(5, Math.round((Date.now() - startTimeRef.current) / 1000));
    const res = await onComplete({
      gameType: 'market_basket',
      score: 250,
      maxScore: 250,
      accuracy: 100,
      durationSec,
      metadata: {
        selectedProducts: selectedItems.map((i) => i.name),
        totalSpent,
        wtpPremium,
        buyingFactors,
        preferredChannel,
      },
    });
    if (res?.player) setLatestPlayer(res.player);
    setRankResult(res);
    setSubmitting(false);
    setStep('DONE');
  };

  const handleReset = () => {
    setStep('BASKET');
    setSelectedIds([]);
    startTimeRef.current = Date.now();
  };

  return (
    <div className="rounded-2xl border border-[#556B2F]/20 bg-white overflow-hidden">
      <div className="parchment-surface p-6 sm:p-7 border-b border-[#556B2F]/15 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#556B2F]">
            Khám phá đặc sản Cao Bằng & mở khóa Huy hiệu Check-in chia sẻ MXH · +250 điểm
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#212122] mt-0.5">
            {step === 'BASKET'
              ? 'Bước 1/2: Tự phối Giỏ Quà Xanh Cao Bằng với 500.000đ ảo'
              : step === 'INSIGHTS'
                ? 'Bước 2/2: 3 câu hỏi nhanh về thói quen mua nông sản xanh'
                : 'Chúc mừng! Bạn đã mở khóa Huy hiệu Đại Sứ Nông Sản Xanh'}
          </h2>
        </div>

        {step === 'BASKET' && (
          <div className="text-right">
            <div className="text-xs font-semibold text-[#585A56]">Ngân sách ảo còn lại</div>
            <div className="font-mono-num text-2xl font-extrabold text-[#556B2F]">
              {remaining.toLocaleString('vi-VN')}đ
            </div>
          </div>
        )}
      </div>

      {step === 'BASKET' && (
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MARKET_PRODUCTS.map((item) => {
              const selected = selectedIds.includes(item.id);
              const cantAfford = !selected && item.priceVnd > remaining;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={cantAfford}
                  onClick={() => toggleProduct(item.id, item.priceVnd)}
                  className={`text-left p-5 rounded-xl border transition-all flex flex-col justify-between space-y-3 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                    selected
                      ? 'border-[#556B2F] bg-[#EFF5D2] shadow-sm'
                      : 'border-[#556B2F]/18 bg-white hover:border-[#8FA31E]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#585A56]">
                      <span>{item.origin}</span>
                      {selected && <Check className="w-4 h-4 text-[#556B2F] shrink-0" />}
                    </div>
                    <div className="font-extrabold text-sm sm:text-base text-[#212122]">
                      {item.name}
                    </div>
                    <p className="text-xs text-[#585A56] leading-relaxed">{item.description}</p>
                    <div className="text-[11px] font-semibold text-[#556B2F] pt-1">
                      Tác động xanh: {item.ecoImpact}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#556B2F]/12 flex items-center justify-between">
                    <span className="font-mono-num font-bold text-sm text-[#212122]">
                      {item.priceVnd.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-xs font-bold text-[#556B2F]">
                      {selected ? 'Đã chọn' : cantAfford ? 'Vượt ngân sách' : '+ Thêm vào giỏ'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#556B2F]/15 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-[#585A56]">
              Đã chọn <strong className="text-[#212122]">{selectedItems.length}</strong> sản phẩm ·
              Tổng giá trị{' '}
              <strong className="font-mono-num text-[#556B2F]">
                {totalSpent.toLocaleString('vi-VN')}đ
              </strong>
            </div>
            <button
              type="button"
              disabled={selectedItems.length === 0}
              onClick={() => {
                gameSound.select();
                setStep('INSIGHTS');
              }}
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F4991A] hover:bg-[#D9810D] active:scale-[0.98] disabled:opacity-45 text-[#212122] font-bold text-sm transition-all cursor-pointer"
            >
              <span>Tiếp tục bước 2 (3 câu hỏi nhanh)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 'INSIGHTS' && (
        <div className="p-6 sm:p-8 space-y-7">
          <div className="space-y-3">
            <div className="text-sm font-extrabold text-[#212122]">
              1. Chọn tối đa 3 yếu tố quan trọng nhất khi bạn mua nông sản đặc sản vùng cao:
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {BUYING_FACTORS.map((factor) => {
                const active = buyingFactors.includes(factor);
                return (
                  <button
                    key={factor}
                    type="button"
                    onClick={() => toggleFactor(factor)}
                    className={`text-left px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'border-[#556B2F] bg-[#556B2F] text-white'
                        : 'border-[#556B2F]/20 bg-white text-[#212122] hover:bg-[#EFF5D2]/50'
                    }`}
                  >
                    {factor}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-extrabold text-[#212122]">
              2. Với nông sản Cao Bằng canh tác tái sinh, minh bạch nguồn gốc, bạn sẵn sàng chi trả
              thêm bao nhiêu?
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {WTP_TIERS.map((tier) => {
                const active = wtpPremium === tier.value;
                return (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => {
                      gameSound.click();
                      setWtpPremium(tier.value);
                    }}
                    className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      active
                        ? 'border-[#F4991A] bg-[#EFF5D2] text-[#212122]'
                        : 'border-[#556B2F]/20 bg-white hover:bg-[#F9FBF1]'
                    }`}
                  >
                    <div className="font-bold text-sm text-[#556B2F]">{tier.label}</div>
                    <p className="text-xs text-[#585A56] mt-1">{tier.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-extrabold text-[#212122]">
              3. Bạn thường biết đến và muốn đặt mua nông sản Agri-Next qua kênh nào nhất?
            </div>
            <div className="flex flex-wrap gap-2.5">
              {PREFERRED_CHANNELS.map((ch) => {
                const active = preferredChannel === ch;
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => {
                      gameSound.click();
                      setPreferredChannel(ch);
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'border-[#556B2F] bg-[#556B2F] text-white'
                        : 'border-[#556B2F]/20 bg-white text-[#212122] hover:bg-[#EFF5D2]/50'
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#556B2F]/15 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep('BASKET')}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl border border-[#556B2F]/25 text-xs sm:text-sm font-semibold text-[#556B2F] hover:bg-[#EFF5D2] cursor-pointer"
            >
              Quay lại giỏ hàng
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={handleFinish}
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F4991A] hover:bg-[#D9810D] active:scale-[0.98] text-[#212122] font-bold text-sm transition-all cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>{submitting ? 'Đang mở khóa huy hiệu...' : 'Hoàn tất & Nhận Huy hiệu Check-in'}</span>
            </button>
          </div>
        </div>
      )}

      {step === 'DONE' && (
        <div className="p-6 sm:p-8 space-y-6">
          <CheckInBadgeCard
            badgeId="badge_market"
            scoreLabel={`Điểm khám phá: +250 điểm · Giỏ đặc sản ${totalSpent.toLocaleString('vi-VN')}đ`}
            highlightDetail="Cảm ơn bạn đã tìm hiểu đặc sản Cao Bằng cùng Agri-Next! Lưu ảnh huy hiệu check-in và chia sẻ ngay lên mạng xã hội nhé."
            player={latestPlayer}
            rankInfo={rankResult}
            onClaimName={onClaimName}
            onGoLeaderboard={onGoLeaderboard}
          />
          <div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#556B2F]/25 text-[#556B2F] hover:bg-[#EFF5D2] font-bold text-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Phối lại giỏ quà mới</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
