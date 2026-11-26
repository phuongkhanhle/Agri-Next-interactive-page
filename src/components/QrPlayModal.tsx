import React, { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Download, QrCode, Smartphone, X } from 'lucide-react';
import {
  buildQrUrl,
  downloadQrPosterPng,
  getQrTargetConfig,
  getSavedQrBaseUrl,
  QR_TARGETS,
  saveQrBaseUrl,
  subscribeQrBaseUrl,
  type QrTarget,
} from '../utils/qr';
import { BrocadeStrip, LeafMascot } from './BrandAssets';
import { LiveQrCode } from './LiveQrCode';

export type { QrTarget };

interface QrPlayModalProps {
  open: boolean;
  initialTarget?: QrTarget;
  onClose: () => void;
}

export const QrPlayModal: React.FC<QrPlayModalProps> = ({
  open,
  initialTarget = 'games',
  onClose,
}) => {
  const [target, setTarget] = useState<QrTarget>(initialTarget);
  const [baseUrl, setBaseUrl] = useState<string>(() => getSavedQrBaseUrl());
  const [showCustomUrl, setShowCustomUrl] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    return subscribeQrBaseUrl((next) => setBaseUrl(next));
  }, []);

  useEffect(() => {
    if (open) {
      setTarget(initialTarget);
      setBaseUrl(getSavedQrBaseUrl());
      setCopied(false);
      setDownloaded(false);
    }
  }, [open, initialTarget]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const activeTarget = useMemo(() => getQrTargetConfig(target), [target]);
  const fullUrl = useMemo(() => buildQrUrl(target, baseUrl), [target, baseUrl]);

  if (!open) return null;

  const handleBaseUrlChange = (val: string) => {
    setBaseUrl(val);
    saveQrBaseUrl(val);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked in some embedded contexts
    }
  };

  const handleDownloadPoster = async () => {
    setDownloading(true);
    try {
      await downloadQrPosterPng(target, baseUrl);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2600);
    } catch {
      // Ignore canvas export error
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#212122]/65 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-xl max-h-[92vh] overflow-y-auto bg-[#F9FBF1] rounded-t-3xl sm:rounded-2xl border border-[#556B2F]/25 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile bottom-sheet grab handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 bg-[#556B2F]">
          <div className="w-10 h-1.5 rounded-full bg-white/35" aria-hidden="true" />
        </div>

        {/* Header */}
        <div className="bg-[#556B2F] text-white px-6 py-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#EFF5D2] flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6 text-[#556B2F]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#C6D870]">
                Trải nghiệm tức thì trên điện thoại · Không cần đăng nhập
              </div>
              <h2 id="qr-modal-title" className="text-lg sm:text-xl font-extrabold text-white">
                Quét mã QR & Tải Poster sự kiện
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại mã QR"
            className="min-h-[44px] min-w-[44px] -mr-2 -mt-1 flex items-center justify-center rounded-xl text-[#EFF5D2] hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <BrocadeStrip tone="moss" heightClass="h-3.5" />

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Destination selector */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#556B2F]">
              Chọn màn hình mở ra khi bạn bè quét mã:
            </div>
            <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-[#556B2F]/10">
              {QR_TARGETS.map((item) => {
                const active = item.id === target;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTarget(item.id)}
                    className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#556B2F] text-white shadow-xs'
                        : 'text-[#3E5021] hover:bg-[#556B2F]/10'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* QR Display + Quick Guide */}
          <div className="grid sm:grid-cols-12 gap-5 items-center parchment-surface rounded-2xl border border-[#556B2F]/18 p-5">
            <div className="sm:col-span-6 flex flex-col items-center">
              <LiveQrCode
                target={target}
                baseUrl={baseUrl}
                sizeClass="w-52 h-52 sm:w-56 sm:h-56"
                pixelWidth={520}
              />
              <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#556B2F]">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mở Camera điện thoại & hướng vào mã</span>
              </div>
            </div>

            <div className="sm:col-span-6 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <LeafMascot mood="happy" className="w-11 h-11 shrink-0" />
                <div className="text-xs font-bold text-[#212122] leading-snug">
                  {activeTarget.posterSubtitle}
                </div>
              </div>

              <ol className="space-y-2 text-xs text-[#585A56] leading-relaxed">
                <li>
                  <strong className="text-[#556B2F]">Bước 1:</strong> Hướng Camera iPhone, Android
                  hoặc Zalo vào mã QR bên cạnh.
                </li>
                <li>
                  <strong className="text-[#556B2F]">Bước 2:</strong> Chạm vào liên kết để vào thẳng{' '}
                  <strong className="text-[#212122]">{activeTarget.label}</strong> trên trình duyệt.
                </li>
                <li>
                  <strong className="text-[#556B2F]">Bước 3:</strong> Chơi trong 2 phút để hiểu nông
                  nghiệp Cao Bằng, nhận Huy hiệu check-in đã biết về Agri-Next và chia sẻ lên MXH.
                </li>
              </ol>

              <button
                type="button"
                onClick={() => setShowCustomUrl((v) => !v)}
                className="text-xs font-semibold text-[#556B2F] hover:underline cursor-pointer"
              >
                {showCustomUrl ? 'Ẩn tuỳ chỉnh đường dẫn' : 'Tuỳ chỉnh link gốc cho toàn bộ mã QR'}
              </button>
            </div>
          </div>

          {showCustomUrl && (
            <div className="space-y-1.5">
              <label htmlFor="qr-custom-base" className="block text-xs font-bold text-[#556B2F]">
                Đường dẫn trang web (tự động đồng bộ cho tất cả mã QR trên trang & màn hình Booth)
              </label>
              <input
                id="qr-custom-base"
                type="url"
                value={baseUrl}
                onChange={(e) => handleBaseUrlChange(e.target.value)}
                placeholder="https://..."
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#556B2F]/25 bg-white text-xs font-mono-num text-[#212122] focus:outline-2 focus:outline-[#556B2F]"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleDownloadPoster}
              disabled={downloading}
              className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F4991A] hover:bg-[#D9810D] text-[#212122] font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>
                {downloaded
                  ? 'Đã tải Poster QR in ấn!'
                  : downloading
                    ? 'Đang tạo Poster...'
                    : 'Tải Poster QR (PNG in ấn)'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#556B2F]/25 bg-white hover:bg-[#EFF5D2] text-[#556B2F] font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã sao chép link!' : 'Sao chép link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
