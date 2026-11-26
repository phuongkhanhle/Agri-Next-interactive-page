import React, { useCallback, useEffect, useState } from 'react';
import { BookOpen, Compass, Gamepad2, Gift, Leaf, Menu, Trophy, X } from 'lucide-react';
import type { GameType, GiftStatus, PlayerProfile, RegionOption } from './types';
import {
  AgriNextLogo,
  BrocadeStrip,
  SOCIAL_LINKS,
  SocialDiamondIcon,
  Youth4ClimateLogo,
} from './components/BrandAssets';
import { LandingSection } from './components/LandingSection';
import { GamesHub } from './components/GamesHub';
import { LeaderboardSection } from './components/LeaderboardSection';
import { CommunityInsightsSection } from './components/CommunityInsightsSection';
import { AdminDashboard } from './components/AdminDashboard';
import { QrPlayModal, type QrTarget } from './components/QrPlayModal';
import { BoothPresentationMode } from './components/BoothPresentationMode';
import { ProjectShowcase } from './components/ProjectShowcase';
import { StickerHunt } from './components/StickerHunt';
import type { ShowcaseSectionId } from './data/projectShowcase';

type ViewKey = 'landing' | 'project' | 'sticker' | 'games' | 'leaderboard' | 'insights' | 'admin';

const VALID_VIEWS: ViewKey[] = ['landing', 'project', 'sticker', 'games', 'leaderboard', 'insights', 'admin'];
const VALID_GAMES: GameType[] = ['farm_sim', 'cao_bang_quiz', 'market_basket'];

const NAV_ITEMS: Array<{ id: ViewKey; label: string }> = [
  { id: 'landing', label: 'Trang chủ' },
  { id: 'project', label: 'Dự án' },
  { id: 'sticker', label: 'Săn Sticker' },
  { id: 'games', label: 'Mini-game' },
  { id: 'leaderboard', label: 'Xếp hạng' },
  { id: 'insights', label: 'Góc nhìn' },
];

const MOBILE_BOTTOM_TABS: Array<{
  id: ViewKey;
  label: string;
  icon: React.FC<{ className?: string }>;
}> = [
  { id: 'landing', label: 'Trang chủ', icon: Leaf },
  { id: 'project', label: 'Dự án', icon: BookOpen },
  { id: 'sticker', label: 'Săn quà', icon: Gift },
  { id: 'games', label: 'Mini-game', icon: Gamepad2 },
  { id: 'leaderboard', label: 'Xếp hạng', icon: Trophy },
];

function getInitialRouteFromUrl(): {
  view: ViewKey;
  game: GameType;
  autoplay: boolean;
} {
  if (typeof window === 'undefined') {
    return { view: 'landing', game: 'farm_sim', autoplay: false };
  }
  const params = new URLSearchParams(window.location.search);
  const rawView = params.get('view') as ViewKey | null;
  const rawGame = params.get('game') as GameType | null;
  const autoplay = params.get('autoplay') === '1';

  const game = rawGame && VALID_GAMES.includes(rawGame) ? rawGame : 'farm_sim';
  const view =
    rawView && VALID_VIEWS.includes(rawView)
      ? rawView
      : rawGame && VALID_GAMES.includes(rawGame)
        ? 'games'
        : 'landing';

  return { view, game, autoplay };
}

function getOrCreateDeviceId(): string {
  const key = 'agrinext_device_id';
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = `dev-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `dev-${Math.random().toString(36).slice(2, 12)}${Date.now().toString(36)}`;
  }
}

function getOrCreateSessionId(): string {
  const key = 'agrinext_session_id';
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = `sess-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

export default function App() {
  const initialRoute = getInitialRouteFromUrl();
  const [activeView, setActiveView] = useState<ViewKey>(initialRoute.view);
  const [initialGame, setInitialGame] = useState<GameType>(initialRoute.game);
  const [autoStartGame, setAutoStartGame] = useState<boolean>(initialRoute.autoplay);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrTarget, setQrTarget] = useState<QrTarget>('games');
  const [boothModeOpen, setBoothModeOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('mode') === 'booth';
  });

  const [sessionId] = useState<string>(() => getOrCreateSessionId());
  const [deviceId] = useState<string>(() => getOrCreateDeviceId());
  const [giftStatus, setGiftStatus] = useState<GiftStatus | null>(null);
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerProfile | null>(null);
  const [leaderboardTick, setLeaderboardTick] = useState(0);
  const [communityStats, setCommunityStats] = useState({
    totalPlayers: 10,
    totalSessions: 12,
    totalInsights: 4,
  });

  // Automatically restore anonymous/claimed progress from browser storage (no login screen!)
  useEffect(() => {
    const savedId = localStorage.getItem('agrinext_player_id');
    if (savedId) {
      fetch(`/api/players/${encodeURIComponent(savedId)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.player) setCurrentPlayer(data.player);
        })
        .catch(() => {});
    }
  }, []);

  const refreshPublicStats = useCallback(() => {
    fetch('/api/insights/public')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setCommunityStats({
            totalPlayers: data.totalPlayers ?? 0,
            totalSessions: data.totalSessions ?? 0,
            totalInsights: data.totalInsights ?? 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshPublicStats();
  }, [refreshPublicStats]);

  // Live counter of remaining booth stickers (refreshes every 15s)
  useEffect(() => {
    const load = () =>
      fetch('/api/gifts/status')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => data && setGiftStatus(data))
        .catch(() => {});
    load();
    const t = window.setInterval(load, 15000);
    return () => window.clearInterval(t);
  }, []);

  const trackEvent = useCallback(
    (
      eventType:
        | 'page_view'
        | 'crop_explored'
        | 'game_started'
        | 'game_completed'
        | 'insight_submitted'
        | 'social_clicked',
      target: string
    ) => {
      fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          playerId: currentPlayer?.id ?? null,
          eventType,
          target,
        }),
      }).catch(() => {});
    },
    [sessionId, currentPlayer?.id]
  );

  useEffect(() => {
    trackEvent('page_view', activeView);
    if (!pendingAnchor) window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, trackEvent]);

  useEffect(() => {
    if (!pendingAnchor) return;
    const t = window.setTimeout(() => {
      document.getElementById(pendingAnchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPendingAnchor(null);
    }, 80);
    return () => window.clearTimeout(t);
  }, [pendingAnchor, activeView]);

  const navigateTo = (view: ViewKey, anchor?: string) => {
    if (anchor) setPendingAnchor(anchor);
    setActiveView(view);
    setMobileMenuOpen(false);
    try {
      const nextUrl = view === 'landing' ? window.location.pathname : `${window.location.pathname}?view=${view}`;
      window.history.replaceState(null, '', nextUrl);
    } catch {
      // Ignore history API restrictions in sandboxed contexts
    }
  };

  const handleStartGames = (game?: GameType) => {
    if (game) setInitialGame(game);
    setAutoStartGame(false);
    navigateTo('games');
  };

  const openQrModal = (target: QrTarget = 'games') => {
    setQrTarget(target);
    setQrModalOpen(true);
  };

  // Auto-save game/survey completion immediately without requiring login
  const handleGameCompleted = async (payload: {
    gameType: GameType;
    score: number;
    maxScore: number;
    accuracy: number;
    durationSec: number;
    metadata: Record<string, unknown>;
  }) => {
    try {
      const res = await fetch('/api/games/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: currentPlayer?.id ?? localStorage.getItem('agrinext_player_id') ?? undefined,
          ...payload,
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.player) {
        setCurrentPlayer(data.player);
        localStorage.setItem('agrinext_player_id', data.player.id);
      }
      setLeaderboardTick((t) => t + 1);
      refreshPublicStats();
      return {
        player: data.player as PlayerProfile,
        rank: data.rank as number,
        totalPlayers: data.totalPlayers as number,
      };
    } catch {
      return null;
    }
  };

  // Optional 1-line name claim directly on the Check-in Badge Card
  const handleClaimPlayerName = async (name: string, region: RegionOption) => {
    const id = currentPlayer?.id ?? localStorage.getItem('agrinext_player_id');
    if (!id) return;
    try {
      const res = await fetch(`/api/players/${encodeURIComponent(id)}/claim`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, region }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.player) {
        setCurrentPlayer(data.player);
        setLeaderboardTick((t) => t + 1);
      }
    } catch {
      // Ignore transient error
    }
  };

  const giftsLeft = giftStatus?.remaining ?? null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBF1] text-[#212122] pb-16 md:pb-0">
      {/* TOP BAR CONTRACT: Strictly 1 row, 3 zones separated by gap-8 (Zero Login UI!) */}
      <header className="sticky top-0 z-40 bg-[#F9FBF1]/95 backdrop-blur-sm border-b border-[#556B2F]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => navigateTo('landing')}
            className="text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#556B2F] rounded-lg"
            aria-label="Agri-Next Vietnam Trang chủ"
          >
            <AgriNextLogo variant="horizontal" color="olive" />
          </button>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav
            aria-label="Điều hướng chính"
            className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-semibold"
          >
            {NAV_ITEMS.map((item) => {
              const active = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    active
                      ? 'text-[#556B2F] border-[#8FA31E]'
                      : 'text-[#585A56] border-transparent hover:text-[#212122] hover:border-[#C6D870]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action Button — Frictionless Badge & Check-in CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('sticker')}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-[#F4991A] hover:bg-[#D9810D] text-[#212122] text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Gift className="w-4 h-4 shrink-0" />
              <span>
                Săn Sticker
                {giftsLeft !== null && (
                  <span className="ml-1.5 font-mono-num">
                    · {giftsLeft}/{giftStatus?.total}
                  </span>
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-[#556B2F] hover:bg-[#EFF5D2] cursor-pointer"
              aria-label="Mở menu điều hướng"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Điều hướng di động"
            className="md:hidden border-t border-[#556B2F]/15 bg-[#EFF5D2] px-4 py-3 flex flex-col gap-1"
          >
            {NAV_ITEMS.map((item) => {
              const active = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                    active ? 'bg-[#556B2F] text-white' : 'text-[#212122] hover:bg-[#556B2F]/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingSection
            onStartGames={handleStartGames}
            onOpenProject={(section?: string) => navigateTo('project', section)}
            onOpenStickerHunt={() => navigateTo('sticker')}
            giftStatus={giftStatus}
            onOpenQrModal={openQrModal}
            onOpenBoothMode={() => setBoothModeOpen(true)}
            onExploreCrop={(cropId) => trackEvent('crop_explored', cropId)}
            communityStats={communityStats}
          />
        )}

        {activeView === 'project' && (
          <ProjectShowcase
            giftStatus={giftStatus}
            onStartStickerHunt={() => navigateTo('sticker')}
            onPlayCaoBangQuiz={() => handleStartGames('cao_bang_quiz')}
            onExploreCrop={(cropId) => trackEvent('crop_explored', cropId)}
          />
        )}

        {activeView === 'sticker' && (
          <StickerHunt
            deviceId={deviceId}
            playerId={currentPlayer?.id ?? null}
            giftStatus={giftStatus}
            onGiftStatus={setGiftStatus}
            onOpenProject={(section?: ShowcaseSectionId) => navigateTo('project', section)}
            onPlayMoreGames={() => handleStartGames('farm_sim')}
          />
        )}

        {activeView === 'games' && (
          <GamesHub
            currentPlayer={currentPlayer}
            initialGame={initialGame}
            autoStart={autoStartGame}
            onAutoStartConsumed={() => setAutoStartGame(false)}
            onOpenQrModal={openQrModal}
            onGameStarted={(gameType) => trackEvent('game_started', gameType)}
            onGameCompleted={handleGameCompleted}
            onClaimName={handleClaimPlayerName}
            onGoLeaderboard={() => navigateTo('leaderboard')}
          />
        )}

        {activeView === 'leaderboard' && (
          <LeaderboardSection
            currentPlayer={currentPlayer}
            refreshTrigger={leaderboardTick}
            onPlayNow={() => handleStartGames('farm_sim')}
          />
        )}

        {activeView === 'insights' && (
          <CommunityInsightsSection
            currentPlayer={currentPlayer}
            sessionId={sessionId}
            onInsightCreated={refreshPublicStats}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            onOpenQrModal={openQrModal}
            onOpenBoothMode={() => setBoothModeOpen(true)}
            onBackToPublic={() => navigateTo('landing')}
          />
        )}
      </main>

      {/* SIGNATURE AGRI-NEXT × YOUTH 4 CLIMATE FOOTER */}
      <footer className="mt-auto bg-[#556B2F] text-white">
        <BrocadeStrip tone="moss" heightClass="h-5" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-5">
                <AgriNextLogo variant="stacked" color="white" />
                <div className="h-16 w-px bg-white/45" aria-hidden="true" />
                <Youth4ClimateLogo color="white" className="w-16 h-16" />
              </div>
              <p className="text-xs sm:text-sm text-[#EFF5D2]/90 leading-relaxed max-w-sm">
                Sáng kiến thanh niên vì nông nghiệp tái sinh và thích ứng biến đổi khí hậu tại Cao
                Bằng — Mầm rễ Trẻ, Tương lai Xanh.
              </p>
            </div>

            <div className="md:col-span-7 flex flex-col sm:flex-row sm:items-center justify-end gap-6">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('social_clicked', 'facebook')}
                className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#EFF5D2] hover:text-white transition-colors"
              >
                <SocialDiamondIcon platform="facebook" tone="white" className="w-10 h-10 shrink-0" />
                <span>Agri-Next-Vietnam</span>
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('social_clicked', 'instagram')}
                className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#EFF5D2] hover:text-white transition-colors"
              >
                <SocialDiamondIcon
                  platform="instagram"
                  tone="white"
                  className="w-10 h-10 shrink-0"
                />
                <span>agri_next.vietnam</span>
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('social_clicked', 'linkedin')}
                className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#EFF5D2] hover:text-white transition-colors"
              >
                <SocialDiamondIcon platform="linkedin" tone="white" className="w-10 h-10 shrink-0" />
                <span>agri-next-vietnam</span>
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-[#EFF5D2]/80">
            <div>© {new Date().getFullYear()} Agri-Next Vietnam · Dự án Nông nghiệp Bền vững Cao Bằng</div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigateTo('project')}
                className="hover:text-white cursor-pointer"
              >
                Về dự án
              </button>
              <button
                type="button"
                onClick={() => navigateTo('games')}
                className="hover:text-white cursor-pointer"
              >
                Mini-game & Huy hiệu
              </button>
              <button
                type="button"
                onClick={() => navigateTo('leaderboard')}
                className="hover:text-white cursor-pointer"
              >
                Bảng xếp hạng
              </button>
              <span aria-hidden="true" className="text-white/25">
                ·
              </span>
              <button
                type="button"
                onClick={() => navigateTo('admin')}
                className="text-[#EFF5D2]/55 hover:text-white transition-colors cursor-pointer"
              >
                Cổng Admin
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* MOBILE THUMB-ZONE BOTTOM NAVIGATION BAR (Compact 56px, <=15% aggregate sticky cap) */}
      <nav
        aria-label="Điều hướng nhanh trên điện thoại"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#F9FBF1]/95 backdrop-blur-md border-t border-[#556B2F]/18 pb-safe"
      >
        <div className="grid grid-cols-5 h-14">
          {MOBILE_BOTTOM_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => navigateTo(tab.id)}
                className={`flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                  active ? 'text-[#556B2F]' : 'text-[#585A56]'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#556B2F]' : 'text-[#585A56]'}`} />
                <span className={`text-[10px] tracking-tight ${active ? 'font-extrabold' : 'font-semibold'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* SCANNABLE QR MODAL FOR MOBILE PLAY & PRINTABLE EVENT POSTER */}
      <QrPlayModal
        open={qrModalOpen}
        initialTarget={qrTarget}
        onClose={() => setQrModalOpen(false)}
      />

      {/* FULL-VIEWPORT BOOTH PRESENTATION MODE (1-SCREEN EXHIBITION + ALWAYS-VISIBLE QR) */}
      <BoothPresentationMode
        open={boothModeOpen}
        onClose={() => setBoothModeOpen(false)}
        communityStats={communityStats}
      />
    </div>
  );
}
