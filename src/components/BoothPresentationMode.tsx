import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Link2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Smartphone,
  Trophy,
  X,
} from 'lucide-react';
import { AGRI_NEXT_PILLARS, CAO_BANG_SPECIALTIES } from '../data/agriNextContent';
import type { LeaderboardEntry } from '../types';
import {
  downloadQrPosterPng,
  getQrTargetConfig,
  getSavedQrBaseUrl,
  QR_TARGETS,
  saveQrBaseUrl,
  type QrTarget,
} from '../utils/qr';
import {
  AgriNextLogo,
  BrocadeStrip,
  GrainMascot,
  LeafMascot,
  Youth4ClimateLogo,
} from './BrandAssets';
import { LiveQrCode } from './LiveQrCode';

interface BoothPresentationModeProps {
  open: boolean;
  onClose: () => void;
  communityStats: {
    totalPlayers: number;
    totalSessions: number;
    totalInsights: number;
  };
}

const SLIDE_TITLES = [
  '01. Giới thiệu Agri-Next',
  '02. Đặc sản Cao Bằng',
  '03. Ba trụ cột hành động',
  '04. Bảng xếp hạng trực tiếp',
];

const BOOTH_QR_OPTIONS: QrTarget[] = ['games', 'farm_sim', 'cao_bang_quiz', 'market_basket'];
const SLIDE_DURATION_MS = 12000;

export const BoothPresentationMode: React.FC<BoothPresentationModeProps> = ({
  open,
  onClose,
  communityStats,
}) => {
  const [slideIdx, setSlideIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [qrTarget, setQrTarget] = useState<QrTarget>('games');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUrlEdit, setShowUrlEdit] = useState(false);
  const [baseUrlInput, setBaseUrlInput] = useState(() => getSavedQrBaseUrl());
  const [liveEntries, setLiveEntries] = useState<LeaderboardEntry[]>([]);
  const [liveTotals, setLiveTotals] = useState({
    totalPlayers: communityStats.totalPlayers,
    totalSessions: communityStats.totalSessions,
  });

  // Sync live leaderboard every 10 seconds so visitors scanning at the booth see their name appear!
  useEffect(() => {
    if (!open) return;
    let active = true;
    const loadLeaderboard = () => {
      fetch('/api/leaderboard?game=all&region=all')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!active || !data) return;
          setLiveEntries((data.entries ?? []).slice(0, 6));
          setLiveTotals({
            totalPlayers: data.totalPlayers ?? communityStats.totalPlayers,
            totalSessions: data.totalSessions ?? communityStats.totalSessions,
          });
        })
        .catch(() => {});
    };

    loadLeaderboard();
    const interval = window.setInterval(loadLeaderboard, 10000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [open, communityStats.totalPlayers, communityStats.totalSessions]);

  // Auto-advance slides for passive booth viewing
  useEffect(() => {
    if (!open || paused) return;
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % SLIDE_TITLES.length);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(timer);
  }, [open, paused]);

  // Keyboard shortcuts (Left/Right/Space/Escape) for booth operator
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') setSlideIdx((p) => (p + 1) % SLIDE_TITLES.length);
      else if (e.key === 'ArrowLeft')
        setSlideIdx((p) => (p - 1 + SLIDE_TITLES.length) % SLIDE_TITLES.length);
      else if (e.key === ' ') {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  if (!open) return null;

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen may be restricted in some embedded iframe previews
    }
  };

  const handleSaveBaseUrl = (val: string) => {
    setBaseUrlInput(val);
    saveQrBaseUrl(val);
  };

  const activeQrCfg = getQrTargetConfig(qrTarget);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#F9FBF1] text-[#212122] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Chế độ màn hình trình chiếu Booth Agri-Next Vietnam"
    >
      {/* Top Booth Control Bar */}
      <div className="bg-[#556B2F] text-white px-5 sm:px-8 h-14 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <AgriNextLogo variant="horizontal" color="white" />
          <div className="hidden lg:block h-5 w-px bg-white/30" aria-hidden="true" />
          <span className="hidden lg:inline text-xs font-semibold text-[#C6D870] truncate">
            Màn hình Booth Trình chiếu · Đọc câu chuyện dự án & Quét mã QR chơi game ngay
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowUrlEdit((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#EFF5D2] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đổi link QR</span>
          </button>

          <button
            type="button"
            onClick={() => downloadQrPosterPng(qrTarget, baseUrlInput)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#EFF5D2] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tải Poster</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#EFF5D2] transition-colors cursor-pointer whitespace-nowrap"
            aria-label={isFullscreen ? 'Thu nhỏ màn hình' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F4991A] hover:bg-[#D9810D] text-xs font-bold text-[#212122] transition-colors cursor-pointer whitespace-nowrap"
          >
            <X className="w-3.5 h-3.5" />
            <span>Thoát Booth</span>
          </button>
        </div>
      </div>

      {/* Optional inline URL bar for booth staff */}
      {showUrlEdit && (
        <div className="bg-[#EFF5D2] border-b border-[#556B2F]/20 px-5 sm:px-8 py-2.5 flex flex-wrap items-center gap-3">
          <label htmlFor="booth-qr-url" className="text-xs font-bold text-[#556B2F] whitespace-nowrap">
            Link gốc của mã QR:
          </label>
          <input
            id="booth-qr-url"
            type="url"
            value={baseUrlInput}
            onChange={(e) => handleSaveBaseUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 min-w-[240px] px-3 py-1.5 rounded-lg bg-white border border-[#556B2F]/25 text-xs font-mono-num text-[#212122]"
          />
          <span className="text-[11px] text-[#585A56]">
            Tự động cập nhật toàn bộ mã QR trên màn hình Booth
          </span>
        </div>
      )}

      {/* MAIN SPLIT STAGE: Left 65% Story Slides · Right 35% Always-Visible Giant QR Station */}
      <div className="flex-1 grid lg:grid-cols-12 min-h-0">
        {/* LEFT READING STAGE (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col justify-between p-6 sm:p-8 lg:p-10 min-h-0">
          {/* Slide Content Container */}
          <div className="flex-1 flex flex-col justify-center">
            {slideIdx === 0 && (
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden border border-[#556B2F]/20 aspect-[16/8] max-h-[340px] w-full bg-[#3E5021]">
                  <img
                    src="/src/assets/images/hero_caobang_panorama_1795619405763.jpg"
                    alt="Toàn cảnh nông nghiệp bền vững Cao Bằng Agri-Next Vietnam"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#212122]/85 via-[#3E5021]/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
                    <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#C6D870]">
                      <span>Agri-Next Vietnam</span>
                      <span aria-hidden="true">·</span>
                      <span>Youth 4 Climate</span>
                      <span aria-hidden="true">·</span>
                      <span>Cao Bằng</span>
                    </div>
                    <h1 className="heritage-title text-3xl sm:text-4xl xl:text-5xl font-black leading-tight mt-1">
                      Mầm rễ Trẻ, Tương lai Xanh cho Nông nghiệp Cao Bằng
                    </h1>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="parchment-surface rounded-xl border border-[#556B2F]/18 p-5">
                    <div className="font-mono-num text-3xl font-extrabold text-[#556B2F]">
                      1.000 m²
                    </div>
                    <div className="text-sm font-bold text-[#212122] mt-1">
                      Ruộng mẫu thực nghiệm tái sinh
                    </div>
                    <p className="text-xs text-[#585A56] mt-1 leading-relaxed">
                      Thử nghiệm canh tác giữ ẩm, che phủ hữu cơ và bảo tồn giống cây đặc hữu núi đá.
                    </p>
                  </div>
                  <div className="parchment-surface rounded-xl border border-[#556B2F]/18 p-5">
                    <div className="font-mono-num text-3xl font-extrabold text-[#556B2F]">04</div>
                    <div className="text-sm font-bold text-[#212122] mt-1">
                      Nông sản bản địa chủ lực
                    </div>
                    <p className="text-xs text-[#585A56] mt-1 leading-relaxed">
                      Hạt dẻ Trùng Khánh, Thạch đen Đông Khê, Miến dong Phia Đén và Lê Bảo Lạc.
                    </p>
                  </div>
                  <div className="parchment-surface rounded-xl border border-[#556B2F]/18 p-5">
                    <div className="font-mono-num text-3xl font-extrabold text-[#8FA31E]">100%</div>
                    <div className="text-sm font-bold text-[#212122] mt-1">
                      Do thanh niên dẫn dắt
                    </div>
                    <p className="text-xs text-[#585A56] mt-1 leading-relaxed">
                      Kết hợp tri thức bản địa của đồng bào vùng cao với tư duy khí hậu & công nghệ số.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {slideIdx === 1 && (
              <div className="space-y-6">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#556B2F]">
                    02. Bản đồ Nông sản Đặc hữu Cao Bằng
                  </div>
                  <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-[#212122] mt-1">
                    4 báu vật nông nghiệp vùng cao đang thích ứng với biến đổi khí hậu
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {CAO_BANG_SPECIALTIES.map((crop) => (
                    <div
                      key={crop.id}
                      className="rounded-2xl bg-white border border-[#556B2F]/18 p-5 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#585A56]">
                        <span>{crop.regionLabel}</span>
                        <span className="text-[#8FA31E] font-bold">{crop.season}</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#556B2F]">{crop.name}</h3>
                      <p className="text-xs sm:text-sm text-[#212122] leading-relaxed">
                        {crop.description}
                      </p>
                      <div className="pt-2 border-t border-[#556B2F]/12 text-xs font-semibold text-[#3E5021]">
                        Giải pháp Agri-Next: {crop.agriNextSolution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {slideIdx === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#556B2F]">
                    03. Hệ sinh thái hành động tại Cao Bằng
                  </div>
                  <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-[#212122] mt-1">
                    Ba trụ cột kiến tạo tương lai nông nghiệp bền vững
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {AGRI_NEXT_PILLARS.map((pillar, i) => (
                    <div
                      key={pillar.index}
                      className={`rounded-2xl p-6 border flex flex-col justify-between space-y-4 ${
                        i === 1
                          ? 'bg-[#556B2F] text-white border-[#3E5021]'
                          : 'bg-white text-[#212122] border-[#556B2F]/18'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div
                          className={`font-mono-num text-sm font-bold ${
                            i === 1 ? 'text-[#C6D870]' : 'text-[#8FA31E]'
                          }`}
                        >
                          {pillar.index}.
                        </div>
                        <h3 className="text-lg font-extrabold leading-snug">{pillar.title}</h3>
                        <p
                          className={`text-xs sm:text-sm leading-relaxed ${
                            i === 1 ? 'text-[#EFF5D2]/90' : 'text-[#585A56]'
                          }`}
                        >
                          {pillar.description}
                        </p>
                      </div>
                      <div
                        className={`pt-3 border-t text-xs font-semibold ${
                          i === 1
                            ? 'border-white/20 text-[#C6D870]'
                            : 'border-[#556B2F]/12 text-[#556B2F]'
                        }`}
                      >
                        {pillar.impactFact}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="parchment-surface rounded-xl border border-[#556B2F]/18 p-4 flex items-center gap-4">
                  <LeafMascot mood="idea" className="w-12 h-12 shrink-0" />
                  <p className="text-xs sm:text-sm font-semibold text-[#212122]">
                    Quét mã QR bên phải để hóa thân thành nông dân tái sinh, trả lời câu đố đặc sản
                    và đóng góp góc nhìn thị trường — dữ liệu thật giúp hoàn thiện dự án Agri-Next!
                  </p>
                </div>
              </div>
            )}

            {slideIdx === 3 && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#556B2F]">
                      04. Bảng Xếp Hạng Trực Tiếp tại Booth (Tự cập nhật)
                    </div>
                    <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-[#212122] mt-1">
                      Top Người Chơi Nông Nghiệp Xanh Cao Bằng
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#556B2F]">
                    <Trophy className="w-4 h-4 text-[#F4991A]" />
                    <span className="font-mono-num">
                      {liveTotals.totalPlayers} người chơi · {liveTotals.totalSessions} lượt hoàn thành
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-[#556B2F]/18 overflow-hidden">
                  <div className="divide-y divide-[#556B2F]/12">
                    {liveEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="px-5 py-3.5 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-lg font-mono-num text-sm font-extrabold flex items-center justify-center shrink-0 ${
                              entry.rank === 1
                                ? 'bg-[#F4991A] text-[#212122]'
                                : entry.rank <= 3
                                  ? 'bg-[#556B2F] text-white'
                                  : 'bg-[#EFF5D2] text-[#556B2F]'
                            }`}
                          >
                            #{entry.rank}
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-sm sm:text-base text-[#212122] truncate">
                              {entry.name}
                            </div>
                            <div className="text-xs text-[#585A56] truncate">
                              {entry.region} · {entry.rankTitle} · {entry.badges.length}/4 huy hiệu
                            </div>
                          </div>
                        </div>
                        <div className="font-mono-num text-lg font-extrabold text-[#556B2F] shrink-0">
                          {entry.displayScore.toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-[#585A56] font-medium">
                  Quét mã QR bên phải, hoàn thành 1 trò chơi trên điện thoại và khắc tên để xuất
                  hiện ngay trên màn hình Booth này!
                </div>
              </div>
            )}
          </div>

          {/* Slide Navigation Controls */}
          <div className="pt-6 mt-6 border-t border-[#556B2F]/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {SLIDE_TITLES.map((title, idx) => {
                const active = idx === slideIdx;
                return (
                  <button
                    key={title}
                    type="button"
                    onClick={() => setSlideIdx(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#556B2F] text-white'
                        : 'text-[#585A56] hover:bg-[#556B2F]/10 hover:text-[#212122]'
                    }`}
                  >
                    {title}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#556B2F]/25 bg-white hover:bg-[#EFF5D2] text-xs font-bold text-[#556B2F] cursor-pointer whitespace-nowrap"
              >
                {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{paused ? 'Tiếp tục tự chuyển' : 'Tạm dừng'}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setSlideIdx((p) => (p - 1 + SLIDE_TITLES.length) % SLIDE_TITLES.length)
                }
                aria-label="Slide trước"
                className="p-2 rounded-lg border border-[#556B2F]/25 bg-white hover:bg-[#EFF5D2] text-[#556B2F] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSlideIdx((p) => (p + 1) % SLIDE_TITLES.length)}
                aria-label="Slide tiếp theo"
                className="p-2 rounded-lg border border-[#556B2F]/25 bg-white hover:bg-[#EFF5D2] text-[#556B2F] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PINNED QR SCAN STATION (4 cols on lg — ALWAYS VISIBLE, NEVER SHIFTS) */}
        <aside className="lg:col-span-4 bg-[#556B2F] text-white border-t lg:border-t-0 lg:border-l border-[#3E5021] flex flex-col justify-between">
          <div className="p-6 sm:p-8 flex-1 flex flex-col items-center justify-center text-center space-y-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C6D870]">
                <Smartphone className="w-4 h-4" />
                <span>TRẠM QUÉT MÃ CHƠI TRÊN ĐIỆN THOẠI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Quét mã để chơi ngay!
              </h2>
              <p className="text-xs sm:text-sm text-[#EFF5D2]/90 max-w-xs mx-auto">
                {activeQrCfg.boothHint}
              </p>
            </div>

            {/* Giant Crisp QR Matrix */}
            <div className="p-2 rounded-2xl bg-[#EFF5D2]/15">
              <LiveQrCode
                target={qrTarget}
                baseUrl={baseUrlInput}
                sizeClass="w-56 h-56 sm:w-64 sm:h-64 xl:w-72 xl:h-72"
                pixelWidth={600}
              />
            </div>

            {/* Quick Game Selector for Booth Staff */}
            <div className="w-full max-w-xs space-y-2">
              <div className="text-[11px] font-semibold text-[#C6D870]">
                Chọn đích đến của mã QR:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {BOOTH_QR_OPTIONS.map((tId) => {
                  const cfg = QR_TARGETS.find((t) => t.id === tId)!;
                  const active = qrTarget === tId;
                  return (
                    <button
                      key={tId}
                      type="button"
                      onClick={() => setQrTarget(tId)}
                      className={`px-2.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[#F4991A] text-[#212122]'
                          : 'bg-white/10 text-[#EFF5D2] hover:bg-white/20'
                      }`}
                    >
                      {cfg.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simple 3-step callout */}
            <div className="w-full max-w-xs rounded-xl bg-[#3E5021]/75 border border-white/15 p-4 text-left space-y-1.5 text-xs text-[#EFF5D2]">
              <div>
                <strong className="text-[#F4991A]">1.</strong> Mở Camera điện thoại hoặc Zalo quét mã
              </div>
              <div>
                <strong className="text-[#F4991A]">2.</strong> Chơi 2 phút để hiểu nông nghiệp Cao Bằng
              </div>
              <div>
                <strong className="text-[#F4991A]">3.</strong> Nhận Huy hiệu check-in Agri-Next & chia sẻ MXH
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-1">
              <GrainMascot mood="wave" className="w-11 h-11" />
              <div className="text-left">
                <div className="font-mono-num text-base font-extrabold text-[#F4991A]">
                  {liveTotals.totalPlayers} bạn đã tham gia
                </div>
                <div className="text-[11px] text-[#EFF5D2]/85">
                  Đồng hành cùng Youth 4 Climate
                </div>
              </div>
              <Youth4ClimateLogo color="white" className="w-9 h-9 shrink-0" />
            </div>
          </div>

          <BrocadeStrip tone="amber" heightClass="h-4" />
        </aside>
      </div>
    </div>
  );
};
