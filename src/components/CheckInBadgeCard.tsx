import React, { useState } from 'react';
import { Award, Check, Copy, Download, Share2, Sparkles, Trophy } from 'lucide-react';
import type { GameType, PlayerProfile, RegionOption } from '../types';
import { launchConfetti } from '../utils/confetti';
import { getSavedQrBaseUrl } from '../utils/qr';
import { AgriNextLogo, BrocadeStrip, GrainMascot, LeafMascot, Youth4ClimateLogo } from './BrandAssets';

export interface BadgeMetadata {
  id: string;
  gameType: GameType | 'master';
  title: string;
  subtitle: string;
  checkInNote: string;
  mascot: 'leaf' | 'grain';
  accentHex: string;
}

export const BADGE_CATALOG: Record<string, BadgeMetadata> = {
  badge_farm_sim: {
    id: 'badge_farm_sim',
    gameType: 'farm_sim',
    title: 'Người Gieo Hạt Tái Sinh',
    subtitle: 'Đã trải nghiệm 6 mùa vụ canh tác thích ứng khí hậu tại Cao Bằng',
    checkInNote: 'Chứng nhận đã check-in tìm hiểu Nông nghiệp Tái sinh Cao Bằng cùng Agri-Next',
    mascot: 'leaf',
    accentHex: '#8FA31E',
  },
  badge_quiz: {
    id: 'badge_quiz',
    gameType: 'cao_bang_quiz',
    title: 'Thông Thái Nông Sản Cao Bằng',
    subtitle: 'Đã khám phá bộ câu hỏi đặc sản & nông nghiệp bền vững vùng cao',
    checkInNote: 'Chứng nhận đã check-in hiểu sâu về 4 đặc sản bản địa Cao Bằng cùng Agri-Next',
    mascot: 'grain',
    accentHex: '#F4991A',
  },
  badge_market: {
    id: 'badge_market',
    gameType: 'market_basket',
    title: 'Đại Sứ Nông Sản Xanh',
    subtitle: 'Đã đóng góp góc nhìn tiêu dùng bền vững cho nông sản Cao Bằng',
    checkInNote: 'Chứng nhận đã check-in đồng hành lan tỏa nông sản Cao Bằng cùng Agri-Next',
    mascot: 'leaf',
    accentHex: '#556B2F',
  },
  badge_master: {
    id: 'badge_master',
    gameType: 'master',
    title: 'Thủ Lĩnh Nông Nghiệp Xanh',
    subtitle: 'Hoàn thành trọn bộ 3 thử thách tìm hiểu Agri-Next & nông nghiệp Cao Bằng',
    checkInNote: 'Huy hiệu check-in đặc biệt dành cho bạn trẻ am hiểu trọn vẹn Agri-Next Cao Bằng',
    mascot: 'grain',
    accentHex: '#F4991A',
  },
};

const REGIONS: RegionOption[] = [
  'Cao Bằng',
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Các tỉnh miền núi phía Bắc',
  'Tỉnh/Thành khác',
];

interface CheckInBadgeCardProps {
  badgeId: string;
  scoreLabel: string;
  highlightDetail?: string;
  player: PlayerProfile | null;
  rankInfo?: { rank?: number; totalPlayers?: number } | null;
  onClaimName: (name: string, region: RegionOption) => Promise<void>;
  onGoLeaderboard: () => void;
}

/**
 * Draws a crisp, social-ready 1080x1350 PNG Check-in Badge Card matching Agri-Next's exact branding
 * so players can save and share directly on Facebook, Instagram Story, TikTok, or Threads.
 */
function renderCheckInCardCanvas(opts: {
  displayName: string;
  region: string;
  badgeTitle: string;
  badgeSubtitle: string;
  scoreLabel: string;
  checkInNote: string;
  highlightDetail?: string;
}): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background warm cream parchment (#EFF5D2)
  ctx.fillStyle = '#EFF5D2';
  ctx.fillRect(0, 0, 1080, 1350);

  // Top Deep Olive Banner (#556B2F)
  ctx.fillStyle = '#556B2F';
  ctx.fillRect(0, 0, 1080, 290);

  // Decorative diamond brocade motif along banner bottom
  ctx.fillStyle = '#8FA31E';
  ctx.fillRect(0, 290, 1080, 24);
  ctx.strokeStyle = 'rgba(239, 245, 210, 0.55)';
  ctx.lineWidth = 2;
  for (let x = 24; x < 1080; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 293);
    ctx.lineTo(x + 9, 302);
    ctx.lineTo(x, 311);
    ctx.lineTo(x - 9, 302);
    ctx.closePath();
    ctx.stroke();
  }

  // Header Brand Text
  ctx.fillStyle = '#C6D870';
  ctx.font = '700 28px Montserrat, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HUY HIỆU CHECK-IN ĐÃ BIẾT VỀ AGRI-NEXT', 540, 102);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 56px Quicksand, Montserrat, sans-serif';
  ctx.fillText('AGRI-NEXT VIETNAM', 540, 182);

  ctx.fillStyle = '#EFF5D2';
  ctx.font = '600 26px Montserrat, sans-serif';
  ctx.fillText('Hành trình Nông nghiệp Xanh Cao Bằng · Youth 4 Climate', 540, 238);

  // Central White Heritage Frame
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#556B2F';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(80, 368, 920, 740, 32);
  ctx.fill();
  ctx.stroke();

  // Emblem Diamond Medallion
  ctx.save();
  ctx.translate(540, 520);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#556B2F';
  ctx.fillRect(-76, -76, 152, 152);
  ctx.strokeStyle = '#F4991A';
  ctx.lineWidth = 8;
  ctx.strokeRect(-88, -88, 176, 176);
  ctx.restore();

  // Sprout icon inside medallion
  ctx.strokeStyle = '#EFF5D2';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(540, 560);
  ctx.lineTo(540, 488);
  ctx.moveTo(540, 525);
  ctx.quadraticCurveTo(500, 515, 495, 485);
  ctx.quadraticCurveTo(525, 485, 540, 525);
  ctx.moveTo(540, 525);
  ctx.quadraticCurveTo(580, 515, 585, 485);
  ctx.quadraticCurveTo(555, 485, 540, 525);
  ctx.stroke();

  // Badge Title
  ctx.fillStyle = '#8FA31E';
  ctx.font = '700 26px Montserrat, sans-serif';
  ctx.fillText('CHỨNG NHẬN CHECK-IN NÔNG NGHIỆP CAO BẰNG', 540, 682);

  ctx.fillStyle = '#556B2F';
  ctx.font = '800 46px Montserrat, sans-serif';
  ctx.fillText(opts.badgeTitle, 540, 746);

  // Player Name
  ctx.fillStyle = '#212122';
  ctx.font = '700 34px Montserrat, sans-serif';
  ctx.fillText(`${opts.displayName}  ·  ${opts.region}`, 540, 816);

  // Score & Detail
  ctx.fillStyle = '#585A56';
  ctx.font = '600 26px Montserrat, sans-serif';
  ctx.fillText(opts.scoreLabel, 540, 868);
  if (opts.highlightDetail) {
    ctx.fillStyle = '#3E5021';
    ctx.font = '600 24px Montserrat, sans-serif';
    ctx.fillText(opts.highlightDetail.slice(0, 58), 540, 912);
  }

  // Social Check-in Stamp Box
  ctx.fillStyle = '#EFF5D2';
  ctx.beginPath();
  ctx.roundRect(140, 950, 800, 122, 20);
  ctx.fill();

  ctx.fillStyle = '#556B2F';
  ctx.font = '700 22px Montserrat, sans-serif';
  ctx.fillText(opts.checkInNote.slice(0, 68), 540, 996);

  ctx.fillStyle = '#D9810D';
  ctx.font = '800 28px Montserrat, sans-serif';
  ctx.fillText('#AgriNextVietnam  ·  #NongNghiepCaoBang', 540, 1046);

  // Footer
  ctx.fillStyle = '#556B2F';
  ctx.fillRect(0, 1185, 1080, 165);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 26px Montserrat, sans-serif';
  ctx.fillText('Mầm rễ Trẻ, Tương lai Xanh · Đồng hành cùng Youth 4 Climate', 540, 1254);
  ctx.fillStyle = '#C6D870';
  ctx.font = '600 22px Montserrat, sans-serif';
  ctx.fillText('FB: Agri-Next-Vietnam  ·  IG: agri_next.vietnam  ·  IN: agri-next-vietnam', 540, 1300);

  return canvas;
}

export const CheckInBadgeCard: React.FC<CheckInBadgeCardProps> = ({
  badgeId,
  scoreLabel,
  highlightDetail,
  player,
  rankInfo,
  onClaimName,
  onGoLeaderboard,
}) => {
  const badge = BADGE_CATALOG[badgeId] ?? BADGE_CATALOG.badge_farm_sim;
  const isGuestName = !player || player.name.startsWith('Bạn trẻ Xanh');

  const [nameInput, setNameInput] = useState(isGuestName ? '' : player?.name ?? '');
  const [regionInput, setRegionInput] = useState<RegionOption>(player?.region ?? 'Hà Nội');
  const [savingName, setSavingName] = useState(false);
  const [claimed, setClaimed] = useState(!isGuestName);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const displayName =
    (claimed && nameInput.trim()) ||
    (player && !player.name.startsWith('Bạn trẻ Xanh') ? player.name : 'Bạn trẻ Yêu Cao Bằng');

  const shareWebUrl =
    getSavedQrBaseUrl() || (typeof window !== 'undefined' ? window.location.origin : '');
  const rankSnippet = rankInfo?.rank ? ` (Hạng #${rankInfo.rank})` : '';
  const shareQuote = `Mình vừa hoàn thành thử thách khám phá nông nghiệp Cao Bằng cùng Agri-Next Vietnam với kết quả ${scoreLabel}${rankSnippet} và nhận Huy hiệu "${badge.title}"! Cùng tìm hiểu & chơi thử nhé 🌱 #AgriNextVietnam #NongNghiepCaoBang #Youth4Climate`;
  const socialCaption = shareWebUrl ? `${shareQuote}\n${shareWebUrl}` : shareQuote;

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareWebUrl
  )}&quote=${encodeURIComponent(shareQuote)}&hashtag=${encodeURIComponent('#AgriNextVietnam')}`;

  const handleFacebookShareClick = () => {
    launchConfetti('game');
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(socialCaption)
        .then(() => {
          setShareFeedback(
            'Đã mở trang chia sẻ Facebook & sao chép sẵn kết quả kèm link web để bạn dán nếu cần!'
          );
          setTimeout(() => setShareFeedback(null), 4000);
        })
        .catch(() => {
          setShareFeedback('Đã mở trang chia sẻ Facebook kèm link dự án Agri-Next!');
          setTimeout(() => setShareFeedback(null), 3200);
        });
    } else {
      setShareFeedback('Đã mở trang chia sẻ Facebook kèm link dự án Agri-Next!');
      setTimeout(() => setShareFeedback(null), 3200);
    }
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim().length < 2) return;
    setSavingName(true);
    await onClaimName(nameInput.trim(), regionInput);
    setClaimed(true);
    setSavingName(false);
    launchConfetti('badge');
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(socialCaption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2200);
    } catch {
      // Clipboard restricted in some embedded previews
    }
  };

  const triggerDownload = () => {
    const canvas = renderCheckInCardCanvas({
      displayName,
      region: regionInput,
      badgeTitle: badge.title,
      badgeSubtitle: badge.subtitle,
      scoreLabel,
      checkInNote: badge.checkInNote,
      highlightDetail,
    });
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `huy-hieu-agrinext-${badge.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleDownload = () => {
    launchConfetti('game');
    triggerDownload();
  };

  const handleSocialShare = async () => {
    launchConfetti('game');
    const canvas = renderCheckInCardCanvas({
      displayName,
      region: regionInput,
      badgeTitle: badge.title,
      badgeSubtitle: badge.subtitle,
      scoreLabel,
      checkInNote: badge.checkInNote,
      highlightDetail,
    });

    if (canvas && typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), 'image/png')
        );
        if (blob) {
          const file = new File([blob], `huy-hieu-agrinext-${badge.id}.png`, {
            type: 'image/png',
          });
          if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `Huy hiệu ${badge.title} — Agri-Next Vietnam`,
              text: socialCaption,
              files: [file],
            });
            setShareFeedback('Đã mở bảng chia sẻ mạng xã hội!');
            setTimeout(() => setShareFeedback(null), 2600);
            return;
          }
        }
        await navigator.share({
          title: `Huy hiệu ${badge.title} — Agri-Next Vietnam`,
          text: shareQuote,
          url: shareWebUrl || window.location.origin,
        });
        setShareFeedback('Đã mở bảng chia sẻ mạng xã hội!');
        setTimeout(() => setShareFeedback(null), 2600);
        return;
      } catch {
        // User canceled native share or browser blocked; fall back gracefully below
      }
    }

    // Desktop fallback: download PNG + copy caption so they can upload to FB/IG/Story right away
    triggerDownload();
    try {
      await navigator.clipboard.writeText(socialCaption);
      setShareFeedback('Đã tải ảnh Huy hiệu & sao chép sẵn caption để bạn đăng FB / IG!');
    } catch {
      setShareFeedback('Đã tải ảnh Huy hiệu! Bạn có thể đăng ngay lên FB / IG / Story.');
    }
    setTimeout(() => setShareFeedback(null), 3500);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-[#556B2F]/25 bg-[#EFF5D2]">
      {/* Top Heritage Banner */}
      <div className="bg-[#556B2F] text-white px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-[#F4991A] shrink-0" />
          <div>
            <div className="text-xs font-semibold text-[#C6D870]">
              Mở khóa Huy hiệu Check-in · Đã biết về Agri-Next Vietnam
            </div>
            <h4 className="text-lg sm:text-xl font-extrabold text-white">{badge.title}</h4>
          </div>
        </div>
        <div className="flex items-center gap-3 opacity-95">
          <AgriNextLogo variant="horizontal" color="white" className="scale-90 origin-right" />
          <div className="h-7 w-px bg-white/30 hidden sm:block" aria-hidden="true" />
          <Youth4ClimateLogo color="white" className="w-8 h-8 hidden sm:block" />
        </div>
      </div>

      {/* Main Badge & Share Body */}
      <div className="p-6 sm:p-8 grid lg:grid-cols-12 gap-6 items-center">
        {/* Left: Visual Collectible Check-in Card */}
        <div className="lg:col-span-7 rounded-xl bg-white border border-[#556B2F]/20 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#EFF5D2] border border-[#556B2F]/20 flex items-center justify-center shrink-0">
              {badge.mascot === 'grain' ? (
                <GrainMascot mood="wave" className="w-14 h-14" />
              ) : (
                <LeafMascot mood="happy" className="w-14 h-14" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#8FA31E]">{scoreLabel}</div>
              <div className="text-base sm:text-lg font-extrabold text-[#212122] truncate">
                {displayName} · <span className="font-semibold text-[#585A56]">{regionInput}</span>
              </div>
              <p className="text-xs text-[#585A56] mt-0.5">{badge.subtitle}</p>
            </div>
          </div>

          {highlightDetail && (
            <div className="text-xs font-semibold text-[#3E5021] bg-[#EFF5D2]/70 rounded-lg px-3.5 py-2.5">
              {highlightDetail}
            </div>
          )}

          {/* Social Check-in Strip */}
          <div className="pt-3 border-t border-dashed border-[#556B2F]/25 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-[#556B2F]">
                Huy hiệu Check-in Agri-Next · Chia sẻ khoảnh khắc xanh
              </div>
              <div className="text-xs text-[#212122] font-semibold mt-0.5">{badge.checkInNote}</div>
              <div className="text-[11px] font-bold text-[#8FA31E] mt-1">
                #AgriNextVietnam · #NongNghiepCaoBang · #Youth4Climate
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyCaption}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EFF5D2] hover:bg-[#C6D870]/60 text-[#212122] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {copiedCaption ? (
                <Check className="w-3.5 h-3.5 text-[#556B2F]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#556B2F]" />
              )}
              <span>{copiedCaption ? 'Đã chép caption!' : 'Chép caption'}</span>
            </button>
          </div>
        </div>

        {/* Right: Quick 1-step Name Inscription + Share to Social Media */}
        <div className="lg:col-span-5 space-y-3.5">
          <form onSubmit={handleSaveName} className="space-y-2.5">
            <div className="text-xs font-bold text-[#212122]">
              In tên bạn lên Huy hiệu Check-in & lưu lên Bảng Xếp Hạng (không cần đăng nhập):
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                maxLength={40}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="flex-1 min-h-[44px] px-3.5 py-2 rounded-lg bg-white border border-[#556B2F]/25 text-sm focus:outline-none focus:border-[#556B2F]"
              />
              <select
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value as RegionOption)}
                className="min-h-[44px] px-3 py-2 rounded-lg bg-white border border-[#556B2F]/25 text-xs font-semibold text-[#212122]"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={savingName || nameInput.trim().length < 2}
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#556B2F] hover:bg-[#3E5021] disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {savingName
                  ? 'Đang cập nhật...'
                  : claimed
                    ? 'Cập nhật tên trên Huy hiệu'
                    : 'In tên lên Huy hiệu & Xếp hạng'}
              </span>
            </button>
          </form>

          {rankInfo?.rank && (
            <div className="text-xs font-bold text-[#3E5021]">
              Đang đứng Hạng #{rankInfo.rank} / {rankInfo.totalPlayers} bạn trẻ tham gia!
            </div>
          )}

          {/* Primary Facebook Share Button (shares result + Agri-Next web link) */}
          <a
            href={facebookShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleFacebookShareClick}
            className="w-full min-h-[48px] inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#1877F2] hover:bg-[#1565D8] active:scale-[0.98] text-white font-bold text-sm transition-all cursor-pointer whitespace-nowrap shadow-sm"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-current shrink-0"
              aria-hidden="true"
            >
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
            <span>Chia sẻ lên Facebook</span>
          </a>

          {/* Secondary Native Social Share Button (PNG card for Story / IG / Zalo) */}
          <button
            type="button"
            onClick={handleSocialShare}
            className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4991A] hover:bg-[#D9810D] active:scale-[0.98] text-[#212122] font-bold text-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span>Chia sẻ ảnh Huy hiệu (Story / Zalo)</span>
          </button>

          {shareFeedback && (
            <div className="text-xs font-semibold text-[#556B2F] bg-white/85 rounded-lg px-3 py-2 border border-[#556B2F]/15">
              {shareFeedback}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDownload}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-white border border-[#556B2F]/25 hover:bg-[#F9FBF1] text-[#556B2F] font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>Tải ảnh Huy hiệu</span>
            </button>
            <button
              type="button"
              onClick={onGoLeaderboard}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-white border border-[#556B2F]/25 hover:bg-[#F9FBF1] text-[#556B2F] font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <Trophy className="w-4 h-4 shrink-0" />
              <span>Bảng xếp hạng</span>
            </button>
          </div>
        </div>
      </div>

      <BrocadeStrip tone="amber" heightClass="h-3.5" />
    </div>
  );
};
