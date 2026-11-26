import QRCode from 'qrcode';

export type QrTarget =
  | 'sticker'
  | 'project'
  | 'games'
  | 'farm_sim'
  | 'cao_bang_quiz'
  | 'market_basket'
  | 'landing';

export interface QrTargetConfig {
  id: QrTarget;
  label: string;
  shortLabel: string;
  posterTitle: string;
  posterSubtitle: string;
  boothHint: string;
  query: string;
}

export const QR_TARGETS: QrTargetConfig[] = [
  {
    id: 'sticker',
    label: 'Săn Sticker',
    shortLabel: 'Săn Sticker',
    posterTitle: 'SĂN STICKER AGRI-NEXT',
    posterSubtitle: 'Đọc dự án · Trả lời đúng 4/5 câu đố · Nhận sticker Bé Mầm & Bé Hạt tại booth',
    boothHint: 'Vào thẳng trò chơi Săn Sticker (số suất quà có hạn)',
    query: '?view=sticker',
  },
  {
    id: 'project',
    label: 'Câu chuyện Dự án',
    shortLabel: 'Dự án',
    posterTitle: 'CÂU CHUYỆN DỰ ÁN AGRI-NEXT',
    posterSubtitle: 'Bootcamp · Ruộng mẫu 1.000 m² · Chiến dịch Young Roots, Green Future',
    boothHint: 'Mở trang trưng bày toàn bộ dự án Agri-Next Vietnam',
    query: '?view=project',
  },
  {
    id: 'games',
    label: 'Cả 3 Trò chơi',
    shortLabel: 'Cả 3 Game',
    posterTitle: 'KHÁM PHÁ NÔNG NGHIỆP CAO BẰNG',
    posterSubtitle: 'Chơi 3 mini-game hiểu nông nghiệp Cao Bằng · Nhận Huy hiệu Check-in MXH',
    boothHint: 'Vào thẳng trò chơi kèm hướng dẫn nhanh & chuyển đổi cả 3 mini-game',
    query: '?view=games&game=farm_sim&autoplay=1',
  },
  {
    id: 'farm_sim',
    label: 'Mùa Vụ Tái Sinh',
    shortLabel: 'Mùa Vụ',
    posterTitle: 'TRÒ CHƠI: MÙA VỤ TÁI SINH',
    posterSubtitle: '6 mùa vụ quản trị ruộng mẫu 1.000 m² · Nhận Huy hiệu Check-in Agri-Next',
    boothHint: 'Vào thẳng trò chơi mô phỏng 6 mùa vụ ruộng mẫu Cao Bằng',
    query: '?view=games&game=farm_sim&autoplay=1',
  },
  {
    id: 'cao_bang_quiz',
    label: 'Thử Thách Kiến Thức',
    shortLabel: 'Đố Vui',
    posterTitle: 'THỬ THÁCH NÔNG SẢN CAO BẰNG',
    posterSubtitle: '8 câu đố đặc sản vùng cao nhân điểm combo · Nhận Huy hiệu Check-in MXH',
    boothHint: 'Vào thẳng 8 câu đố đặc sản & nông nghiệp thích ứng khí hậu',
    query: '?view=games&game=cao_bang_quiz&autoplay=1',
  },
  {
    id: 'market_basket',
    label: 'Khảo Sát Giỏ Quà Xanh',
    shortLabel: 'Giỏ Quà',
    posterTitle: 'KHÁM PHÁ GIỎ ĐẶC SẢN XANH',
    posterSubtitle: 'Phối đặc sản Cao Bằng với 500.000đ ảo · Nhận Huy hiệu Check-in chia sẻ MXH',
    boothHint: 'Vào thẳng trò chơi phối đặc sản Cao Bằng với 500.000đ ảo',
    query: '?view=games&game=market_basket&autoplay=1',
  },
  {
    id: 'landing',
    label: 'Trang Giới thiệu',
    shortLabel: 'Giới thiệu',
    posterTitle: 'AGRI-NEXT VIETNAM × CAO BẰNG',
    posterSubtitle: 'Mầm rễ Trẻ, Tương lai Xanh · Hành trình nông nghiệp bền vững',
    boothHint: 'Mở trang giới thiệu toàn diện dự án Agri-Next Vietnam',
    query: '',
  },
];

const QR_BASE_URL_KEY = 'agrinext_qr_base_url';
const QR_BASE_URL_EVENT = 'agrinext:qr-base-url-changed';

export function getDefaultOriginUrl(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}`.replace(/\/$/, '');
}

export function getSavedQrBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  try {
    const saved = localStorage.getItem(QR_BASE_URL_KEY)?.trim();
    if (saved) return saved.replace(/\/$/, '');
  } catch {
    // Ignore storage access errors
  }
  return getDefaultOriginUrl();
}

export function saveQrBaseUrl(url: string): void {
  if (typeof window === 'undefined') return;
  const cleaned = url.trim().replace(/\/$/, '');
  try {
    if (cleaned) {
      localStorage.setItem(QR_BASE_URL_KEY, cleaned);
    } else {
      localStorage.removeItem(QR_BASE_URL_KEY);
    }
  } catch {
    // Ignore storage access errors
  }
  window.dispatchEvent(new CustomEvent(QR_BASE_URL_EVENT, { detail: cleaned || getDefaultOriginUrl() }));
}

export function subscribeQrBaseUrl(listener: (nextBaseUrl: string) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (ev: Event) => {
    const custom = ev as CustomEvent<string>;
    listener(custom.detail || getSavedQrBaseUrl());
  };
  window.addEventListener(QR_BASE_URL_EVENT, handler);
  return () => window.removeEventListener(QR_BASE_URL_EVENT, handler);
}

export function getQrTargetConfig(target: QrTarget): QrTargetConfig {
  return QR_TARGETS.find((t) => t.id === target) ?? QR_TARGETS[0];
}

export function buildQrUrl(target: QrTarget, baseUrl?: string): string {
  const cfg = getQrTargetConfig(target);
  const cleanBase = (baseUrl?.trim() || getSavedQrBaseUrl() || getDefaultOriginUrl()).replace(
    /\/$/,
    ''
  );
  if (!cleanBase) return cfg.query || '/';
  return `${cleanBase}/${cfg.query}`.replace(/\/\?/, '?');
}

export async function generateQrDataUrl(text: string, width = 520): Promise<string> {
  return QRCode.toDataURL(text, {
    width,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#3E5021',
      light: '#FFFFFF',
    },
  });
}

export async function downloadQrPosterPng(target: QrTarget, baseUrl?: string): Promise<void> {
  const cfg = getQrTargetConfig(target);
  const fullUrl = buildQrUrl(target, baseUrl);
  const qrDataUrl = await generateQrDataUrl(fullUrl, 560);

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Cream parchment canvas
  ctx.fillStyle = '#EFF5D2';
  ctx.fillRect(0, 0, 1080, 1350);

  // 2. Top Deep Olive heritage header
  ctx.fillStyle = '#556B2F';
  ctx.fillRect(0, 0, 1080, 310);

  // 3. Geometric brocade diamond strip under header & at bottom
  const drawBrocade = (y: number, h: number) => {
    ctx.fillStyle = '#3E5021';
    ctx.fillRect(0, y, 1080, h);
    const step = 36;
    for (let x = 0; x < 1080; x += step) {
      ctx.fillStyle = (x / step) % 2 === 0 ? '#C6D870' : '#F4991A';
      ctx.beginPath();
      ctx.moveTo(x + step / 2, y + 6);
      ctx.lineTo(x + step - 5, y + h / 2);
      ctx.lineTo(x + step / 2, y + h - 6);
      ctx.lineTo(x + 5, y + h / 2);
      ctx.closePath();
      ctx.fill();
    }
  };
  drawBrocade(310, 34);
  drawBrocade(1316, 34);

  // 4. Header brand lockup & title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#C6D870';
  ctx.font = '700 26px Montserrat, sans-serif';
  ctx.fillText('AGRI-NEXT VIETNAM  ·  YOUTH 4 CLIMATE  ·  CAO BẰNG', 540, 92);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 54px Montserrat, sans-serif';
  ctx.fillText('QUÉT MÃ CHƠI GAME', 540, 178);

  ctx.fillStyle = '#F4991A';
  ctx.font = '800 30px Montserrat, sans-serif';
  ctx.fillText(cfg.posterTitle, 540, 245);

  // 5. Subtitle
  ctx.fillStyle = '#3E5021';
  ctx.font = '700 28px Montserrat, sans-serif';
  ctx.fillText(cfg.posterSubtitle, 540, 415);

  // 6. Framed white QR card with crisp quiet zone
  const cardX = 240;
  const cardY = 468;
  const cardSize = 600;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardSize, cardSize, 32);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#556B2F';
  ctx.stroke();

  const qrImg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = qrDataUrl;
  });
  ctx.drawImage(qrImg, cardX + 40, cardY + 40, cardSize - 80, cardSize - 80);

  // 7. Quick 3-step instructions for event visitors
  ctx.fillStyle = '#556B2F';
  ctx.font = '800 26px Montserrat, sans-serif';
  ctx.fillText(
    '1. Quét mã QR   ·   2. Chơi hiểu nông nghiệp Cao Bằng   ·   3. Chia sẻ Huy hiệu Check-in',
    540,
    1152
  );

  ctx.fillStyle = '#585A56';
  ctx.font = '600 24px Montserrat, sans-serif';
  ctx.fillText('Không cần tải app · Không cần đăng nhập · Chơi trực tiếp trên trình duyệt', 540, 1205);

  ctx.fillStyle = '#3E5021';
  ctx.font = '700 22px "JetBrains Mono", monospace';
  const displayLink = fullUrl.length > 62 ? `${fullUrl.slice(0, 59)}...` : fullUrl;
  ctx.fillText(displayLink, 540, 1265);

  const link = document.createElement('a');
  link.download = `AgriNext-QR-${cfg.id}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  link.remove();
}
