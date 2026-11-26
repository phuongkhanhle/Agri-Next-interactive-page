import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Gift,
  Download,
  MonitorPlay,
  QrCode,
  ShoppingBasket,
  Smartphone,
  Sprout,
} from 'lucide-react';
import { AGRI_NEXT_PILLARS } from '../data/agriNextContent';
import { BrocadeStrip, GrainMascot, LeafMascot, Youth4ClimateLogo, patternStyle } from './BrandAssets';
import type { GiftStatus } from '../types';
import { CAO_BANG_XANH, UPCOMING_WEBINAR } from '../data/projectShowcase';
import { LiveQrCode } from './LiveQrCode';
import { CaoBangExplorer } from './CaoBangExplorer';
import type { QrTarget } from './QrPlayModal';

interface LandingSectionProps {
  onStartGames: (initialGame?: 'farm_sim' | 'cao_bang_quiz' | 'market_basket') => void;
  onOpenQrModal: (target?: QrTarget) => void;
  onOpenProject: (section?: string) => void;
  onOpenStickerHunt: () => void;
  giftStatus: GiftStatus | null;
  onOpenBoothMode: () => void;
  onExploreCrop: (cropId: string) => void;
  communityStats: {
    totalPlayers: number;
    totalSessions: number;
    totalInsights: number;
  };
}

export const LandingSection: React.FC<LandingSectionProps> = ({
  onStartGames,
  onOpenQrModal,
  onOpenProject,
  onOpenStickerHunt,
  giftStatus,
  onOpenBoothMode,
  onExploreCrop,
  communityStats,
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* HERO PANORAMA — Framed Vietnamese Heritage Storybook Banner (inspired by Văn Hoá Việt Nam) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="relative rounded-2xl overflow-hidden border border-[#556B2F]/20 bg-[#556B2F] shadow-sm">
          {/* Illustrated Panorama Layer */}
          <div className="relative min-h-[460px] lg:min-h-[520px] w-full bg-[#3E5021]">
            <img
              src="/src/assets/images/hero_caobang_panorama_1795619405763.jpg"
              alt="Tranh minh họa toàn cảnh nông nghiệp bền vững, ruộng bậc thang và thác Bản Giốc tại Cao Bằng"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Measured gradient scrim ensuring >= 4.5:1 contrast for crisp Vietnamese typography */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#212122]/85 via-[#3E5021]/65 to-[#212122]/80"
              aria-hidden="true"
            />

            {/* Hero Content: Left Storytelling · Right Always-Visible Booth QR Scan Card */}
            <div className="relative z-10 flex flex-col justify-between gap-8 p-6 sm:p-10 lg:p-12 min-h-[460px] lg:min-h-[520px]">
              {/* Top quiet editorial kicker + Booth Kiosk Mode trigger */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-medium text-[#EFF5D2]">
                <div className="flex items-center gap-2.5">
                  <span>Agri-Next Vietnam</span>
                  <span aria-hidden="true">·</span>
                  <span>Cao Bằng</span>
                  <span aria-hidden="true">·</span>
                  <span>Mầm rễ Trẻ, Tương lai Xanh</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenBoothMode}
                    className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#EFF5D2]/15 hover:bg-[#EFF5D2]/25 border border-[#EFF5D2]/35 text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <MonitorPlay className="w-4 h-4 text-[#F4991A]" />
                    <span>Bật chế độ Trình chiếu Booth</span>
                  </button>
                  <div className="hidden md:flex items-center gap-2 opacity-95">
                    <Youth4ClimateLogo color="white" className="w-8 h-8" />
                  </div>
                </div>
              </div>

              {/* 2-Column Split: Editorial Narrative Left + Scannable Booth QR Right */}
              <div className="grid lg:grid-cols-12 gap-8 items-end">
                <div className="lg:col-span-7 space-y-5">
                  <h1 className="heritage-title text-[clamp(2rem,4vw,3.5rem)] font-black leading-[1.12] tracking-tight text-white">
                    Hành trình Nông nghiệp Xanh Cao Bằng
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-[#EFF5D2] leading-relaxed max-w-2xl font-medium">
                    Sáng kiến do thanh niên dẫn dắt kết hợp tri thức bản địa và nông nghiệp tái sinh
                    tại Cao Bằng. Đọc câu chuyện dự án, trả lời 5 câu đố và{' '}
                    <strong className="text-white">nhận 1 bộ sticker Agri-Next</strong> ngay tại booth
                    — chỉ có {giftStatus?.total ?? 30} suất thôi!
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={onOpenStickerHunt}
                      className="min-h-[48px] inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#F4991A] hover:bg-[#D9810D] text-[#212122] font-bold text-sm sm:text-base transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Gift className="w-4 h-4 shrink-0" />
                      <span>
                        Săn Sticker
                        {giftStatus && (
                          <span className="font-mono-num ml-1.5">
                            · còn {giftStatus.remaining}/{giftStatus.total}
                          </span>
                        )}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenProject()}
                      className="min-h-[48px] inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#EFF5D2] hover:bg-white text-[#3E5021] font-bold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Đọc về dự án</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onStartGames('farm_sim')}
                      className="min-h-[48px] inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#EFF5D2]/15 hover:bg-[#EFF5D2]/25 text-white border border-[#EFF5D2]/35 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Mini-game</span>
                    </button>
                  </div>
                </div>

                {/* ALWAYS-VISIBLE SCANNABLE QR CARD RIGHT IN THE HERO (For Booth Screen) */}
                <div className="lg:col-span-5 flex lg:justify-end">
                  <div className="w-full max-w-sm rounded-2xl bg-[#EFF5D2] text-[#212122] p-5 border border-[#C6D870] shadow-md flex items-center gap-4">
                    <LiveQrCode target="sticker" sizeClass="w-32 h-32 sm:w-36 sm:h-36" pixelWidth={400} />
                    <div className="space-y-2 min-w-0">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#556B2F]">
                        <Smartphone className="w-3.5 h-3.5 shrink-0" />
                        <span>QUÉT BẰNG ĐIỆN THOẠI</span>
                      </div>
                      <div className="text-sm sm:text-base font-black text-[#212122] leading-snug">
                        Săn Sticker Agri-Next trên điện thoại
                      </div>
                      <p className="text-xs text-[#585A56] leading-relaxed">
                        Đọc dự án, trả lời đúng 4/5 câu đố và nhận mã đổi sticker tại booth.
                      </p>
                      <button
                        type="button"
                        onClick={() => onOpenQrModal('sticker')}
                        className="text-xs font-bold text-[#556B2F] hover:underline cursor-pointer"
                      >
                        Phóng to / Tải Poster QR →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Agri-Next Brocade Strip at Base of Hero */}
          <BrocadeStrip tone="olive" heightClass="h-6" />
        </div>

        {/* Full-Width 4-Column Proof Strip Placed Immediately Below Hero Split */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="parchment-surface rounded-xl border border-[#556B2F]/15 p-5">
            <div className="font-mono-num text-2xl sm:text-3xl font-bold text-[#556B2F]">
              1.000 m²
            </div>
            <div className="mt-1 text-xs sm:text-sm font-semibold text-[#212122]">
              Ruộng mẫu thực nghiệm
            </div>
            <p className="mt-1 text-xs text-[#585A56] leading-relaxed">
              Không gian thử nghiệm nông nghiệp tái sinh & giống cây bản địa tại Cao Bằng.
            </p>
          </div>
          <div className="parchment-surface rounded-xl border border-[#556B2F]/15 p-5">
            <div className="font-mono-num text-2xl sm:text-3xl font-bold text-[#556B2F]">
              04
            </div>
            <div className="mt-1 text-xs sm:text-sm font-semibold text-[#212122]">
              Nông sản bản địa chủ lực
            </div>
            <p className="mt-1 text-xs text-[#585A56] leading-relaxed">
              Hạt dẻ Trùng Khánh, Thạch đen Đông Khê, Miến dong Phia Đén, Lê Bảo Lạc.
            </p>
          </div>
          <div className="parchment-surface rounded-xl border border-[#556B2F]/15 p-5">
            <div className="font-mono-num text-2xl sm:text-3xl font-bold text-[#556B2F]">
              {communityStats.totalPlayers}
            </div>
            <div className="mt-1 text-xs sm:text-sm font-semibold text-[#212122]">
              Người chơi tham gia
            </div>
            <p className="mt-1 text-xs text-[#585A56] leading-relaxed">
              Đã ghi nhận {communityStats.totalSessions} lượt trải nghiệm trò chơi thực tế.
            </p>
          </div>
          <div className="parchment-surface rounded-xl border border-[#556B2F]/15 p-5">
            <div className="font-mono-num text-2xl sm:text-3xl font-bold text-[#8FA31E]">
              {communityStats.totalInsights}
            </div>
            <div className="mt-1 text-xs sm:text-sm font-semibold text-[#212122]">
              Góc nhìn đóng góp
            </div>
            <p className="mt-1 text-xs text-[#585A56] leading-relaxed">
              Dữ liệu hành vi & đề xuất cộng đồng giúp định hướng dự án Agri-Next.
            </p>
          </div>
        </div>
      </section>

      {/* STICKER HUNT BANNER — 30 limited booth gifts */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden" style={patternStyle('amber', 320)}>
          <div className="bg-[#F4991A]/80 grid md:grid-cols-12 gap-6 items-center p-6 sm:p-8">
            <div className="md:col-span-2 flex justify-center gap-1">
              <LeafMascot mood="cheer" className="w-20 h-20 sm:w-24 sm:h-24" />
              <GrainMascot mood="wave" className="w-16 h-16 sm:w-20 sm:h-20 self-end" />
            </div>
            <div className="md:col-span-7 space-y-2 text-[#212122]">
              <div className="text-xs font-extrabold uppercase tracking-wider">Quà nhỏ tại booth</div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                Săn Sticker Bé Mầm & Bé Hạt
              </h2>
              <p className="text-sm sm:text-base font-medium">
                Đọc về dự án → trả lời đúng 4/5 câu đố → đưa mã cho staff. Mỗi người 1 bộ, chỉ{' '}
                {giftStatus?.total ?? 30} suất!
              </p>
            </div>
            <div className="md:col-span-3 flex flex-col items-stretch md:items-end gap-2">
              <div className="rounded-xl bg-white/90 px-4 py-2 text-center md:text-right">
                <div className="text-[11px] font-bold uppercase text-[#556B2F]">Còn lại</div>
                <div className="font-mono-num text-3xl font-bold text-[#212122] leading-none">
                  {giftStatus ? giftStatus.remaining : '—'}
                  <span className="text-base text-[#585A56]">/{giftStatus?.total ?? 30}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenStickerHunt}
                className="min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#212122] hover:bg-[#3E5021] text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Chơi ngay <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NOW HAPPENING — Cao Bằng Xanh contest + upcoming webinar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-4">
          <button
            type="button"
            onClick={() => onOpenProject('du-an-cao-bang-xanh')}
            className="md:col-span-8 text-left rounded-2xl bg-white border border-[#556B2F]/15 hover:border-[#8FA31E] transition-colors p-5 sm:p-6 flex items-center gap-4 cursor-pointer"
          >
            <LeafMascot mood="telescope" className="w-16 h-16 shrink-0" />
            <div className="flex-1 min-w-0 space-y-1">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#8FA31E]">
                Cuộc thi đang mở · Hạn nộp {CAO_BANG_XANH.dates[1].date}
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-[#212122] leading-snug">
                “{CAO_BANG_XANH.name}” – {CAO_BANG_XANH.subtitle}
              </div>
              <div className="text-xs sm:text-sm text-[#585A56]">
                Bạn trẻ 18–29 tuổi kể chuyện nông nghiệp bản địa Cao Bằng bằng bài viết hoặc video · Giải Nhất 3.000.000đ
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#556B2F] shrink-0 hidden sm:block" />
          </button>
          <button
            type="button"
            onClick={() => onOpenProject('du-an-cao-bang-xanh')}
            className="md:col-span-4 text-left rounded-2xl bg-[#212122] hover:bg-[#2E2E30] transition-colors text-white p-5 sm:p-6 flex flex-col gap-2 cursor-pointer"
          >
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#C6D870]">
              Webinar · {UPCOMING_WEBINAR.date}
            </div>
            <div className="text-lg font-extrabold leading-snug">{UPCOMING_WEBINAR.title}</div>
          </button>
        </div>
      </section>

      {/* CHAPTER 01: DEEP OLIVE HERITAGE PANEL — Bối cảnh & Sứ mệnh Agri-Next */}
      <section id="cau-chuyen-du-an" className="max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="rounded-2xl overflow-hidden bg-[#556B2F] text-white border border-[#3E5021]">
          <div className="grid lg:grid-cols-12 items-stretch">
            {/* Editorial Narrative Left */}
            <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-semibold tracking-wider text-[#C6D870]">
                  01. Bối cảnh & Sứ mệnh dự án
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white">
                  Khi thanh niên vùng cao biến tri thức bản địa thành động lực thích ứng khí hậu
                </h2>
                <p className="text-sm sm:text-base text-[#EFF5D2]/95 leading-relaxed">
                  Cao Bằng sở hữu hệ sinh thái núi đá vôi đặc hữu và kho tàng nông sản quý, nhưng
                  đang đối mặt với hai thách thức song song: <strong>suy thoái đất nông nghiệp</strong>{' '}
                  do thời tiết cực đoan và <strong>làn sóng di cư của lao động trẻ</strong> rời bỏ
                  đồng ruộng.
                </p>
                <p className="text-sm sm:text-base text-[#EFF5D2]/90 leading-relaxed">
                  Agri-Next Vietnam ra đời cùng tinh thần mạng lưới Youth 4 Climate nhằm xây dựng hệ
                  sinh thái học tập, thực nghiệm và khởi nghiệp xanh — giúp thanh niên địa phương và
                  đồng bào dân tộc thiểu số tạo ra sinh kế bền vững ngay trên mảnh đất quê hương.
                </p>
              </div>

              <div className="pt-4 border-t border-[#EFF5D2]/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <LeafMascot mood="idea" className="w-14 h-14 shrink-0" />
                  <div className="text-xs sm:text-sm text-[#EFF5D2]">
                    <div className="font-bold text-white">Bé Mầm nhắn nhủ</div>
                    <div className="opacity-90">
                      Mỗi lựa chọn của bạn trong trò chơi đều đóng góp dữ liệu thật cho dự án!
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onStartGames('farm_sim')}
                  className="px-5 py-2.5 rounded-lg bg-[#EFF5D2] hover:bg-white text-[#556B2F] font-bold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Thử làm nông dân tái sinh
                </button>
                <button
                  type="button"
                  onClick={() => onOpenProject()}
                  className="px-5 py-2.5 rounded-lg bg-[#F4991A] hover:bg-[#D9810D] text-[#212122] font-bold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Xem toàn bộ dự án →
                </button>
              </div>
            </div>

            {/* Illustrated Story Right */}
            <div className="lg:col-span-5 relative bg-[#3E5021] min-h-[280px]">
              <img
                src="/src/assets/images/bootcamp_field_story_1795619410612.jpg"
                alt="Minh họa thanh niên Cao Bằng tham gia trại huấn luyện Bootcamp và canh tác trên ruộng mẫu 1000m2"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <BrocadeStrip tone="moss" heightClass="h-4" />
        </div>
      </section>

      {/* CHAPTER 02: Bản đồ Nông sản Cao Bằng (Interactive Explorer) */}
      <CaoBangExplorer
        className="max-w-6xl mx-auto px-4 sm:px-6"
        kicker="02. Bản đồ Nông sản Đặc hữu Cao Bằng"
        onExploreCrop={onExploreCrop}
        onPlayQuiz={() => onStartGames('cao_bang_quiz')}
      />

      {/* CHAPTER 03: BA TRỤ CỘT HÀNH ĐỘNG & CẦU NỐI TỚI CHUỖI GAME */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-bold tracking-wider text-[#556B2F]">
              03. Hệ sinh thái hành động tại Cao Bằng
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#212122]">
              Ba trụ cột kiến tạo tương lai nông nghiệp bền vững
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-[#585A56]">
            Kết hợp thực nghiệm thực địa, đào tạo thanh niên và truyền thông số
          </div>
        </div>

        {/* Clean Editorial Numbered Bento (Asymmetric, hairline borders, zero nested boxes) */}
        <div className="grid lg:grid-cols-3 gap-6">
          {AGRI_NEXT_PILLARS.map((pillar, idx) => (
            <article
              key={pillar.index}
              className={`rounded-2xl p-7 border flex flex-col justify-between space-y-6 ${
                idx === 1
                  ? 'bg-[#556B2F] text-white border-[#3E5021]'
                  : 'bg-white text-[#212122] border-[#556B2F]/15'
              }`}
            >
              <div className="space-y-3">
                <div
                  className={`font-mono-num text-sm font-bold ${
                    idx === 1 ? 'text-[#C6D870]' : 'text-[#8FA31E]'
                  }`}
                >
                  {pillar.index}.
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold leading-snug">{pillar.title}</h3>
                <div
                  className={`text-xs font-semibold ${
                    idx === 1 ? 'text-[#EFF5D2]' : 'text-[#556B2F]'
                  }`}
                >
                  {pillar.subtitle}
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    idx === 1 ? 'text-[#EFF5D2]/90' : 'text-[#585A56]'
                  }`}
                >
                  {pillar.description}
                </p>
              </div>
              <div
                className={`pt-4 border-t text-xs font-semibold ${
                  idx === 1
                    ? 'border-white/20 text-[#C6D870]'
                    : 'border-[#556B2F]/12 text-[#556B2F]'
                }`}
              >
                {pillar.impactFact}
              </div>
            </article>
          ))}
        </div>

        {/* CHAPTER 04: TRẠM QUÉT MÃ QR TẠI BOOTH — 3 Mã QR hiện sẵn cho từng trò chơi */}
        <div
          id="tram-quet-qr"
          className="scroll-mt-24 rounded-2xl overflow-hidden border border-[#556B2F]/25 bg-[#EFF5D2]"
        >
          <div className="p-6 sm:p-10 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className="text-xs font-bold tracking-wider text-[#556B2F]">
                  04. Trạm Quét Mã QR tại Booth · Chơi ngay trên điện thoại
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#212122] leading-tight">
                  Đọc xong về Cao Bằng? Quét ngay 1 trong 3 mã QR bên dưới để chơi trên điện thoại!
                </h2>
                <p className="text-sm text-[#585A56] leading-relaxed">
                  Nhiều bạn có thể đứng cùng quét mã bằng Camera điện thoại để tìm hiểu nông nghiệp
                  Cao Bằng qua trò chơi trong 2 phút, nhận ngay Huy hiệu check-in đã biết về
                  Agri-Next và chia sẻ lên mạng xã hội.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={onOpenBoothMode}
                  className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#556B2F] hover:bg-[#3E5021] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  <MonitorPlay className="w-4 h-4 text-[#C6D870]" />
                  <span>Chế độ Trình chiếu Booth</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenQrModal('games')}
                  className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F9FBF1] text-[#556B2F] border border-[#556B2F]/25 font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>Đổi link / Tải Poster QR</span>
                </button>
              </div>
            </div>

            {/* 3 ALWAYS-VISIBLE SCANNABLE GAME QR CARDS */}
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  target: 'farm_sim' as const,
                  num: '01',
                  title: 'Mùa Vụ Tái Sinh',
                  desc: '6 mùa vụ quyết định trên ruộng mẫu 1.000 m² Cao Bằng.',
                  reward: 'Huy hiệu Check-in Người Gieo Hạt Tái Sinh',
                  icon: Sprout,
                },
                {
                  target: 'cao_bang_quiz' as const,
                  num: '02',
                  title: 'Thử Thách Kiến Thức',
                  desc: '8 câu đố đặc sản & thích ứng khí hậu nhân điểm combo.',
                  reward: 'Huy hiệu Check-in Thông Thái Cao Bằng',
                  icon: Compass,
                },
                {
                  target: 'market_basket' as const,
                  num: '03',
                  title: 'Khảo Sát Giỏ Quà Xanh',
                  desc: 'Phối đặc sản Cao Bằng với 500.000đ ảo & chia sẻ góc nhìn.',
                  reward: 'Huy hiệu Check-in Đại Sứ Nông Sản Xanh',
                  icon: ShoppingBasket,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.target}
                    className="rounded-2xl bg-white border border-[#556B2F]/20 p-5 sm:p-6 flex flex-col justify-between items-center text-center space-y-4"
                  >
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#556B2F]">
                        <Icon className="w-4 h-4 text-[#8FA31E]" />
                        <span>
                          Trò chơi {item.num} · {item.title}
                        </span>
                      </div>
                      <p className="text-xs text-[#585A56] leading-relaxed">{item.desc}</p>
                    </div>

                    <LiveQrCode
                      target={item.target}
                      sizeClass="w-44 h-44 sm:w-48 sm:h-48"
                      pixelWidth={460}
                    />

                    <div className="w-full space-y-2.5 pt-1">
                      <div className="text-xs font-bold text-[#D9810D]">{item.reward}</div>
                      <div className="flex items-center justify-center gap-3 pt-2 border-t border-[#556B2F]/12">
                        <button
                          type="button"
                          onClick={() => onOpenQrModal(item.target)}
                          className="text-xs font-bold text-[#556B2F] hover:underline cursor-pointer"
                        >
                          Phóng to QR
                        </button>
                        <span aria-hidden="true" className="text-[#556B2F]/30">
                          ·
                        </span>
                        <button
                          type="button"
                          onClick={() => onStartGames(item.target)}
                          className="text-xs font-semibold text-[#585A56] hover:text-[#212122] hover:underline cursor-pointer"
                        >
                          Chơi trên máy này
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#556B2F]/15">
              <div className="flex items-center gap-3">
                <LeafMascot mood="happy" className="w-12 h-12 shrink-0" />
                <GrainMascot mood="wave" className="w-12 h-12 shrink-0" />
                <div className="text-xs sm:text-sm text-[#212122]">
                  <strong>Hoàn thành cả 3 trò chơi trên điện thoại</strong> để mở khóa huy hiệu tối
                  cao <strong>Thủ Lĩnh Nông Nghiệp Xanh</strong> và ghi danh trên bảng xếp hạng!
                </div>
              </div>
              <button
                type="button"
                onClick={() => onStartGames('farm_sim')}
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4991A] hover:bg-[#D9810D] text-[#212122] font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Mở khu vực trò chơi ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <BrocadeStrip tone="amber" heightClass="h-4" />
        </div>
      </section>
    </div>
  );
};
