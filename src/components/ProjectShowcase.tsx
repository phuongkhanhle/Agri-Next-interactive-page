import React from 'react';
import { ArrowRight, CheckCircle2, Gift, Mail, Mic, Quote, Sprout, Trophy, Users } from 'lucide-react';
import { CaoBangExplorer } from './CaoBangExplorer';
import {
  BOOTCAMP_FORMAT,
  BOOTCAMP_MODULES,
  BOOTCAMP_STATS,
  CAMPAIGN_NAME,
  CAMPAIGN_NAME_VI,
  CAMPAIGN_RESULTS,
  CONTEXT_STATS,
  CORE_VALUES,
  EXPECTED_IMPACT,
  FIELD_ZONES,
  FOUNDER_QUOTES,
  PROJECT_GOALS,
  PROJECT_INTRO,
  PROJECT_MISSION,
  PROJECT_PHASES,
  PROJECT_TAGLINE,
  PROJECT_VISION,
  SDGS,
  SHOWCASE_SECTION_LABELS,
  TEAM,
  CAO_BANG_XANH,
  UPCOMING_WEBINAR,
  WEBINARS,
  type ShowcaseSectionId,
} from '../data/projectShowcase';
import {
  AgriNextLogo,
  BrandMotif,
  BrocadeStrip,
  GrainMascot,
  LeafMascot,
  SOCIAL_LINKS,
  SocialDiamondIcon,
  Youth4ClimateLogo,
  patternStyle,
} from './BrandAssets';
import type { GiftStatus } from '../types';

interface ProjectShowcaseProps {
  giftStatus: GiftStatus | null;
  onStartStickerHunt: () => void;
  onPlayCaoBangQuiz: () => void;
  onExploreCrop?: (cropId: string) => void;
}

const SectionKicker: React.FC<{ no: string; children: React.ReactNode; light?: boolean }> = ({
  no,
  children,
  light,
}) => (
  <div
    className={`inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase ${
      light ? 'text-[#C6D870]' : 'text-[#8FA31E]'
    }`}
  >
    <span className="font-mono-num">{no}</span>
    <span className={`h-px w-6 ${light ? 'bg-[#C6D870]' : 'bg-[#8FA31E]'}`} aria-hidden="true" />
    <span>{children}</span>
  </div>
);

const PHASE_TONE: Record<string, { card: string; text: string; sub: string; chip: string }> = {
  olive: {
    card: 'bg-[#556B2F] text-white',
    text: 'text-white',
    sub: 'text-[#EFF5D2]/90',
    chip: 'bg-white/12 text-[#EFF5D2] border-white/20',
  },
  moss: {
    card: 'bg-[#8FA31E] text-white',
    text: 'text-white',
    sub: 'text-white/90',
    chip: 'bg-white/15 text-white border-white/25',
  },
  amber: {
    card: 'bg-[#F4991A] text-[#212122]',
    text: 'text-[#212122]',
    sub: 'text-[#212122]/85',
    chip: 'bg-white/30 text-[#212122] border-[#212122]/10',
  },
};

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  giftStatus,
  onStartStickerHunt,
  onPlayCaoBangQuiz,
  onExploreCrop,
}) => {
  const jumpTo = (id: ShowcaseSectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const remaining = giftStatus?.remaining ?? null;

  return (
    <div className="pb-16">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#556B2F] text-white" style={patternStyle('olive', 360)}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#3E5021]/30 via-transparent to-[#3E5021]/70" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center gap-4">
              <AgriNextLogo variant="horizontal" color="white" className="!h-11" />
              <span className="h-9 w-px bg-white/40" aria-hidden="true" />
              <Youth4ClimateLogo color="white" className="!w-11 !h-11" />
            </div>
            <div className="inline-block bg-[#F4991A] text-[#212122] px-4 py-1.5 text-sm font-bold">
              {PROJECT_TAGLINE}
            </div>
            <h1 className="text-[clamp(1.9rem,4.2vw,3.25rem)] font-black leading-[1.1] tracking-tight heritage-title">
              Câu chuyện dự án Agri-Next Vietnam
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-[#EFF5D2] leading-relaxed max-w-2xl">
              {PROJECT_INTRO}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {(Object.keys(SHOWCASE_SECTION_LABELS) as ShowcaseSectionId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => jumpTo(id)}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  {SHOWCASE_SECTION_LABELS[id]}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4 hidden lg:flex justify-center">
            <LeafMascot mood="point" className="w-56 h-56 drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)]" />
          </div>
        </div>
        <BrocadeStrip tone="amber" heightClass="h-3" className="relative" />
      </section>

      {/* STICKER HUNT REMINDER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-0 pt-6">
        <button
          type="button"
          onClick={onStartStickerHunt}
          className="w-full text-left rounded-2xl border-2 border-dashed border-[#F4991A] bg-[#FFF6E8] hover:bg-[#FFEFD6] transition-colors p-4 sm:p-5 flex items-center gap-4 cursor-pointer"
        >
          <GrainMascot mood="wave" className="w-14 h-14 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm sm:text-base font-extrabold text-[#212122]">
              Đọc kỹ nhé — 5 câu đố Săn Sticker đều nằm trong trang này!
            </div>
            <div className="text-xs sm:text-sm text-[#585A56]">
              {remaining === null
                ? 'Trả lời đúng 4/5 câu để nhận 1 bộ sticker Agri-Next tại booth.'
                : remaining > 0
                  ? `Còn ${remaining}/${giftStatus?.total} bộ sticker — trả lời đúng 4/5 câu để nhận tại booth.`
                  : 'Sticker đã được nhận hết, nhưng bạn vẫn có thể chơi thử thách!'}
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F4991A] text-[#212122] text-sm font-bold whitespace-nowrap">
            <Gift className="w-4 h-4" /> Săn Sticker
          </span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16 pt-12">
        {/* 01 — INTRO & MISSION */}
        <section id="du-an-gioi-thieu" className="scroll-mt-24 grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 parchment-surface rounded-2xl border border-[#556B2F]/15 p-6 sm:p-8 space-y-5">
            <SectionKicker no="01">Giới thiệu & Sứ mệnh</SectionKicker>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-[#212122]">
              Hệ sinh thái học tập – thử nghiệm – lan tỏa nông nghiệp bền vững
            </h2>
            <p className="text-sm sm:text-base text-[#585A56] leading-relaxed">
              Thông qua các hoạt động học hỏi, trải nghiệm và phát triển ý tưởng, Agri-Next mong muốn tạo
              nên một cộng đồng trẻ cùng hành động vì tương lai nông nghiệp Việt Nam tại Cao Bằng — đồng
              hành cùng mạng lưới <strong className="text-[#556B2F]">Youth 4 Climate</strong>.
            </p>
            <div className="rounded-xl bg-[#556B2F] text-white p-5">
              <div className="text-xs font-bold tracking-wider text-[#C6D870] uppercase mb-1.5">Sứ mệnh</div>
              <p className="text-sm sm:text-base font-semibold leading-relaxed">{PROJECT_MISSION}</p>
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#212122] mb-2">Mục tiêu chính</div>
              <ul className="space-y-2">
                {PROJECT_GOALS.map((g) => (
                  <li key={g} className="flex gap-2.5 text-sm text-[#212122] leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#8FA31E]" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-5 grid gap-4">
            {FOUNDER_QUOTES.map((q, i) => (
              <figure
                key={i}
                className={`rounded-2xl p-6 border ${
                  i === 0
                    ? 'bg-[#EFF5D2] border-[#C6D870]'
                    : 'bg-white border-[#556B2F]/15'
                } flex flex-col justify-between gap-4`}
              >
                <Quote className="w-7 h-7 text-[#F4991A]" />
                <blockquote className="text-sm sm:text-base text-[#212122] leading-relaxed font-medium">
                  “{q.quote}”
                </blockquote>
                <figcaption className="text-xs font-bold text-[#556B2F]">— {q.author}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* 02 — CAO BẰNG XANH CONTEST + UPCOMING WEBINAR */}
        <section id="du-an-cao-bang-xanh" className="scroll-mt-24 space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <SectionKicker no="02">Đang diễn ra</SectionKicker>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-[#212122]">
                Cuộc thi “{CAO_BANG_XANH.name}” & Webinar sắp tới
              </h2>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-[#556B2F] text-white text-xs font-bold">
              {CAO_BANG_XANH.hashtag}
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-5 items-stretch">
            {/* Contest card */}
            <article className="lg:col-span-8 rounded-2xl overflow-hidden bg-white border border-[#556B2F]/15 flex flex-col">
              <div className="relative p-6 sm:p-8 text-white" style={patternStyle('moss', 300)}>
                <div className="absolute inset-0 bg-[#3E5021]/55" aria-hidden="true" />
                <div className="relative flex items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider bg-[#F4991A] text-[#212122] px-2.5 py-1">
                      <Trophy className="w-3.5 h-3.5" /> Cuộc thi
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                      {CAO_BANG_XANH.name}
                      <span className="block text-base sm:text-lg font-bold text-[#EFF5D2] mt-1">
                        {CAO_BANG_XANH.subtitle}
                      </span>
                    </h3>
                    <p className="text-sm text-[#EFF5D2] italic">“{CAO_BANG_XANH.theme}”</p>
                  </div>
                  <LeafMascot mood="telescope" className="w-20 h-20 shrink-0 hidden sm:block" />
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 flex-1">
                <p className="text-sm sm:text-base text-[#212122] leading-relaxed">{CAO_BANG_XANH.intro}</p>
                <div className="rounded-xl bg-[#EFF5D2] px-4 py-3 text-sm font-semibold text-[#3E5021]">
                  Ai được tham gia? {CAO_BANG_XANH.who}
                </div>

                <div>
                  <div className="text-sm font-extrabold text-[#212122] mb-3">Chọn 1 trong 4 hướng chủ đề</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {CAO_BANG_XANH.topics.map((t, i) => (
                      <div key={t.title} className="rounded-xl border border-[#556B2F]/15 p-4 flex gap-3">
                        <div className="w-8 h-8 shrink-0 rotate-45 rounded-md bg-[#8FA31E] flex items-center justify-center">
                          <span className="-rotate-45 text-xs font-black text-white">{i + 1}</span>
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-[#212122] leading-snug">{t.title}</div>
                          <div className="text-xs text-[#585A56] mt-0.5">VD: {t.example}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {CAO_BANG_XANH.formats.map((f, i) => (
                    <div key={f.title} className="rounded-xl bg-[#F9FBF1] border border-[#C6D870] p-4">
                      <div className="text-xs font-bold text-[#8FA31E] uppercase">Dạng {i + 1}</div>
                      <div className="text-sm font-extrabold text-[#212122]">{f.title}</div>
                      <div className="text-xs text-[#585A56] mt-0.5">{f.detail}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#585A56]">
                  <strong className="text-[#556B2F]">Điểm cộng:</strong> {CAO_BANG_XANH.bonus} Chấm điểm:{' '}
                  {CAO_BANG_XANH.scoring}.
                </p>

                <div className="grid sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-5 space-y-2">
                    <div className="text-sm font-extrabold text-[#212122]">Mốc quan trọng</div>
                    {CAO_BANG_XANH.dates.map((d, i) => (
                      <div key={d.date} className="flex items-center gap-3 text-sm">
                        <span
                          className={`font-mono-num font-bold px-2 py-0.5 rounded ${
                            i === 1 ? 'bg-[#F4991A] text-[#212122]' : 'bg-[#EFF5D2] text-[#556B2F]'
                          }`}
                        >
                          {d.date}
                        </span>
                        <span className="text-[#212122]">{d.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="sm:col-span-7 space-y-2">
                    <div className="text-sm font-extrabold text-[#212122]">Giải thưởng</div>
                    <div className="grid grid-cols-2 gap-2">
                      {CAO_BANG_XANH.prizes.map((pz, i) => (
                        <div
                          key={pz.title}
                          className={`rounded-lg p-3 ${i === 0 ? 'bg-[#F4991A] text-[#212122]' : 'bg-[#EFF5D2] text-[#212122]'}`}
                        >
                          <div className="text-[11px] font-bold uppercase opacity-80">{pz.title}</div>
                          <div className={`font-extrabold ${i < 3 ? 'font-mono-num text-base' : 'text-xs leading-snug'}`}>
                            {pz.value}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-[#585A56]">{CAO_BANG_XANH.allEntrants}</div>
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 py-4 bg-[#556B2F] text-white flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-[#EFF5D2] max-w-xl">{CAO_BANG_XANH.howToSubmit}</p>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F4991A] hover:bg-[#D9810D] text-[#212122] text-sm font-bold whitespace-nowrap"
                >
                  Xem thể lệ & nộp bài <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </article>

            {/* Webinar card */}
            <article className="lg:col-span-4 lg:self-start lg:sticky lg:top-24 rounded-2xl overflow-hidden bg-[#212122] text-white flex flex-col">
              <div className="p-6 sm:p-7 flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#C6D870]">
                    <Mic className="w-3.5 h-3.5" /> Webinar
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F4991A] text-[#212122]">
                    {UPCOMING_WEBINAR.status}
                  </span>
                </div>
                <h3 className="text-2xl font-black leading-tight">{UPCOMING_WEBINAR.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{UPCOMING_WEBINAR.blurb}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-[#556B2F] p-3 text-center">
                    <div className="text-lg font-black">Kinh tế</div>
                    <div className="text-[11px] text-[#EFF5D2]">thu nhập cho nông dân trẻ</div>
                  </div>
                  <div className="rounded-xl bg-[#8FA31E] p-3 text-center">
                    <div className="text-lg font-black">Bền vững</div>
                    <div className="text-[11px] text-white/90">đất, rừng & khí hậu</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <LeafMascot mood="video" className="w-16 h-16 shrink-0" />
                  <p className="text-xs text-white/75">Bạn chọn bên nào? Mang câu trả lời của bạn đến webinar nhé!</p>
                </div>
              </div>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 bg-[#F4991A] hover:bg-[#D9810D] text-[#212122] text-sm font-extrabold flex items-center justify-between gap-2"
              >
                {UPCOMING_WEBINAR.cta}
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </article>
          </div>
        </section>

        {/* 02 — CONTEXT */}
        <section id="du-an-boi-canh" className="scroll-mt-24 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <SectionKicker no="03">Bối cảnh</SectionKicker>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-[#212122] max-w-2xl">
                Vì sao Cao Bằng cần những “mầm rễ trẻ”?
              </h2>
            </div>
            <LeafMascot mood="curious" className="w-20 h-20 hidden sm:block" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {CONTEXT_STATS.map((s, i) => (
              <div
                key={s.label}
                className={`rounded-2xl p-6 ${
                  i === 2 ? 'bg-[#C6D870] text-[#212122]' : 'bg-[#212122] text-white'
                }`}
              >
                <div className={`text-4xl sm:text-5xl font-black ${i === 2 ? 'text-[#556B2F]' : 'text-[#F4991A]'}`}>
                  {s.value}
                </div>
                <div className="mt-2 text-sm sm:text-base font-semibold leading-snug">{s.label}</div>
                {s.source && <div className="mt-2 text-xs opacity-70">Nguồn: {s.source}</div>}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-[#556B2F]/15 bg-white p-6">
            <div className="text-sm font-extrabold text-[#212122] mb-3">Tác động kỳ vọng</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {EXPECTED_IMPACT.map((t) => (
                <div key={t} className="flex gap-2.5 text-sm text-[#212122]">
                  <Sprout className="w-4 h-4 mt-0.5 shrink-0 text-[#8FA31E]" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 04 — CAO BẰNG AGRICULTURE (interactive explorer, restored from v1) */}
        <div id="du-an-nong-nghiep-cao-bang" className="scroll-mt-24 space-y-4">
          <div className="space-y-2">
            <SectionKicker no="04">Nông nghiệp Cao Bằng</SectionKicker>
            <p className="text-sm sm:text-base text-[#585A56] max-w-3xl">
              Trước khi đến với hoạt động của Agri-Next, cùng hiểu vì sao những nông sản núi rừng Cao Bằng đáng
              được gìn giữ — chạm vào từng nông sản để xem câu chuyện của nó.
            </p>
          </div>
          <CaoBangExplorer
            id="ban-do-nong-san-du-an"
            kicker="Bản đồ Nông sản Đặc hữu Cao Bằng"
            onExploreCrop={onExploreCrop}
            onPlayQuiz={onPlayCaoBangQuiz}
          />
        </div>

        {/* 03 — 3 PHASES */}
        <section id="du-an-giai-doan" className="scroll-mt-24 space-y-6">
          <div className="space-y-2">
            <SectionKicker no="05">3 hoạt động chính</SectionKicker>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-[#212122]">
              Học — Thực hành — Lan tỏa
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {PROJECT_PHASES.map((p) => {
              const t = PHASE_TONE[p.tone];
              return (
                <article key={p.no} className={`relative rounded-2xl overflow-hidden ${t.card} flex flex-col`}>
                  <div className="p-6 flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className={`font-mono-num text-4xl font-bold ${t.text} opacity-90`}>{p.no}</div>
                      <LeafMascot mood={p.mascot} className="w-16 h-16 -mt-1 -mr-1" />
                    </div>
                    <h3 className={`text-lg font-extrabold leading-snug ${t.text}`}>{p.title}</h3>
                    <p className={`text-sm leading-relaxed ${t.sub}`}>{p.summary}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.bullets.map((b) => (
                        <span key={b} className={`text-[11px] font-semibold px-2 py-1 rounded-md border ${t.chip}`}>
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                  <BrocadeStrip tone={p.tone === 'amber' ? 'olive' : 'lime'} heightClass="h-2.5" />
                </article>
              );
            })}
          </div>
        </section>

        {/* 04 — BOOTCAMP */}
        <section id="du-an-bootcamp" className="scroll-mt-24 rounded-2xl overflow-hidden border border-[#556B2F]/15 bg-white">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-2">
                <SectionKicker no="06">Bootcamp Agri-Next</SectionKicker>
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-[#212122]">
                  5 ngày · 20 học viên · 6 module
                </h2>
                <p className="text-sm text-[#585A56] max-w-2xl">
                  Kết nối thanh niên với chuyên gia, nông dân và đất đai — học canh tác rau hữu cơ, dược
                  liệu như đinh lăng, sa nhân, cải mèo; kết thúc bằng phần pitching ý tưởng khởi nghiệp.
                </p>
              </div>
              <div className="flex gap-2">
                {BOOTCAMP_FORMAT.map((f) => (
                  <div key={f.label} className="rounded-xl bg-[#EFF5D2] px-3 py-2 text-center">
                    <div className="text-sm font-black text-[#556B2F]">{f.value}</div>
                    <div className="text-[10px] font-semibold text-[#585A56] leading-tight max-w-[80px]">{f.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {BOOTCAMP_STATS.map((s) => (
                <div key={s.label} className="rounded-xl p-4 text-white" style={patternStyle('moss', 260)}>
                  <div className="font-mono-num text-3xl font-bold">{s.value}</div>
                  <div className="text-xs font-semibold mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {BOOTCAMP_MODULES.map((m) => (
                <div key={m.no} className="rounded-xl border border-[#556B2F]/15 p-4 flex gap-3">
                  <div className="w-9 h-9 shrink-0 rotate-45 rounded-md bg-[#556B2F] flex items-center justify-center">
                    <span className="-rotate-45 text-xs font-black text-white">M{m.no}</span>
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-[#212122]">{m.title}</div>
                    <div className="text-xs text-[#585A56] leading-relaxed mt-0.5">{m.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 07 — DEMO FIELD (simplified: native vegetable garden + medicinal garden) */}
        <section id="du-an-ruong-mau" className="scroll-mt-24 grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 rounded-2xl overflow-hidden relative min-h-[280px]">
            <img
              src="/src/assets/images/bootcamp_field_story_1795619410612.jpg"
              alt="Minh họa thanh niên thực hành tại ruộng mẫu Agri-Next"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#212122]/85 to-transparent p-6">
              <div className="font-mono-num text-4xl font-bold text-white">1.000 m²</div>
              <div className="text-sm font-semibold text-[#EFF5D2]">Ruộng mẫu Agri-Next tại Cao Bằng</div>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <SectionKicker no="07">Không gian Ruộng mẫu</SectionKicker>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-[#212122]">
              Một khu vườn để thanh niên học từ đất
            </h2>
            <p className="text-sm sm:text-base text-[#585A56] leading-relaxed">
              Ruộng mẫu là không gian do chính các bạn trẻ vận hành — nơi thực hành canh tác tái sinh và khám phá lại
              các loài cây bản địa của Cao Bằng.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {FIELD_ZONES.map((z) => (
                <div key={z.name} className="rounded-2xl bg-[#EFF5D2] border border-[#C6D870] p-5 space-y-2">
                  <LeafMascot mood={z.mascot} className="w-14 h-14" />
                  <div className="text-base font-extrabold text-[#212122]">{z.name}</div>
                  <div className="text-sm text-[#585A56] leading-relaxed">{z.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 06 — CAMPAIGN */}
        <section id="du-an-chien-dich" className="scroll-mt-24 rounded-2xl overflow-hidden text-white" style={patternStyle('olive', 380)}>
          <div className="p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center bg-[#3E5021]/40">
            <div className="lg:col-span-5 space-y-4">
              <SectionKicker no="08" light>
                Chiến dịch truyền thông số
              </SectionKicker>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">“{CAMPAIGN_NAME}”</h2>
              <p className="text-sm text-[#EFF5D2]">
                {CAMPAIGN_NAME_VI} — tôn vinh thanh niên nông thôn như những người kiến tạo thay đổi, mục tiêu
                500.000 lượt tiếp cận. Kết quả tháng 3 – 10/2026:
              </p>
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#C6D870] uppercase tracking-wider">03 webinar đã tổ chức</div>
                {WEBINARS.map((w, i) => (
                  <div key={w} className="text-sm text-white/95">
                    <span className="font-mono-num text-[#F4991A] mr-2">#{i + 1}</span>
                    {w}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CAMPAIGN_RESULTS.map((r, i) => (
                <div
                  key={r.label}
                  className={`rounded-xl p-4 ${i < 3 ? 'bg-[#F4991A] text-[#212122]' : 'bg-white/12 border border-white/20'}`}
                >
                  <div className="font-mono-num text-2xl sm:text-3xl font-bold">{r.value}</div>
                  <div className="text-xs font-semibold mt-1 opacity-90">{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 07 — VISION & VALUES */}
        <section id="du-an-gia-tri" className="scroll-mt-24 space-y-6">
          <div className="space-y-2">
            <SectionKicker no="09">Tầm nhìn & Giá trị cốt lõi</SectionKicker>
            <p className="text-lg sm:text-xl font-bold text-[#212122] leading-relaxed max-w-4xl">“{PROJECT_VISION}”</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {CORE_VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white border border-[#556B2F]/15 p-6 flex gap-4 items-start">
                <BrandMotif kind={v.motif} className="w-14 h-14 shrink-0" />
                <div>
                  <div className="text-lg font-extrabold text-[#556B2F]">{v.title}</div>
                  <div className="text-sm text-[#585A56] leading-relaxed">{v.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#585A56]">
            <span>Đóng góp vào Mục tiêu Phát triển Bền vững của Liên Hợp Quốc:</span>
            {SDGS.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-md bg-[#556B2F] text-white font-bold">
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#556B2F]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#212122]">Đội ngũ Agri-Next</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {TEAM.founders.map((m) => (
              <div key={m.name} className="rounded-2xl bg-[#556B2F] text-white p-5 flex items-center gap-4">
                <div className="w-12 h-12 rotate-45 rounded-lg bg-[#C6D870] flex items-center justify-center shrink-0">
                  <span className="-rotate-45 font-black text-[#556B2F]">
                    {m.name.split(' ').slice(-1)[0][0]}
                  </span>
                </div>
                <div>
                  <div className="font-extrabold">{m.name}</div>
                  <div className="text-xs text-[#EFF5D2]">{m.role}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TEAM.leads.map((m) => (
              <div key={m.name} className="rounded-xl bg-[#EFF5D2] p-3">
                <div className="text-sm font-bold text-[#212122] leading-snug">{m.name}</div>
                <div className="text-[11px] text-[#585A56] mt-0.5">{m.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA / CONTACT */}
        <section className="rounded-2xl overflow-hidden bg-[#EFF5D2] border border-[#C6D870]">
          <div className="grid md:grid-cols-12 gap-6 items-center p-6 sm:p-10">
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#212122] leading-tight">
                Mọi sự thay đổi lớn đều bắt đầu từ những hạt giống nhỏ.
              </h2>
              <p className="text-sm sm:text-base text-[#585A56]">
                Hãy cùng Agri-Next Vietnam trao quyền cho thế hệ trẻ và bảo vệ hành tinh xanh. Theo dõi dự án
                hoặc liên hệ đồng hành:
              </p>
              <div className="flex flex-wrap gap-3">
                {(['facebook', 'instagram', 'linkedin'] as const).map((p) => (
                  <a
                    key={p}
                    href={SOCIAL_LINKS[p]}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#556B2F] hover:text-[#212122]"
                  >
                    <SocialDiamondIcon platform={p} tone="olive" className="w-9 h-9" />
                    <span className="capitalize">{p}</span>
                  </a>
                ))}
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#556B2F] hover:text-[#212122]"
                >
                  <Mail className="w-5 h-5" /> {SOCIAL_LINKS.email}
                </a>
              </div>
            </div>
            <div className="md:col-span-5 flex flex-col items-center md:items-end gap-3">
              <button
                type="button"
                onClick={onStartStickerHunt}
                className="min-h-[52px] inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#F4991A] hover:bg-[#D9810D] text-[#212122] font-extrabold text-base transition-colors cursor-pointer"
              >
                <Gift className="w-5 h-5" />
                Đọc xong rồi — Săn Sticker thôi!
                <ArrowRight className="w-4 h-4" />
              </button>
              {remaining !== null && (
                <div className="text-xs font-semibold text-[#585A56]">
                  Còn <span className="font-mono-num text-[#212122]">{remaining}</span>/{giftStatus?.total} bộ sticker
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
