import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Gift,
  Lightbulb,
  Loader2,
  RotateCcw,
  Store,
  XCircle,
} from 'lucide-react';
import {
  SHOWCASE_SECTION_LABELS,
  STICKER_PASS_SCORE,
  STICKER_QUESTIONS,
  STICKER_QUIZ_LENGTH,
  UPCOMING_WEBINAR,
  type ShowcaseSectionId,
  type StickerQuestion,
} from '../data/projectShowcase';
import { WebinarSignupForm } from './WebinarSignupForm';
import { BrocadeStrip, GrainMascot, LeafMascot, patternStyle } from './BrandAssets';
import type { GiftClaimRecord, GiftStatus } from '../types';
import { gameSound } from '../utils/sound';
import { launchConfetti } from '../utils/confetti';

interface StickerHuntProps {
  deviceId: string;
  playerId: string | null;
  giftStatus: GiftStatus | null;
  onGiftStatus: (s: GiftStatus) => void;
  onOpenProject: (section?: ShowcaseSectionId) => void;
  onPlayMoreGames: () => void;
}

type Phase = 'intro' | 'quiz' | 'result' | 'voucher';

function shuffle<T>(arr: T[]): T[] {
  const pool = [...arr];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

/** Each round mixes: 2 về nông nghiệp Cao Bằng, 1 về cuộc thi Cao Bằng Xanh, còn lại về dự án. */
function pickQuestions(): StickerQuestion[] {
  const agri = shuffle(STICKER_QUESTIONS.filter((q) => q.section === 'du-an-nong-nghiep-cao-bang')).slice(0, 2);
  const contest = shuffle(STICKER_QUESTIONS.filter((q) => q.section === 'du-an-cao-bang-xanh')).slice(0, 1);
  const picked = new Set([...agri, ...contest].map((q) => q.id));
  const rest = shuffle(STICKER_QUESTIONS.filter((q) => !picked.has(q.id))).slice(
    0,
    STICKER_QUIZ_LENGTH - picked.size
  );
  return shuffle([...agri, ...contest, ...rest]);
}

const STICKER_SHEET = [
  'mascot-leaf-cheer',
  'mascot-seed-run',
  'mascot-leaf-idea',
  'mascot-leaf-telescope',
  'mascot-seed-stand',
  'mascot-leaf-check',
];

/** Decorative "sticker sheet" preview made from the official mascots. */
const StickerSheet: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative rounded-2xl bg-white border-2 border-dashed border-[#C6D870] p-4 grid grid-cols-3 gap-2 ${className}`}
    aria-label="Bộ sticker Agri-Next"
  >
    {STICKER_SHEET.map((s, i) => (
      <div
        key={s}
        className="aspect-square rounded-xl bg-[#F9FBF1] flex items-center justify-center shadow-[0_2px_0_#E8E9EB]"
        style={{ transform: `rotate(${[-6, 4, -3, 5, -4, 3][i]}deg)` }}
      >
        <img src={`/brand/${s}.png`} alt="" className="w-4/5 h-4/5 object-contain" />
      </div>
    ))}
  </div>
);

export const StickerHunt: React.FC<StickerHuntProps> = ({
  deviceId,
  playerId,
  giftStatus,
  onGiftStatus,
  onOpenProject,
  onPlayMoreGames,
}) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<StickerQuestion[]>(() => pickQuestions());
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem('agrinext_sticker_name') ?? '';
    } catch {
      return '';
    }
  });
  const [claim, setClaim] = useState<GiftClaimRecord | null>(null);
  const [claimLoading, setClaimLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [soldOut, setSoldOut] = useState(false);

  // Restore an existing claim for this device
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/gifts/mine/${encodeURIComponent(deviceId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (data.status) onGiftStatus(data.status);
        if (data.claim) {
          setClaim(data.claim);
          setPhase('voucher');
        }
      })
      .catch(() => {})
      .finally(() => !cancelled && setClaimLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);

  const current = questions[index];
  const correctCount = useMemo(
    () => questions.filter((q) => answers[q.id] === q.answer).length,
    [questions, answers]
  );
  const passed = correctCount >= STICKER_PASS_SCORE;
  const remaining = giftStatus?.remaining ?? null;
  const total = giftStatus?.total ?? 30;
  const outOfGifts = remaining !== null && remaining <= 0;

  const startQuiz = () => {
    gameSound.click();
    setQuestions(pickQuestions());
    setAnswers({});
    setIndex(0);
    setRevealed(false);
    setError(null);
    setPhase('quiz');
  };

  const choose = (choice: number) => {
    if (revealed) return;
    setAnswers((a) => ({ ...a, [current.id]: choice }));
    setRevealed(true);
    if (choice === current.answer) gameSound.correct();
    else gameSound.wrong();
  };

  const next = () => {
    gameSound.click();
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setRevealed(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPhase('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const finalCorrect = questions.filter((q) => answers[q.id] === q.answer).length;
      if (finalCorrect >= STICKER_PASS_SCORE) {
        gameSound.harvest();
        launchConfetti('badge');
      }
    }
  };

  const submitClaim = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Nhập tên (ít nhất 2 ký tự) để staff gọi bạn khi phát quà nhé!');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      try {
        localStorage.setItem('agrinext_sticker_name', trimmed);
      } catch {
        /* ignore */
      }
      const res = await fetch('/api/gifts/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          playerId,
          name: trimmed,
          answers: questions.map((q) => ({ id: q.id, choice: answers[q.id] })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.status) onGiftStatus(data.status);
      if (res.ok && data.claim) {
        setClaim(data.claim);
        setPhase('voucher');
        launchConfetti('master');
        return;
      }
      if (data.soldOut) setSoldOut(true);
      setError(data.error ?? 'Có lỗi kết nối, bạn thử lại giúp mình nhé.');
    } catch {
      setError('Có lỗi kết nối, bạn thử lại giúp mình nhé.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------- */

  const Counter = (
    <div className="inline-flex items-center gap-3 rounded-2xl bg-white/95 text-[#212122] px-4 py-3 shadow-sm border border-[#C6D870]">
      <Gift className="w-6 h-6 text-[#F4991A] shrink-0" />
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#556B2F]">Sticker còn lại</div>
        <div className="font-mono-num text-2xl font-bold leading-none">
          {remaining === null ? '—' : remaining}
          <span className="text-base text-[#585A56]">/{total}</span>
        </div>
      </div>
      <div className="hidden sm:flex gap-[3px] flex-wrap w-[150px]" aria-hidden="true">
        {Array.from({ length: Math.min(total, 60) }).map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rotate-45 rounded-[2px] ${
              remaining !== null && i < total - remaining ? 'bg-[#E8E9EB]' : 'bg-[#F4991A]'
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="pb-16">
      {/* HEADER BAND */}
      <section className="relative overflow-hidden text-white" style={patternStyle('olive', 340)}>
        <div className="absolute inset-0 bg-[#3E5021]/45" aria-hidden="true" />
        <div className={`relative max-w-5xl mx-auto px-4 sm:px-6 ${phase === 'intro' ? 'py-8' : 'py-5'} sm:py-10 flex flex-wrap items-center justify-between gap-6`}>
          <div className="space-y-2 max-w-xl">
            <div className="inline-block bg-[#F4991A] text-[#212122] px-3 py-1 text-xs font-extrabold uppercase tracking-wider">
              Trò chơi tại booth
            </div>
            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-tight heritage-title">
              Săn Sticker Agri-Next
            </h1>
            <p className={`text-sm sm:text-base text-[#EFF5D2] ${phase === 'intro' ? '' : 'hidden sm:block'}`}>
              Đọc về dự án · trả lời {STICKER_QUIZ_LENGTH} câu đố · đúng {STICKER_PASS_SCORE}/{STICKER_QUIZ_LENGTH} câu là
              nhận ngay <strong className="text-white">1 bộ sticker Bé Mầm & Bé Hạt</strong>. Chỉ có {total} suất thôi!
            </p>
          </div>
          {Counter}
        </div>
        <BrocadeStrip tone="amber" heightClass="h-2.5" className="relative" />
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {claimLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#556B2F]" />
          </div>
        ) : (
          <>
            {/* INTRO */}
            {phase === 'intro' && (
              <div className="grid lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-4">
                  {[
                    {
                      icon: BookOpen,
                      title: 'Đọc về dự án',
                      text: 'Lướt trang “Dự án” — mọi đáp án đều nằm trong đó (đọc trên điện thoại hoặc màn hình booth).',
                      mascot: 'telescope' as const,
                    },
                    {
                      icon: Lightbulb,
                      title: `Trả lời ${STICKER_QUIZ_LENGTH} câu đố`,
                      text: `Câu hỏi được chọn ngẫu nhiên. Đúng từ ${STICKER_PASS_SCORE} câu trở lên là đạt.`,
                      mascot: 'idea' as const,
                    },
                    {
                      icon: Store,
                      title: 'Đưa mã cho staff',
                      text: 'Bạn nhận mã quà trên màn hình — đưa cho bạn staff tại booth để nhận sticker. Mỗi người 1 suất.',
                      mascot: 'check' as const,
                    },
                  ].map((s, i) => (
                    <div key={s.title} className="flex items-center gap-4 rounded-2xl bg-white border border-[#556B2F]/15 p-4 sm:p-5">
                      <div className="w-10 h-10 shrink-0 rotate-45 rounded-lg bg-[#556B2F] flex items-center justify-center">
                        <span className="-rotate-45 font-mono-num font-bold text-white">{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-extrabold text-[#212122]">{s.title}</div>
                        <div className="text-sm text-[#585A56] leading-relaxed">{s.text}</div>
                      </div>
                      <LeafMascot mood={s.mascot} className="w-14 h-14 shrink-0 hidden sm:block" />
                    </div>
                  ))}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={startQuiz}
                      className="min-h-[52px] inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4991A] hover:bg-[#D9810D] text-[#212122] font-extrabold transition-colors cursor-pointer"
                    >
                      Bắt đầu săn sticker <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenProject()}
                      className="min-h-[52px] inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#EFF5D2] hover:bg-[#E2EDB5] text-[#556B2F] font-bold transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" /> Đọc về dự án trước
                    </button>
                  </div>
                  {outOfGifts && (
                    <p className="text-sm font-semibold text-[#D9810D]">
                      Sticker đã được nhận hết rồi — cảm ơn bạn đã ghé booth! Bạn vẫn có thể chơi thử thách cho vui nhé.
                    </p>
                  )}
                </div>
                <div className="lg:col-span-5 space-y-3">
                  <StickerSheet />
                  <p className="text-xs text-center text-[#585A56]">
                    Phần quà: 1 bộ sticker nhân vật Agri-Next (minh hoạ). Số lượng có hạn — ai nhanh tay thì nhận trước!
                  </p>
                </div>
              </div>
            )}

            {/* QUIZ */}
            {phase === 'quiz' && current && (
              <div className="max-w-2xl mx-auto space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-bold text-[#556B2F]">
                    Câu <span className="font-mono-num">{index + 1}</span>/{questions.length}
                  </div>
                  <div className="flex gap-1.5" aria-hidden="true">
                    {questions.map((q, i) => {
                      const a = answers[q.id];
                      const state =
                        a === undefined ? 'todo' : a === q.answer ? 'ok' : 'bad';
                      return (
                        <span
                          key={q.id}
                          className={`w-3.5 h-3.5 rotate-45 rounded-[3px] ${
                            state === 'ok'
                              ? 'bg-[#8FA31E]'
                              : state === 'bad'
                                ? 'bg-[#D9810D]'
                                : i === index
                                  ? 'bg-[#556B2F]'
                                  : 'bg-[#E8E9EB]'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-[#556B2F]/15 p-5 sm:p-7 space-y-5">
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#212122] leading-snug">{current.question}</h2>
                  <div className="grid gap-2.5">
                    {current.options.map((opt, i) => {
                      const picked = answers[current.id] === i;
                      const isAnswer = i === current.answer;
                      let cls = 'border-[#556B2F]/20 bg-[#F9FBF1] hover:border-[#8FA31E] hover:bg-[#EFF5D2]';
                      if (revealed) {
                        if (isAnswer) cls = 'border-[#8FA31E] bg-[#EFF5D2]';
                        else if (picked) cls = 'border-[#D9810D] bg-[#FFF1DE]';
                        else cls = 'border-[#556B2F]/10 bg-white opacity-60';
                      }
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={revealed}
                          onClick={() => choose(i)}
                          className={`min-h-[52px] w-full text-left rounded-xl border-2 px-4 py-3 text-sm sm:text-base font-semibold text-[#212122] transition-colors flex items-center gap-3 ${cls} ${
                            revealed ? 'cursor-default' : 'cursor-pointer'
                          }`}
                        >
                          <span className="w-7 h-7 shrink-0 rounded-lg bg-white border border-[#556B2F]/20 flex items-center justify-center text-xs font-bold text-[#556B2F]">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {revealed && isAnswer && <CheckCircle2 className="w-5 h-5 text-[#8FA31E] shrink-0" />}
                          {revealed && picked && !isAnswer && <XCircle className="w-5 h-5 text-[#D9810D] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {revealed && (
                    <div className="rounded-xl bg-[#EFF5D2] p-4 flex gap-3 items-start">
                      <LeafMascot
                        mood={answers[current.id] === current.answer ? 'cheer' : 'curious'}
                        className="w-12 h-12 shrink-0"
                      />
                      <div className="text-sm text-[#212122] space-y-1">
                        <div className="font-extrabold">
                          {answers[current.id] === current.answer ? 'Chính xác!' : 'Chưa đúng rồi…'}
                        </div>
                        <div className="text-[#585A56]">{current.explain}</div>
                        <div className="text-xs text-[#556B2F] font-semibold">
                          Xem thêm ở phần “{SHOWCASE_SECTION_LABELS[current.section]}” trên trang Dự án.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {revealed && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={next}
                      className="min-h-[48px] inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#556B2F] hover:bg-[#3E5021] text-white font-bold transition-colors cursor-pointer"
                    >
                      {index + 1 < questions.length ? 'Câu tiếp theo' : 'Xem kết quả'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* RESULT */}
            {phase === 'result' && (
              <div className="max-w-2xl mx-auto">
                <div className="rounded-2xl bg-white border border-[#556B2F]/15 overflow-hidden">
                  <div className="p-6 sm:p-8 text-center space-y-3">
                    <LeafMascot mood={passed ? 'cheer' : 'curious'} className="w-28 h-28 mx-auto" />
                    <div className="font-mono-num text-5xl font-bold text-[#556B2F]">
                      {correctCount}/{questions.length}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#212122]">
                      {passed ? 'Tuyệt vời! Bạn đã hiểu Agri-Next rồi đó 🎉' : 'Suýt nữa thôi!'}
                    </h2>
                    <p className="text-sm text-[#585A56] max-w-md mx-auto">
                      {passed
                        ? outOfGifts
                          ? 'Tiếc quá, sticker vừa hết suất. Cảm ơn bạn đã tìm hiểu dự án cùng tụi mình!'
                          : 'Nhập tên của bạn để nhận mã quà, rồi đưa màn hình cho staff tại booth nhé.'
                        : `Cần đúng ít nhất ${STICKER_PASS_SCORE} câu. Đọc lại các phần gợi ý bên dưới rồi thử lại — câu hỏi sẽ được đổi mới!`}
                    </p>
                  </div>

                  {passed && !outOfGifts && !soldOut && (
                    <div className="border-t border-[#556B2F]/10 bg-[#F9FBF1] p-6 sm:p-8 space-y-3">
                      <label htmlFor="sticker-name" className="block text-sm font-bold text-[#212122]">
                        Tên của bạn (để staff gọi khi phát quà)
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          id="sticker-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          maxLength={40}
                          placeholder="VD: Minh Anh"
                          className="flex-1 min-h-[52px] rounded-xl border-2 border-[#556B2F]/20 focus:border-[#8FA31E] outline-none px-4 text-base bg-white"
                          onKeyDown={(e) => e.key === 'Enter' && submitClaim()}
                        />
                        <button
                          type="button"
                          onClick={submitClaim}
                          disabled={submitting}
                          className="min-h-[52px] inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-[#F4991A] hover:bg-[#D9810D] disabled:opacity-60 text-[#212122] font-extrabold transition-colors cursor-pointer"
                        >
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
                          Nhận mã quà
                        </button>
                      </div>
                    </div>
                  )}

                  {!passed && (
                    <div className="border-t border-[#556B2F]/10 bg-[#F9FBF1] p-6 space-y-3">
                      <div className="text-sm font-bold text-[#212122]">Gợi ý đọc lại:</div>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(
                          new Set(questions.filter((q) => answers[q.id] !== q.answer).map((q) => q.section))
                        ).map((sec) => (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => onOpenProject(sec)}
                            className="px-3 py-1.5 rounded-full bg-[#EFF5D2] hover:bg-[#E2EDB5] text-xs font-bold text-[#556B2F] cursor-pointer"
                          >
                            {SHOWCASE_SECTION_LABELS[sec]} →
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {error && <div className="px-6 pb-6 text-sm font-semibold text-[#D9810D]">{error}</div>}
                </div>

                <div className="flex flex-wrap justify-center gap-3 mt-5">
                  <button
                    type="button"
                    onClick={startQuiz}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#556B2F] hover:bg-[#3E5021] text-white font-bold cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> Chơi lại
                  </button>
                  <button
                    type="button"
                    onClick={onPlayMoreGames}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#EFF5D2] hover:bg-[#E2EDB5] text-[#556B2F] font-bold cursor-pointer"
                  >
                    Chơi thêm mini-game khác
                  </button>
                </div>
              </div>
            )}

            {/* VOUCHER */}
            {phase === 'voucher' && claim && (
              <div className="max-w-md mx-auto space-y-5">
                <div className="relative rounded-3xl overflow-hidden bg-white border-2 border-[#556B2F] shadow-lg">
                  <div className="p-5 text-white flex items-center justify-between" style={patternStyle('olive', 300)}>
                    <img src="/brand/logo-horizontal-white.png" alt="Agri-Next Vietnam" className="h-9 w-auto" />
                    <img src="/brand/y4c-white.png" alt="Youth 4 Climate" className="h-9 w-9 object-contain" />
                  </div>
                  <div className="px-6 pt-6 pb-4 text-center space-y-2">
                    <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8FA31E]">Phiếu nhận sticker</div>
                    <div className="text-lg font-extrabold text-[#212122]">Xin chào {claim.name}!</div>
                    <div className="mx-auto inline-block rounded-2xl bg-[#EFF5D2] border-2 border-dashed border-[#8FA31E] px-6 py-4">
                      <div className="font-mono-num text-3xl sm:text-4xl font-bold tracking-wider text-[#556B2F]">
                        {claim.code}
                      </div>
                    </div>
                    <div className="text-sm text-[#585A56]">
                      Suất <span className="font-mono-num font-bold text-[#212122]">#{claim.slot}</span>/{total} ·
                      Đúng {claim.score}/{claim.outOf} câu
                    </div>
                  </div>
                  {/* perforation */}
                  <div className="relative h-6 flex items-center" aria-hidden="true">
                    <span className="absolute -left-3 w-6 h-6 rounded-full bg-[#F9FBF1] border-2 border-[#556B2F]" />
                    <span className="w-full border-t-2 border-dashed border-[#C6D870] mx-5" />
                    <span className="absolute -right-3 w-6 h-6 rounded-full bg-[#F9FBF1] border-2 border-[#556B2F]" />
                  </div>
                  <div className="px-6 pt-2 pb-6 flex items-center gap-4">
                    <GrainMascot mood="wave" className="w-16 h-16 shrink-0" />
                    <div className="text-sm text-[#212122]">
                      {claim.redeemedAt ? (
                        <>
                          <div className="font-extrabold text-[#8FA31E]">Đã nhận quà ✓</div>
                          <div className="text-[#585A56]">Cảm ơn bạn đã ghé booth Agri-Next!</div>
                        </>
                      ) : (
                        <>
                          <div className="font-extrabold">Đưa màn hình này cho staff tại booth</div>
                          <div className="text-[#585A56]">để nhận 1 bộ sticker Agri-Next nhé!</div>
                        </>
                      )}
                    </div>
                  </div>
                  <BrocadeStrip tone="amber" heightClass="h-3" />
                </div>

                <div className="rounded-2xl bg-[#212122] p-5 space-y-3">
                  <div className="text-white">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#C6D870]">
                      Webinar {UPCOMING_WEBINAR.date} · {UPCOMING_WEBINAR.highlight}
                    </div>
                    <div className="text-base font-extrabold leading-snug mt-1">{UPCOMING_WEBINAR.title}</div>
                  </div>
                  <WebinarSignupForm source="sticker-voucher" tone="dark" />
                </div>

                <div className="rounded-2xl bg-[#EFF5D2] p-5 text-center space-y-3">
                  <div className="text-sm font-bold text-[#212122]">Trong lúc chờ, chơi thêm để lên bảng xếp hạng?</div>
                  <button
                    type="button"
                    onClick={onPlayMoreGames}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#556B2F] hover:bg-[#3E5021] text-white text-sm font-bold cursor-pointer"
                  >
                    Mini-game & Huy hiệu <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
