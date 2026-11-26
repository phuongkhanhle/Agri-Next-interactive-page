import React, { useState } from 'react';
import { BellRing, CheckCircle2, Loader2 } from 'lucide-react';

const STORAGE_KEY = 'agrinext_webinar_email';

function readSaved(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Email capture for the upcoming webinar (registration not open yet). */
export const WebinarSignupForm: React.FC<{
  source: string;
  tone?: 'dark' | 'light';
  className?: string;
}> = ({ source, tone = 'dark', className = '' }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedEmail, setSavedEmail] = useState<string | null>(() => readSaved());

  const dark = tone === 'dark';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError('Email chưa đúng định dạng, bạn kiểm tra lại giúp mình nhé.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      let name = '';
      try {
        name = localStorage.getItem('agrinext_sticker_name') ?? '';
      } catch {
        /* ignore */
      }
      const res = await fetch('/api/webinar/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, name, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Có lỗi kết nối, bạn thử lại nhé.');
        return;
      }
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch {
        /* ignore */
      }
      setSavedEmail(value);
    } catch {
      setError('Có lỗi kết nối, bạn thử lại nhé.');
    } finally {
      setSubmitting(false);
    }
  };

  if (savedEmail) {
    return (
      <div
        className={`flex items-start gap-3 rounded-xl px-4 py-3 ${
          dark ? 'bg-[#8FA31E]/25 border border-[#C6D870]/40 text-white' : 'bg-[#EFF5D2] border border-[#C6D870] text-[#212122]'
        } ${className}`}
      >
        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${dark ? 'text-[#C6D870]' : 'text-[#8FA31E]'}`} />
        <div className="text-sm">
          <div className="font-extrabold">Đã ghi nhận!</div>
          <div className={dark ? 'text-white/80' : 'text-[#585A56]'}>
            Agri-Next sẽ gửi thông tin đăng ký webinar tới <strong>{savedEmail}</strong> ngay khi mở đơn.
          </div>
          <button
            type="button"
            onClick={() => {
              setSavedEmail(null);
              setEmail('');
            }}
            className={`mt-1 text-xs font-semibold underline cursor-pointer ${dark ? 'text-white/70' : 'text-[#556B2F]'}`}
          >
            Dùng email khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`space-y-2 ${className}`} noValidate>
      <label
        htmlFor={`webinar-email-${source}`}
        className={`flex items-center gap-2 text-sm font-bold ${dark ? 'text-white' : 'text-[#212122]'}`}
      >
        <BellRing className="w-4 h-4 text-[#F4991A]" />
        Đơn đăng ký sắp mở — để lại email để nhận thông tin
      </label>
      <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
        <input
          id={`webinar-email-${source}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ban@email.com"
          maxLength={120}
          className={`flex-1 min-w-0 min-h-[48px] rounded-xl px-4 text-base outline-none border-2 ${
            dark
              ? 'bg-white/10 border-white/20 text-white placeholder:text-white/45 focus:border-[#F4991A]'
              : 'bg-white border-[#556B2F]/20 text-[#212122] focus:border-[#8FA31E]'
          }`}
        />
        <button
          type="submit"
          disabled={submitting}
          className="min-h-[48px] inline-flex items-center justify-center gap-2 px-5 rounded-xl bg-[#F4991A] hover:bg-[#D9810D] disabled:opacity-60 text-[#212122] font-extrabold text-sm whitespace-nowrap cursor-pointer"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Nhận thông tin
        </button>
      </div>
      {error && <div className="text-xs font-semibold text-[#F4991A]">{error}</div>}
      <p className={`text-[11px] leading-relaxed ${dark ? 'text-white/55' : 'text-[#585A56]'}`}>
        Email chỉ dùng để Agri-Next gửi thông tin về webinar và hoạt động của dự án.
      </p>
    </form>
  );
};
