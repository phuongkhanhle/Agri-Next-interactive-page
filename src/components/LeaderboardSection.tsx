import React, { useEffect, useState } from 'react';
import { Award, Medal, Play, Trophy } from 'lucide-react';
import type { LeaderboardEntry, PlayerProfile, RegionOption } from '../types';
import { BrocadeStrip, GrainMascot, LeafMascot } from './BrandAssets';

interface LeaderboardSectionProps {
  currentPlayer: PlayerProfile | null;
  refreshTrigger: number;
  onPlayNow: () => void;
}

const GAME_FILTERS = [
  { id: 'all', label: 'Tổng điểm' },
  { id: 'farm_sim', label: 'Mùa Vụ Tái Sinh' },
  { id: 'cao_bang_quiz', label: 'Thử Thách Kiến Thức' },
  { id: 'market_basket', label: 'Giỏ Quà Xanh' },
] as const;

const REGION_FILTERS: Array<{ id: 'all' | RegionOption; label: string }> = [
  { id: 'all', label: 'Tất cả khu vực' },
  { id: 'Cao Bằng', label: 'Cao Bằng' },
  { id: 'Hà Nội', label: 'Hà Nội' },
  { id: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
  { id: 'Các tỉnh miền núi phía Bắc', label: 'Miền núi phía Bắc' },
];

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  currentPlayer,
  refreshTrigger,
  onPlayNow,
}) => {
  const [gameFilter, setGameFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [totals, setTotals] = useState({ totalPlayers: 0, totalSessions: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetch(
      `/api/leaderboard?game=${encodeURIComponent(gameFilter)}&region=${encodeURIComponent(regionFilter)}`
    )
      .then(async (res) => {
        if (!res.ok) throw new Error('Không thể tải bảng xếp hạng.');
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setEntries(data.entries ?? []);
        setTotals({
          totalPlayers: data.totalPlayers ?? 0,
          totalSessions: data.totalSessions ?? 0,
        });
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [gameFilter, regionFilter, refreshTrigger]);

  const topThree = entries.slice(0, 3);
  const myEntry = currentPlayer ? entries.find((e) => e.id === currentPlayer.id) : null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header Band */}
      <div className="rounded-2xl overflow-hidden bg-[#556B2F] text-white border border-[#3E5021]">
        <div className="p-7 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-semibold text-[#C6D870]">
              Bảng vinh danh cộng đồng Agri-Next Vietnam
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Bảng Xếp Hạng Đại Sứ Nông Nghiệp Xanh
            </h1>
            <p className="text-sm text-[#EFF5D2]/90">
              Cạnh tranh lành mạnh qua 3 trò chơi để tích lũy điểm cao nhất, mở khóa danh hiệu và
              lan tỏa giá trị nông nghiệp bền vững Cao Bằng.
            </p>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <div className="text-right">
              <div className="font-mono-num text-2xl sm:text-3xl font-bold text-[#F4991A]">
                {totals.totalPlayers}
              </div>
              <div className="text-xs text-[#EFF5D2]/90">Người chơi</div>
            </div>
            <div className="h-10 w-px bg-[#EFF5D2]/25" aria-hidden="true" />
            <div className="text-right">
              <div className="font-mono-num text-2xl sm:text-3xl font-bold text-white">
                {totals.totalSessions}
              </div>
              <div className="text-xs text-[#EFF5D2]/90">Lượt chơi</div>
            </div>
          </div>
        </div>
        <BrocadeStrip tone="moss" heightClass="h-4" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#556B2F]/10">
          {GAME_FILTERS.map((tab) => {
            const active = gameFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setGameFilter(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#556B2F] text-white shadow-sm'
                    : 'text-[#3E5021] hover:bg-[#556B2F]/10'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="lb-region-filter" className="text-xs font-semibold text-[#585A56] whitespace-nowrap">
            Khu vực:
          </label>
          <select
            id="lb-region-filter"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-white border border-[#556B2F]/25 text-xs sm:text-sm font-medium text-[#212122] focus:outline-none focus:border-[#556B2F]"
          >
            {REGION_FILTERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current Player Standing Banner */}
      {myEntry && (
        <div className="parchment-surface rounded-xl border border-[#8FA31E]/40 p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {myEntry.avatarType === 'grain' ? (
              <GrainMascot className="w-12 h-12 shrink-0" />
            ) : (
              <LeafMascot mood="happy" className="w-12 h-12 shrink-0" />
            )}
            <div>
              <div className="text-xs font-semibold text-[#556B2F]">Thứ hạng hiện tại của bạn</div>
              <div className="text-base sm:text-lg font-extrabold text-[#212122]">
                Hạng #{myEntry.rank} · {myEntry.name}
              </div>
              <div className="text-xs text-[#585A56]">
                {myEntry.rankTitle} · {myEntry.gamesPlayed} lượt chơi · Chính xác{' '}
                <span className="font-mono-num font-semibold">{myEntry.avgAccuracy}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-mono-num text-2xl font-bold text-[#556B2F]">
                {myEntry.displayScore.toLocaleString('vi-VN')}
              </div>
              <div className="text-xs text-[#585A56]">điểm</div>
            </div>
            <button
              type="button"
              onClick={onPlayNow}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#F4991A] hover:bg-[#D9810D] text-[#212122] font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Play className="w-4 h-4" />
              <span>Cải thiện điểm</span>
            </button>
          </div>
        </div>
      )}

      {/* Top 3 Heritage Podium */}
      {!loading && topThree.length > 0 && (
        <div className="grid md:grid-cols-3 gap-5">
          {topThree.map((entry, idx) => {
            const isFirst = idx === 0;
            return (
              <div
                key={entry.id}
                className={`rounded-2xl p-6 border flex flex-col justify-between space-y-4 ${
                  isFirst
                    ? 'bg-[#556B2F] text-white border-[#3E5021]'
                    : 'bg-white text-[#212122] border-[#556B2F]/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {entry.avatarType === 'grain' ? (
                      <GrainMascot className="w-12 h-12 shrink-0" />
                    ) : (
                      <LeafMascot mood={isFirst ? 'happy' : 'idea'} className="w-12 h-12 shrink-0" />
                    )}
                    <div>
                      <div
                        className={`text-xs font-bold ${
                          isFirst ? 'text-[#F4991A]' : 'text-[#8FA31E]'
                        }`}
                      >
                        Hạng #{entry.rank}
                      </div>
                      <h3 className="font-extrabold text-base sm:text-lg leading-snug">
                        {entry.name}
                      </h3>
                      <div
                        className={`text-xs ${
                          isFirst ? 'text-[#EFF5D2]/85' : 'text-[#585A56]'
                        }`}
                      >
                        {entry.region} · {entry.ageGroup} tuổi
                      </div>
                    </div>
                  </div>
                  {isFirst ? (
                    <Trophy className="w-6 h-6 text-[#F4991A] shrink-0" />
                  ) : idx === 1 ? (
                    <Medal className="w-5 h-5 text-[#8FA31E] shrink-0" />
                  ) : (
                    <Award className="w-5 h-5 text-[#D9810D] shrink-0" />
                  )}
                </div>

                <div
                  className={`pt-4 border-t flex items-end justify-between ${
                    isFirst ? 'border-white/20' : 'border-[#556B2F]/12'
                  }`}
                >
                  <div>
                    <div
                      className={`text-xs font-semibold ${
                        isFirst ? 'text-[#C6D870]' : 'text-[#556B2F]'
                      }`}
                    >
                      {entry.rankTitle}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isFirst ? 'text-[#EFF5D2]/80' : 'text-[#585A56]'
                      }`}
                    >
                      {entry.gamesPlayed} lượt · Chính xác {entry.avgAccuracy}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-mono-num text-2xl font-bold ${
                        isFirst ? 'text-[#F4991A]' : 'text-[#556B2F]'
                      }`}
                    >
                      {entry.displayScore.toLocaleString('vi-VN')}
                    </div>
                    <div
                      className={`text-[11px] ${
                        isFirst ? 'text-[#EFF5D2]/80' : 'text-[#585A56]'
                      }`}
                    >
                      điểm
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Rankings Table */}
      <div className="rounded-2xl bg-white border border-[#556B2F]/15 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-11 rounded-lg bg-[#EFF5D2]/60 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm text-red-700">{error}</div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <LeafMascot mood="curious" className="w-16 h-16 mx-auto" />
            <div className="text-base font-bold text-[#212122]">
              Chưa có người chơi ở khu vực này
            </div>
            <p className="text-sm text-[#585A56]">
              Hãy là người đầu tiên đại diện khu vực ghi tên lên bảng xếp hạng Agri-Next!
            </p>
            <button
              type="button"
              onClick={onPlayNow}
              className="px-5 py-2.5 rounded-lg bg-[#556B2F] text-white text-sm font-bold cursor-pointer"
            >
              Chơi ngay
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#556B2F]/15 bg-[#EFF5D2]/65 text-xs font-bold text-[#3E5021]">
                  <th className="py-3.5 px-4 w-16">Hạng</th>
                  <th className="py-3.5 px-4">Người chơi</th>
                  <th className="py-3.5 px-4">Danh hiệu</th>
                  <th className="py-3.5 px-4 text-right">Mùa Vụ</th>
                  <th className="py-3.5 px-4 text-right">Kiến Thức</th>
                  <th className="py-3.5 px-4 text-right">Giỏ Xanh</th>
                  <th className="py-3.5 px-4 text-right">Chính xác</th>
                  <th className="py-3.5 px-4 text-right">Điểm xếp hạng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#556B2F]/10 text-sm">
                {entries.map((entry) => {
                  const isMe = currentPlayer?.id === entry.id;
                  return (
                    <tr
                      key={entry.id}
                      className={`transition-colors ${
                        isMe ? 'bg-[#EFF5D2]/85' : 'hover:bg-[#F9FBF1]'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono-num font-bold text-[#556B2F]">
                        #{entry.rank}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#212122]">
                          {entry.name} {isMe && <span className="text-[#8FA31E] text-xs">(Bạn)</span>}
                        </div>
                        <div className="text-xs text-[#585A56]">
                          {entry.region} · {entry.ageGroup} tuổi
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-[#556B2F]">
                        {entry.rankTitle}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-num text-xs text-[#585A56]">
                        {entry.bestFarmScore}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-num text-xs text-[#585A56]">
                        {entry.bestQuizScore}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-num text-xs text-[#585A56]">
                        {entry.bestMarketScore}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-num text-xs font-semibold text-[#212122]">
                        {entry.avgAccuracy}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-num font-bold text-[#556B2F]">
                        {entry.displayScore.toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
