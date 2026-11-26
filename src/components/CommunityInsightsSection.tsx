import React, { useEffect, useState } from 'react';
import { CheckCircle2, MessageSquarePlus, Send } from 'lucide-react';
import { CAO_BANG_SPECIALTIES } from '../data/agriNextContent';
import type {
  CommunityInsightRecord,
  PlayerProfile,
  PublicInsightsSummary,
  RegionOption,
} from '../types';
import { BrocadeStrip, LeafMascot } from './BrandAssets';

interface CommunityInsightsSectionProps {
  currentPlayer: PlayerProfile | null;
  sessionId: string;
  onInsightCreated: () => void;
}

const TOPICS: CommunityInsightRecord['topic'][] = [
  'Nông sản Cao Bằng',
  'Bootcamp Thanh niên',
  'Nông nghiệp Tái sinh',
  'Kênh phân phối',
];

const REGIONS: RegionOption[] = [
  'Cao Bằng',
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Các tỉnh miền núi phía Bắc',
  'Tỉnh/Thành khác',
];

export const CommunityInsightsSection: React.FC<CommunityInsightsSectionProps> = ({
  currentPlayer,
  sessionId,
  onInsightCreated,
}) => {
  const [summary, setSummary] = useState<PublicInsightsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Submission form state
  const [authorName, setAuthorName] = useState(currentPlayer?.name ?? '');
  const [region, setRegion] = useState<RegionOption>(currentPlayer?.region ?? 'Hà Nội');
  const [topic, setTopic] = useState<CommunityInsightRecord['topic']>('Nông sản Cao Bằng');
  const [favoriteCrop, setFavoriteCrop] = useState<string>(CAO_BANG_SPECIALTIES[0].name);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    if (currentPlayer) {
      setAuthorName(currentPlayer.name);
      setRegion(currentPlayer.region);
    }
  }, [currentPlayer]);

  const loadSummary = () => {
    setLoading(true);
    fetch('/api/insights/public')
      .then((res) => res.json())
      .then((data: PublicInsightsSummary) => setSummary(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (authorName.trim().length < 2 || message.trim().length < 10) {
      setFeedback({
        type: 'err',
        text: 'Vui lòng nhập tên (tối thiểu 2 ký tự) và góp ý dài tối thiểu 10 ký tự.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: currentPlayer?.id ?? null,
          sessionId,
          authorName: authorName.trim(),
          region,
          topic,
          favoriteCrop,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: 'err', text: data.error || 'Không thể gửi chia sẻ.' });
      } else {
        setMessage('');
        setFeedback({
          type: 'ok',
          text: 'Cảm ơn bạn! Góc nhìn của bạn đã được lưu vào kho nghiên cứu của Agri-Next Vietnam.',
        });
        loadSummary();
        onInsightCreated();
      }
    } catch {
      setFeedback({ type: 'err', text: 'Lỗi kết nối máy chủ, vui lòng thử lại.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
      {/* Header */}
      <div className="parchment-surface rounded-2xl border border-[#556B2F]/20 overflow-hidden">
        <div className="p-7 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-bold text-[#556B2F]">
              Lắng nghe cộng đồng · Nghiên cứu dự án Agri-Next
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#212122] leading-tight">
              Góc Nhìn & Sáng Kiến Vì Nông Nghiệp Cao Bằng
            </h1>
            <p className="text-sm sm:text-base text-[#585A56] leading-relaxed">
              Tổng hợp trực tiếp từ lựa chọn của người chơi và đề xuất thực tế của bạn — giúp đội
              ngũ Agri-Next thiết kế sản phẩm, chương trình Bootcamp và chiến dịch truyền thông sát
              nhu cầu nhất.
            </p>
          </div>
          <LeafMascot mood="analytics" className="w-24 h-24 shrink-0" />
        </div>
        <BrocadeStrip tone="olive" heightClass="h-4" />
      </div>

      {/* Live Community Snapshot */}
      {loading || !summary ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-52 rounded-2xl bg-[#EFF5D2]/60 animate-pulse" />
          <div className="h-52 rounded-2xl bg-[#EFF5D2]/60 animate-pulse" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Top Specialties Interest */}
          <div className="lg:col-span-6 rounded-2xl bg-white border border-[#556B2F]/15 p-6 sm:p-7 space-y-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#212122]">
                Nông sản Cao Bằng được quan tâm nhất
              </h2>
              <p className="text-xs text-[#585A56] mt-1">
                Tổng hợp từ trò chơi Giỏ Quà Xanh & phiếu góp ý cộng đồng
              </p>
            </div>
            <div className="space-y-4">
              {summary.topSpecialties.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                    <span className="text-[#212122]">{item.name}</span>
                    <span className="font-mono-num text-[#556B2F]">
                      {item.share}% ({item.count})
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#EFF5D2] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#8FA31E] transition-all duration-300"
                      style={{ width: `${Math.max(8, item.share)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sustainability Personas Distribution */}
          <div className="lg:col-span-6 rounded-2xl bg-[#556B2F] text-white border border-[#3E5021] p-6 sm:p-7 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-white">
                  Chân dung người chơi Mùa Vụ Tái Sinh
                </h2>
                <p className="text-xs text-[#EFF5D2]/85 mt-1">
                  Xu hướng ưu tiên của cộng đồng khi đối mặt thách thức nông nghiệp vùng cao
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono-num text-xl font-bold text-[#F4991A]">
                  +{summary.avgWtpPremium}%
                </div>
                <div className="text-[11px] text-[#EFF5D2]/80">Mức trả thêm TB</div>
              </div>
            </div>

            <div className="space-y-3.5">
              {summary.personaBreakdown.map((p) => (
                <div key={p.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                    <span className="text-[#EFF5D2]">{p.label}</span>
                    <span className="font-mono-num font-bold text-[#C6D870]">
                      {p.share}% ({p.count})
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/15 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#F4991A] transition-all duration-300"
                      style={{ width: `${Math.max(6, p.share)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit Qualitative Insight + Community Voices */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 rounded-2xl bg-white border border-[#556B2F]/20 p-6 sm:p-7 space-y-4"
        >
          <div className="flex items-center gap-2 text-[#556B2F]">
            <MessageSquarePlus className="w-5 h-5" />
            <h2 className="text-lg font-extrabold text-[#212122]">Đóng góp góc nhìn của bạn</h2>
          </div>
          <p className="text-xs text-[#585A56] leading-relaxed">
            Bạn kỳ vọng gì ở nông sản Cao Bằng, bao bì xanh, mã truy xuất nguồn gốc hay các hoạt
            động Bootcamp thanh niên của Agri-Next?
          </p>

          <div className="space-y-3">
            <div>
              <label htmlFor="ins-name" className="block text-xs font-semibold text-[#212122] mb-1">
                Tên của bạn
              </label>
              <input
                id="ins-name"
                type="text"
                required
                maxLength={48}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="VD: Minh Anh"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#556B2F]/25 text-sm focus:outline-none focus:border-[#556B2F]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="ins-region"
                  className="block text-xs font-semibold text-[#212122] mb-1"
                >
                  Khu vực
                </label>
                <select
                  id="ins-region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value as RegionOption)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#556B2F]/25 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#556B2F]"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="ins-topic"
                  className="block text-xs font-semibold text-[#212122] mb-1"
                >
                  Chủ đề
                </label>
                <select
                  id="ins-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as CommunityInsightRecord['topic'])}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#556B2F]/25 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#556B2F]"
                >
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="ins-crop" className="block text-xs font-semibold text-[#212122] mb-1">
                Đặc sản Cao Bằng bạn yêu thích nhất
              </label>
              <select
                id="ins-crop"
                value={favoriteCrop}
                onChange={(e) => setFavoriteCrop(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#556B2F]/25 text-sm bg-white focus:outline-none focus:border-[#556B2F]"
              >
                {CAO_BANG_SPECIALTIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ins-msg" className="block text-xs font-semibold text-[#212122] mb-1">
                Ý tưởng / Góc nhìn gửi đội ngũ Agri-Next
              </label>
              <textarea
                id="ins-msg"
                rows={4}
                required
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Chia sẻ trải nghiệm, nhu cầu mua nông sản sạch hoặc ý tưởng giúp thanh niên Cao Bằng phát triển nông nghiệp bền vững..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#556B2F]/25 text-sm focus:outline-none focus:border-[#556B2F] resize-none"
              />
            </div>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-lg text-xs font-medium flex items-start gap-2 ${
                feedback.type === 'ok'
                  ? 'bg-[#EFF5D2] text-[#3E5021]'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {feedback.type === 'ok' && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{feedback.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#556B2F] hover:bg-[#3E5021] disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Đang gửi...' : 'Gửi góc nhìn cho dự án'}</span>
          </button>
        </form>

        {/* Community Insights Wall */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-extrabold text-[#212122]">
            Tiếng nói từ cộng đồng ({summary?.totalInsights ?? 0})
          </h2>
          <div className="space-y-4">
            {(summary?.recentInsights ?? []).map((item) => (
              <article
                key={item.id}
                className="rounded-xl bg-white border border-[#556B2F]/15 p-5 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#585A56]">
                  <div className="font-bold text-[#212122]">
                    {item.authorName} · <span className="font-normal text-[#585A56]">{item.region}</span>
                  </div>
                  <div className="text-[#556B2F] font-semibold">
                    {item.topic} · {item.favoriteCrop}
                  </div>
                </div>
                <p className="text-sm text-[#212122] leading-relaxed">{item.message}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
