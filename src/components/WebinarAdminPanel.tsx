import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Copy, Download, Loader2, Mail, RefreshCw, Trash2 } from 'lucide-react';
import type { WebinarSignupRecord } from '../types';

const SOURCE_LABEL: Record<string, string> = {
  'project-page': 'Trang Dự án',
  'sticker-voucher': 'Sau khi nhận sticker',
};

/** Admin list of visitors who left an email for webinar updates. */
export const WebinarAdminPanel: React.FC<{ token: string }> = ({ token }) => {
  const [signups, setSignups] = useState<WebinarSignupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const auth = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/webinar-signups', { headers: auth });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSignups(data.signups);
      setError(null);
    } catch {
      setError('Không tải được danh sách đăng ký.');
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    load();
  }, [load]);

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(signups.map((s) => s.email).join(', '));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Trình duyệt không cho phép copy — hãy dùng nút Tải CSV.');
    }
  };

  const downloadCsv = async () => {
    const res = await fetch('/api/admin/webinar-signups.csv', { headers: auth });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agrinext-webinar-signups.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const remove = async (s: WebinarSignupRecord) => {
    if (!window.confirm(`Xoá ${s.email} khỏi danh sách?`)) return;
    const res = await fetch(`/api/admin/webinar-signups/${encodeURIComponent(s.id)}`, {
      method: 'DELETE',
      headers: auth,
    });
    if (res.ok) load();
  };

  return (
    <div className="rounded-2xl bg-white border border-[#556B2F]/15 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-extrabold text-[#212122] flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#F4991A]" /> Email nhận tin Webinar
          <span className="font-mono-num text-sm px-2 py-0.5 rounded-md bg-[#EFF5D2] text-[#556B2F]">
            {signups.length}
          </span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyAll}
            disabled={!signups.length}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EFF5D2] text-[#556B2F] text-xs font-bold disabled:opacity-50 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" /> {copied ? 'Đã copy!' : 'Copy tất cả email'}
          </button>
          <button
            type="button"
            onClick={downloadCsv}
            disabled={!signups.length}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#556B2F] text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Tải CSV
          </button>
          <button
            type="button"
            onClick={load}
            className="p-2 rounded-lg bg-[#EFF5D2] text-[#556B2F] cursor-pointer"
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
      ) : signups.length === 0 ? (
        <div className="py-10 text-center text-sm text-[#585A56]">Chưa có ai để lại email.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[#585A56] border-b border-[#556B2F]/10">
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Tên</th>
                <th className="py-2 pr-3">Nguồn</th>
                <th className="py-2 pr-3">Thời gian</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {signups.map((s) => (
                <tr key={s.id} className="border-b border-[#556B2F]/5">
                  <td className="py-2.5 pr-3 font-semibold text-[#212122]">{s.email}</td>
                  <td className="py-2.5 pr-3">{s.name || '—'}</td>
                  <td className="py-2.5 pr-3 text-xs text-[#585A56]">{SOURCE_LABEL[s.source] ?? s.source}</td>
                  <td className="py-2.5 pr-3 text-xs text-[#585A56] whitespace-nowrap">
                    {new Date(s.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => remove(s)}
                      className="p-1.5 rounded-lg text-[#585A56] hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      aria-label="Xoá"
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
  );
};
