import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Gift, Loader2, RefreshCw, Search, Trash2, Undo2 } from 'lucide-react';
import type { GiftClaimRecord, GiftStatus } from '../types';

/** Booth staff panel: look up a visitor's code and mark the sticker as handed out. */
export const GiftAdminPanel: React.FC<{ token: string }> = ({ token }) => {
  const [gifts, setGifts] = useState<GiftClaimRecord[]>([]);
  const [status, setStatus] = useState<GiftStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [totalInput, setTotalInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const auth = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/gifts', { headers: auth });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setGifts(data.gifts);
      setStatus(data.status);
      setError(null);
    } catch {
      setError('Không tải được danh sách quà.');
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    load();
    const t = window.setInterval(load, 10000);
    return () => window.clearInterval(t);
  }, [load]);

  const toggle = async (g: GiftClaimRecord) => {
    setBusyId(g.id);
    try {
      const res = await fetch(`/api/admin/gifts/${encodeURIComponent(g.id)}`, {
        method: 'PATCH',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ redeemed: !g.redeemedAt }),
      });
      if (res.ok) await load();
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (g: GiftClaimRecord) => {
    if (!window.confirm(`Huỷ mã ${g.code} của ${g.name}? Suất quà sẽ được trả lại.`)) return;
    setBusyId(g.id);
    try {
      const res = await fetch(`/api/admin/gifts/${encodeURIComponent(g.id)}`, { method: 'DELETE', headers: auth });
      if (res.ok) await load();
    } finally {
      setBusyId(null);
    }
  };

  const saveTotal = async () => {
    const res = await fetch('/api/admin/gifts/config', {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ total: Number(totalInput) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? 'Không lưu được.');
      return;
    }
    setTotalInput('');
    await load();
  };

  const q = query.trim().toUpperCase();
  const filtered = q
    ? gifts.filter((g) => g.code.toUpperCase().includes(q) || g.name.toUpperCase().includes(q))
    : gifts;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng suất quà', value: status?.total ?? '—', color: 'text-[#212122]' },
          { label: 'Đã đăng ký nhận', value: status?.claimed ?? '—', color: 'text-[#556B2F]' },
          { label: 'Đã phát tại booth', value: status?.redeemed ?? '—', color: 'text-[#8FA31E]' },
          { label: 'Còn lại', value: status?.remaining ?? '—', color: 'text-[#F4991A]' },
        ].map((k) => (
          <div key={k.label} className="rounded-xl bg-white border border-[#556B2F]/15 p-5">
            <div className="text-xs font-semibold text-[#585A56]">{k.label}</div>
            <div className={`font-mono-num text-3xl font-extrabold mt-1.5 ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-[#556B2F]/15 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-extrabold text-[#212122] flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#F4991A]" /> Phát quà Sticker
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#585A56]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm mã (VD: AN-07) hoặc tên"
                className="pl-9 pr-3 py-2 rounded-lg border border-[#556B2F]/20 text-sm w-60"
              />
            </div>
            <button
              type="button"
              onClick={load}
              className="p-2 rounded-lg bg-[#EFF5D2] text-[#556B2F] hover:bg-[#E2EDB5] cursor-pointer"
              aria-label="Tải lại"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {error && <div className="text-sm text-red-700">{error}</div>}

        {loading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#556B2F]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-[#585A56]">Chưa có mã quà nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#585A56] border-b border-[#556B2F]/10">
                  <th className="py-2 pr-3">#</th>
                  <th className="py-2 pr-3">Mã</th>
                  <th className="py-2 pr-3">Tên</th>
                  <th className="py-2 pr-3">Điểm</th>
                  <th className="py-2 pr-3">Thời gian</th>
                  <th className="py-2 pr-3">Trạng thái</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((g) => (
                  <tr key={g.id} className="border-b border-[#556B2F]/5">
                    <td className="py-2.5 pr-3 font-mono-num">{g.slot}</td>
                    <td className="py-2.5 pr-3 font-mono-num font-bold text-[#556B2F] whitespace-nowrap">{g.code}</td>
                    <td className="py-2.5 pr-3 font-semibold">{g.name}</td>
                    <td className="py-2.5 pr-3 font-mono-num">
                      {g.score}/{g.outOf}
                    </td>
                    <td className="py-2.5 pr-3 text-xs text-[#585A56] whitespace-nowrap">
                      {new Date(g.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}{' '}
                      {new Date(g.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-2.5 pr-3">
                      {g.redeemedAt ? (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#EFF5D2] text-[#556B2F]">Đã phát</span>
                      ) : (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#FFF1DE] text-[#D9810D]">Chờ nhận</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        disabled={busyId === g.id}
                        onClick={() => toggle(g)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                          g.redeemedAt
                            ? 'bg-[#E8E9EB] text-[#585A56] hover:bg-[#D2D3D5]'
                            : 'bg-[#556B2F] text-white hover:bg-[#3E5021]'
                        }`}
                      >
                        {g.redeemedAt ? <Undo2 className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                        {g.redeemedAt ? 'Hoàn tác' : 'Đã phát quà'}
                      </button>
                      <button
                        type="button"
                        disabled={busyId === g.id}
                        onClick={() => remove(g)}
                        className="ml-1.5 p-1.5 rounded-lg text-[#585A56] hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        aria-label="Huỷ mã"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-[#EFF5D2] border border-[#C6D870] p-5 flex flex-wrap items-center gap-3">
        <div className="text-sm text-[#212122] flex-1 min-w-[220px]">
          <div className="font-bold">Thay đổi tổng số suất quà</div>
          <div className="text-xs text-[#585A56]">
            Mặc định 30. Có thể tăng nếu bổ sung sticker (không thấp hơn số mã đã cấp).
          </div>
        </div>
        <input
          type="number"
          min={status?.claimed ?? 0}
          value={totalInput}
          onChange={(e) => setTotalInput(e.target.value)}
          placeholder={String(status?.total ?? 30)}
          className="w-24 px-3 py-2 rounded-lg border border-[#556B2F]/20 text-sm bg-white"
        />
        <button
          type="button"
          onClick={saveTotal}
          disabled={!totalInput}
          className="px-4 py-2 rounded-lg bg-[#556B2F] text-white text-sm font-bold disabled:opacity-50 cursor-pointer"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};
