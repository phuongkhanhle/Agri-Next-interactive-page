import React, { useEffect, useMemo, useState } from 'react';
import { GiftAdminPanel } from './GiftAdminPanel';
import { WebinarAdminPanel } from './WebinarAdminPanel';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowLeft,
  Download,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  MonitorPlay,
  QrCode,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import type { AdminDashboardData } from '../types';
import { PERSONA_LABELS } from '../data/agriNextContent';
import type { QrTarget } from './QrPlayModal';

const CHART_COLORS = ['#556B2F', '#8FA31E', '#F4991A', '#C6D870', '#3E5021'];

interface AdminDashboardProps {
  onOpenQrModal?: (target?: QrTarget) => void;
  onOpenBoothMode?: () => void;
  onBackToPublic?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenQrModal,
  onOpenBoothMode,
  onBackToPublic,
}) => {
  // Keep admin Bearer token strictly in React memory (never persisted to browser storage)
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [authStatusLoading, setAuthStatusLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'gifts' | 'webinar' | 'overview' | 'players' | 'insights'>('gifts');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');

  useEffect(() => {
    let active = true;
    fetch('/api/admin/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((status) => {
        if (!active || !status) return;
        setNeedsSetup(Boolean(status.needsSetup));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setAuthStatusLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const fetchDashboard = async (tokenOverride?: string) => {
    const activeToken = tokenOverride ?? adminToken;
    if (!activeToken) return;
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.status === 401) {
        setAdminToken(null);
        setData(null);
        setAuthError('Phiên quản trị đã hết hạn. Vui lòng đăng nhập lại.');
        return;
      }
      if (!res.ok) throw new Error('Không thể tải dữ liệu phân tích quản trị.');
      const json = (await res.json()) as AdminDashboardData;
      setData(json);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Lỗi tải dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchDashboard(adminToken);
    }
  }, [adminToken]);

  const handleAdminAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const trimmed = passwordInput.trim();
    if (needsSetup) {
      if (trimmed.length < 6) {
        setAuthError('Mật khẩu quản trị cần tối thiểu 6 ký tự.');
        return;
      }
      if (trimmed !== confirmPasswordInput.trim()) {
        setAuthError('Mật khẩu xác nhận chưa khớp.');
        return;
      }
    } else if (!trimmed) {
      setAuthError('Vui lòng nhập mật khẩu quản trị.');
      return;
    }

    setAuthSubmitting(true);
    try {
      const endpoint = needsSetup ? '/api/admin/setup' : '/api/admin/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAuthError(json.error || 'Không thể xác thực quản trị viên.');
        return;
      }
      if (typeof json.token === 'string' && json.token) {
        setAdminToken(json.token);
        setNeedsSetup(false);
        setPasswordInput('');
        setConfirmPasswordInput('');
      }
    } catch {
      setAuthError('Lỗi kết nối tới máy chủ. Vui lòng thử lại.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (adminToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      }).catch(() => {});
    }
    setAdminToken(null);
    setData(null);
    setAuthError(null);
  };

  const handleExportCsv = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/export.csv', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status === 401) {
        setAdminToken(null);
        return;
      }
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'agrinext-caobang-insights.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Ignore transient download error
    }
  };

  const handleDeleteInsight = async (id: string) => {
    if (!adminToken) return;
    const res = await fetch(`/api/admin/insights/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (res.status === 401) {
      setAdminToken(null);
      return;
    }
    if (res.ok) {
      fetchDashboard();
    }
  };

  const filteredPlayers = useMemo(() => {
    if (!data) return [];
    const q = searchQuery.trim().toLowerCase();
    return data.players.filter((p) => {
      const matchesRegion = regionFilter === 'all' || p.region === regionFilter;
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        (p.favoriteSpecialty ?? '').toLowerCase().includes(q);
      return matchesRegion && matchesSearch;
    });
  }, [data, searchQuery, regionFilter]);

  // LOCKED GATE FOR NON-ADMIN VISITORS
  if (!adminToken) {
    return (
      <section className="max-w-lg mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="rounded-2xl bg-white border border-[#556B2F]/20 shadow-sm overflow-hidden">
          <div className="bg-[#556B2F] text-white px-6 py-6 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C6D870]">
              <Lock className="w-4 h-4" />
              <span>Khu vực nội bộ · Dành riêng cho Admin Agri-Next</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {authStatusLoading
                ? 'Đang kiểm tra trạng thái quản trị...'
                : needsSetup
                  ? 'Thiết lập mật khẩu Admin lần đầu'
                  : 'Đăng nhập Cổng Quản trị Dự án'}
            </h1>
            <p className="text-xs sm:text-sm text-[#EFF5D2]/90 leading-relaxed">
              {needsSetup
                ? 'Tạo mật khẩu riêng cho Ban tổ chức để bảo vệ dữ liệu người chơi, bảng phân tích insights và xuất file CSV.'
                : 'Nhập mật khẩu Ban tổ chức để xem tiến độ người chơi, phân tích hành vi và xuất dữ liệu insights.'}
            </p>
          </div>

          <form onSubmit={handleAdminAuthSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-pass" className="block text-xs font-bold text-[#556B2F]">
                {needsSetup ? 'Mật khẩu quản trị mới (tối thiểu 6 ký tự)' : 'Mật khẩu quản trị'}
              </label>
              <div className="relative">
                <input
                  id="admin-pass"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={needsSetup ? 'new-password' : 'current-password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Nhập mật khẩu Admin..."
                  className="w-full min-h-[46px] pl-3.5 pr-11 py-2.5 rounded-xl border border-[#556B2F]/25 bg-[#F9FBF1] text-sm text-[#212122] focus:outline-2 focus:outline-[#556B2F]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#585A56] hover:text-[#212122] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {needsSetup && (
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-pass-confirm"
                  className="block text-xs font-bold text-[#556B2F]"
                >
                  Nhập lại mật khẩu quản trị
                </label>
                <input
                  id="admin-pass-confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Xác nhận mật khẩu..."
                  className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#556B2F]/25 bg-[#F9FBF1] text-sm text-[#212122] focus:outline-2 focus:outline-[#556B2F]"
                />
              </div>
            )}

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authStatusLoading || authSubmitting}
              className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#556B2F] hover:bg-[#3E5021] disabled:opacity-50 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              {authSubmitting
                ? 'Đang xác thực...'
                : needsSetup
                  ? 'Lưu mật khẩu & Vào Dashboard'
                  : 'Mở Dashboard Quản trị'}
            </button>

            {onBackToPublic && (
              <button
                type="button"
                onClick={onBackToPublic}
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#556B2F]/20 text-xs font-bold text-[#556B2F] hover:bg-[#EFF5D2] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại trang giới thiệu & trò chơi Booth</span>
              </button>
            )}
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7">
      {/* Top Admin Breadcrumb & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#556B2F]/15">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#556B2F]">
            <ShieldCheck className="w-4 h-4" />
            <span>Agri-Next Vietnam / Quản trị & Phân tích Hành vi (Chỉ dành cho Admin)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#212122] mt-1">
            Dashboard Theo Dõi Tiến Độ & Insights Khách Hàng
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onOpenBoothMode && (
            <button
              type="button"
              onClick={onOpenBoothMode}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#556B2F] hover:bg-[#3E5021] text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <MonitorPlay className="w-3.5 h-3.5 text-[#C6D870]" />
              <span>Màn hình Booth</span>
            </button>
          )}
          {onOpenQrModal && (
            <button
              type="button"
              onClick={() => onOpenQrModal('games')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F4991A] hover:bg-[#D9810D] text-[#212122] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Mã QR sự kiện</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => fetchDashboard()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#556B2F]/25 bg-white hover:bg-[#EFF5D2] text-xs font-semibold text-[#212122] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#556B2F] hover:bg-[#3E5021] text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV Insights</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#556B2F]/10 w-fit">
        {[
          { id: 'gifts', label: 'Phát quà Sticker' },
          { id: 'webinar', label: 'Đăng ký Webinar' },
          { id: 'overview', label: 'Tổng quan & Biểu đồ' },
          { id: 'players', label: `Tiến độ Người chơi (${data?.players.length ?? 0})` },
          { id: 'insights', label: `Hộp thư Insights (${data?.insights.length ?? 0})` },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
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

      {fetchError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {fetchError}
        </div>
      )}

      {activeTab === 'gifts' && adminToken && <GiftAdminPanel token={adminToken} />}
      {activeTab === 'webinar' && adminToken && <WebinarAdminPanel token={adminToken} />}

      {activeTab === 'gifts' || activeTab === 'webinar' ? null : loading && !data ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-[#EFF5D2]/60 animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <>
          {/* 4-Column KPI Summary Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white border border-[#556B2F]/15 p-5">
              <div className="text-xs font-semibold text-[#585A56]">Tổng người chơi đăng ký</div>
              <div className="font-mono-num text-3xl font-extrabold text-[#556B2F] mt-1.5">
                {data.kpis.totalPlayers}
              </div>
              <div className="text-xs text-[#585A56] mt-1">
                {data.regionStats[0]
                  ? `Đông nhất: ${data.regionStats[0].region} (${data.regionStats[0].players})`
                  : 'Đa vùng miền'}
              </div>
            </div>
            <div className="rounded-xl bg-white border border-[#556B2F]/15 p-5">
              <div className="text-xs font-semibold text-[#585A56]">Lượt chơi & Tỉ lệ hoàn thành</div>
              <div className="font-mono-num text-3xl font-extrabold text-[#212122] mt-1.5">
                {data.kpis.totalSessions}{' '}
                <span className="text-base text-[#8FA31E]">({data.kpis.completionRate}%)</span>
              </div>
              <div className="text-xs text-[#585A56] mt-1">
                Hoàn thành trên tổng lượt bắt đầu
              </div>
            </div>
            <div className="rounded-xl bg-white border border-[#556B2F]/15 p-5">
              <div className="text-xs font-semibold text-[#585A56]">Điểm trung bình tích lũy</div>
              <div className="font-mono-num text-3xl font-extrabold text-[#556B2F] mt-1.5">
                {data.kpis.avgScore.toLocaleString('vi-VN')}
              </div>
              <div className="text-xs text-[#585A56] mt-1">Trên tổng 3 trò chơi tương tác</div>
            </div>
            <div className="rounded-xl bg-white border border-[#556B2F]/15 p-5">
              <div className="text-xs font-semibold text-[#585A56]">
                Sẵn sàng trả thêm cho nông sản xanh
              </div>
              <div className="font-mono-num text-3xl font-extrabold text-[#F4991A] mt-1.5">
                +{data.kpis.avgWtpPremium}%
              </div>
              <div className="text-xs text-[#585A56] mt-1">
                {data.kpis.totalInsights} góc nhìn định tính đã lưu
              </div>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & CHARTS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Row 1: Behavior Funnel + Knowledge Gap Chart */}
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Behavior Funnel */}
                <div className="lg:col-span-6 rounded-2xl bg-white border border-[#556B2F]/15 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-extrabold text-[#212122]">
                      Phễu Hành vi & Chuyển đổi Khách hàng
                    </h2>
                    <p className="text-xs text-[#585A56] mt-0.5">
                      Theo dõi hành trình từ truy cập Mini Web tới hoàn thành khảo sát thị trường
                    </p>
                  </div>
                  <div className="space-y-3.5 pt-1">
                    {data.funnel.map((item, idx) => (
                      <div key={item.step} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-[#212122]">
                            0{idx + 1}. {item.step}
                          </span>
                          <span className="font-mono-num text-[#556B2F]">
                            {item.count} ({item.conversionPct}%)
                          </span>
                        </div>
                        <div className="h-3 rounded-md bg-[#EFF5D2] overflow-hidden">
                          <div
                            className="h-full rounded-md transition-all"
                            style={{
                              width: `${Math.max(5, item.conversionPct)}%`,
                              backgroundColor: idx === 4 ? '#F4991A' : '#556B2F',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Knowledge Gaps Bar Chart */}
                <div className="lg:col-span-6 rounded-2xl bg-white border border-[#556B2F]/15 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-extrabold text-[#212122]">
                      Bản đồ Khoảng trống Kiến thức Cao Bằng (%)
                    </h2>
                    <p className="text-xs text-[#585A56] mt-0.5">
                      Tỉ lệ trả lời đúng theo nhóm chủ đề — chủ đề thấp nhất cần ưu tiên truyền thông
                    </p>
                  </div>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.knowledgeGaps}
                        layout="vertical"
                        margin={{ top: 4, right: 20, left: 10, bottom: 4 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8E9EB" />
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                        <YAxis
                          type="category"
                          dataKey="topic"
                          width={145}
                          tick={{ fontSize: 11, fill: '#212122' }}
                        />
                        <Tooltip
                          formatter={(value: unknown) => [`${String(value)}%`, 'Tỉ lệ đúng']}
                        />
                        <Bar dataKey="correctRate" radius={[0, 6, 6, 0]}>
                          {data.knowledgeGaps.map((entry, idx) => (
                            <Cell
                              key={entry.topic}
                              fill={entry.correctRate < 70 ? '#F4991A' : CHART_COLORS[idx % 2]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Row 2: WTP Distribution + Persona Pie + Game Effectiveness Table */}
              <div className="grid lg:grid-cols-12 gap-6">
                {/* WTP Distribution */}
                <div className="lg:col-span-5 rounded-2xl bg-white border border-[#556B2F]/15 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-extrabold text-[#212122]">
                      Phân bố Mức sẵn sàng chi trả (WTP)
                    </h2>
                    <p className="text-xs text-[#585A56] mt-0.5">
                      Dữ liệu từ trò chơi Giỏ Quà Xanh Cao Bằng
                    </p>
                  </div>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.wtpDistribution} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8E9EB" />
                        <XAxis dataKey="tier" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value: unknown) => [String(value), 'Người chọn']} />
                        <Bar dataKey="count" fill="#8FA31E" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sustainability Persona Pie */}
                <div className="lg:col-span-4 rounded-2xl bg-white border border-[#556B2F]/15 p-6 space-y-3">
                  <div>
                    <h2 className="text-base font-extrabold text-[#212122]">
                      Phân khúc Chân dung Bền vững
                    </h2>
                    <p className="text-xs text-[#585A56] mt-0.5">Từ lựa chọn Mùa Vụ Tái Sinh</p>
                  </div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.personaStats}
                          dataKey="count"
                          nameKey="persona"
                          cx="50%"
                          cy="50%"
                          innerRadius={42}
                          outerRadius={74}
                          paddingAngle={3}
                        >
                          {data.personaStats.map((entry, idx) => (
                            <Cell
                              key={entry.persona}
                              fill={CHART_COLORS[idx % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {data.personaStats.map((item, idx) => (
                      <div key={item.persona} className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                        />
                        <span className="truncate text-[#212122]">{item.persona}</span>
                        <span className="font-mono-num font-bold text-[#556B2F] ml-auto">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Demand Ranking */}
                <div className="lg:col-span-3 rounded-2xl bg-white border border-[#556B2F]/15 p-6 space-y-3">
                  <div>
                    <h2 className="text-base font-extrabold text-[#212122]">Nhu cầu Sản phẩm</h2>
                    <p className="text-xs text-[#585A56] mt-0.5">Số lần chọn vào giỏ quà</p>
                  </div>
                  <div className="space-y-3 pt-1">
                    {data.productDemand.slice(0, 6).map((item) => (
                      <div key={item.product} className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-[#212122] font-medium line-clamp-1">
                          {item.product}
                        </span>
                        <span className="font-mono-num font-bold text-[#556B2F] shrink-0">
                          {item.selections}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Game Performance Metrics Table + Top Buying Factors & Channels */}
              <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 rounded-2xl bg-white border border-[#556B2F]/15 overflow-hidden">
                  <div className="p-5 border-b border-[#556B2F]/12">
                    <h2 className="text-base font-extrabold text-[#212122]">
                      Hiệu quả Tương tác theo từng Trò chơi
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-[#EFF5D2]/60 text-xs font-bold text-[#3E5021]">
                          <th className="py-3 px-4">Trò chơi</th>
                          <th className="py-3 px-4 text-right">Lượt chơi</th>
                          <th className="py-3 px-4 text-right">Điểm TB</th>
                          <th className="py-3 px-4 text-right">Chính xác</th>
                          <th className="py-3 px-4 text-right">Thời gian TB</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#556B2F]/10">
                        {data.gameStats.map((g) => (
                          <tr key={g.gameType}>
                            <td className="py-3.5 px-4 font-bold text-[#212122]">{g.label}</td>
                            <td className="py-3.5 px-4 text-right font-mono-num">{g.plays}</td>
                            <td className="py-3.5 px-4 text-right font-mono-num font-bold text-[#556B2F]">
                              {g.avgScore}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono-num">
                              {g.avgAccuracy}%
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono-num text-[#585A56]">
                              {g.avgDurationSec}s
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-2xl bg-white border border-[#556B2F]/15 p-6 space-y-4">
                  <h2 className="text-base font-extrabold text-[#212122]">
                    Động lực Mua hàng & Kênh Tiếp cận Ưu tiên
                  </h2>
                  <div className="space-y-2.5">
                    {data.buyingFactorStats.slice(0, 4).map((f) => (
                      <div key={f.factor} className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-[#212122] font-medium">{f.factor}</span>
                        <span className="font-mono-num font-bold text-[#556B2F] shrink-0">
                          {f.count} lượt
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-[#556B2F]/12 space-y-2">
                    <div className="text-xs font-bold text-[#8FA31E]">Kênh khách hàng ưa thích</div>
                    {data.channelStats.slice(0, 3).map((c) => (
                      <div key={c.channel} className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-[#585A56]">{c.channel}</span>
                        <span className="font-mono-num font-bold text-[#212122] shrink-0">
                          {c.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLAYER PROGRESS TABLE */}
          {activeTab === 'players' && (
            <div className="rounded-2xl bg-white border border-[#556B2F]/15 overflow-hidden space-y-4">
              <div className="p-5 border-b border-[#556B2F]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#585A56] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm người chơi, khu vực hoặc đặc sản..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#556B2F]/25 text-xs sm:text-sm focus:outline-none focus:border-[#556B2F]"
                  />
                </div>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-lg border border-[#556B2F]/25 text-xs sm:text-sm bg-white"
                >
                  <option value="all">Tất cả khu vực</option>
                  {data.regionStats.map((r) => (
                    <option key={r.region} value={r.region}>
                      {r.region} ({r.players})
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#EFF5D2]/65 text-xs font-bold text-[#3E5021]">
                      <th className="py-3 px-4">Người chơi</th>
                      <th className="py-3 px-4">Mối quan tâm</th>
                      <th className="py-3 px-4">Chân dung bền vững</th>
                      <th className="py-3 px-4 text-right">Tổng điểm</th>
                      <th className="py-3 px-4 text-right">Lượt</th>
                      <th className="py-3 px-4 text-right">Chính xác</th>
                      <th className="py-3 px-4 text-right">WTP</th>
                      <th className="py-3 px-4">Đặc sản thích</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#556B2F]/10">
                    {filteredPlayers.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F9FBF1]">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#212122]">{p.name}</div>
                          <div className="text-[11px] text-[#585A56]">
                            {p.region} · {p.ageGroup} tuổi
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-[#585A56]">{p.interest}</td>
                        <td className="py-3 px-4 text-xs font-semibold text-[#556B2F]">
                          {p.persona ? PERSONA_LABELS[p.persona].title : 'Chưa hoàn thành'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono-num font-bold text-[#556B2F]">
                          {p.totalScore.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono-num">{p.gamesPlayed}</td>
                        <td className="py-3 px-4 text-right font-mono-num">{p.avgAccuracy}%</td>
                        <td className="py-3 px-4 text-right font-mono-num font-semibold text-[#D9810D]">
                          {p.wtpPremium !== null ? `+${p.wtpPremium}%` : '—'}
                        </td>
                        <td className="py-3 px-4 text-xs text-[#212122]">
                          {p.favoriteSpecialty ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: QUALITATIVE INSIGHTS INBOX */}
          {activeTab === 'insights' && (
            <div className="space-y-4">
              {data.insights.length === 0 ? (
                <div className="rounded-2xl bg-white border border-[#556B2F]/15 p-10 text-center text-sm text-[#585A56]">
                  Chưa có góp ý nào từ cộng đồng.
                </div>
              ) : (
                data.insights.map((ins) => (
                  <div
                    key={ins.id}
                    className="rounded-xl bg-white border border-[#556B2F]/15 p-5 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="text-xs text-[#585A56]">
                        <strong className="text-[#212122]">{ins.authorName}</strong> · {ins.region}{' '}
                        · <span className="font-semibold text-[#556B2F]">{ins.topic}</span> ·{' '}
                        {ins.favoriteCrop}
                      </div>
                      <p className="text-sm text-[#212122] leading-relaxed">{ins.message}</p>
                      <div className="font-mono-num text-[11px] text-[#585A56]">
                        {new Date(ins.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteInsight(ins.id)}
                      className="p-2 rounded-lg text-[#585A56] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                      aria-label="Xóa góc nhìn này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      ) : null}
    </section>
  );
};
