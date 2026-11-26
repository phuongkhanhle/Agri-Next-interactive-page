import React, { useEffect, useState } from 'react';
import {
  buildQrUrl,
  generateQrDataUrl,
  getQrTargetConfig,
  getSavedQrBaseUrl,
  subscribeQrBaseUrl,
  type QrTarget,
} from '../utils/qr';

interface LiveQrCodeProps {
  target: QrTarget;
  baseUrl?: string;
  sizeClass?: string;
  pixelWidth?: number;
}

export const LiveQrCode: React.FC<LiveQrCodeProps> = ({
  target,
  baseUrl,
  sizeClass = 'w-44 h-44',
  pixelWidth = 480,
}) => {
  const [syncedBase, setSyncedBase] = useState<string>(() => baseUrl ?? getSavedQrBaseUrl());
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    if (typeof baseUrl === 'string') {
      setSyncedBase(baseUrl);
      return;
    }
    setSyncedBase(getSavedQrBaseUrl());
    return subscribeQrBaseUrl((next) => setSyncedBase(next));
  }, [baseUrl]);

  const effectiveUrl = buildQrUrl(target, syncedBase);
  const cfg = getQrTargetConfig(target);

  useEffect(() => {
    let cancelled = false;
    generateQrDataUrl(effectiveUrl, pixelWidth)
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [effectiveUrl, pixelWidth]);

  return (
    <div
      className={`bg-white p-2.5 rounded-xl border-2 border-[#556B2F] flex items-center justify-center shrink-0 ${sizeClass}`}
    >
      {dataUrl ? (
        <img
          src={dataUrl}
          alt={`Mã QR mở ${cfg.label} trên điện thoại`}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="text-[11px] font-semibold text-[#585A56] text-center">Đang tạo QR...</div>
      )}
    </div>
  );
};
