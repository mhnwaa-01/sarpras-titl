"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Search,
  Filter,
  CheckSquare,
  AlertTriangle,
  X,
  FileText
} from "lucide-react";
import { formatTanggalIndo } from "@/lib/utils";

interface PeminjamanRecord {
  id: string;
  user_id: string;
  inventaris_id: string;
  jumlah_pinjam: number;
  tgl_pinjam: string;
  tgl_kembali: string;
  keperluan: string;
  status_pinjam: "PENDING" | "APPROVED" | "REJECTED";
  status_kembali: "BELUM" | "DIKEMBALIKAN";
  ceklis_kondisi_kembali?: string | null;
  catatan?: string | null;
  user: {
    nama_lengkap: string;
    username: string;
  };
  inventaris: {
    nama_item: string;
    barcode_id: string;
    jenis_aset: string;
    kategori: string;
    lokasi: string;
    kondisi: string;
    jumlah: number;
  };
}

export default function AdminPeminjamanPage() {
  const [loans, setLoans] = useState<PeminjamanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PENDING" | "ACTIVE" | "HISTORY">("PENDING");
  const [search, setSearch] = useState("");

  // Approval Modal State
  const [selectedLoan, setSelectedLoan] = useState<PeminjamanRecord | null>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT" | null>(null);
  const [catatanAction, setCatatanAction] = useState("");
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  // Return Verification Modal State
  const [returnLoan, setReturnLoan] = useState<PeminjamanRecord | null>(null);
  const [checklistValues, setChecklistValues] = useState({
    lengkap: true,
    bersih: true,
    fungsiNormal: true,
    kondisiAkhir: "BAIK" as "BAIK" | "RUSAK",
    catatanTambahan: "",
  });
  const [isReturnSubmitting, setIsReturnSubmitting] = useState(false);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/peminjaman");
      const data = await res.json();
      if (res.ok) {
        setLoans(data.peminjaman || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApproveRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan || !actionType) return;

    setIsActionSubmitting(true);
    try {
      const res = await fetch(`/api/peminjaman/${selectedLoan.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status_pinjam: actionType === "APPROVE" ? "APPROVED" : "REJECTED",
          catatan: catatanAction,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal memproses permohonan.");
        return;
      }

      setSelectedLoan(null);
      setActionType(null);
      setCatatanAction("");
      fetchLoans();
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnLoan) return;

    setIsReturnSubmitting(true);
    try {
      const checklistSummary = [
        checklistValues.lengkap ? "[V] Kelengkapan Fisik Lengkap" : "[X] Kelengkapan Tidak Lengkap",
        checklistValues.bersih ? "[V] Kebersihan Terjaga" : "[X] Kondisi Kotor",
        checklistValues.fungsiNormal ? "[V] Fungsi Alat Normal" : "[X] Fungsi Terganggu / Rusak",
      ].join(", ");

      const res = await fetch(`/api/peminjaman/${returnLoan.id}/kembali`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ceklis_kondisi_kembali: checklistSummary,
          kondisi_akhir: checklistValues.kondisiAkhir,
          catatan: checklistValues.catatanTambahan,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal memproses pengembalian.");
        return;
      }

      setReturnLoan(null);
      fetchLoans();
    } catch (err) {
      console.error(err);
    } finally {
      setIsReturnSubmitting(false);
    }
  };

  // Filter based on tab and search
  const filteredLoans = loans.filter((loan) => {
    if (activeTab === "PENDING") {
      if (loan.status_pinjam !== "PENDING") return false;
    } else if (activeTab === "ACTIVE") {
      if (loan.status_pinjam !== "APPROVED" || loan.status_kembali !== "BELUM") return false;
    } else if (activeTab === "HISTORY") {
      if (loan.status_kembali !== "DIKEMBALIKAN" && loan.status_pinjam !== "REJECTED") return false;
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      const matchGuru = loan.user.nama_lengkap.toLowerCase().includes(s);
      const matchItem = loan.inventaris.nama_item.toLowerCase().includes(s);
      const matchBarcode = loan.inventaris.barcode_id.toLowerCase().includes(s);
      const matchReason = loan.keperluan.toLowerCase().includes(s);
      return matchGuru || matchItem || matchBarcode || matchReason;
    }

    return true;
  });

  const pendingCount = loans.filter((l) => l.status_pinjam === "PENDING").length;
  const activeCount = loans.filter((l) => l.status_pinjam === "APPROVED" && l.status_kembali === "BELUM").length;
  const historyCount = loans.filter((l) => l.status_kembali === "DIKEMBALIKAN" || l.status_pinjam === "REJECTED").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            Persetujuan Peminjaman & Verifikasi Pengembalian
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Alur verifikasi fisik sarana praktik SMKN 10 Makassar dengan update stok otomatis.
          </p>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab("PENDING")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "PENDING"
                  ? "bg-amber-600 text-white shadow"
                  : "text-slate-600 hover:text-amber-600"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Permohonan Masuk ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab("ACTIVE")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "ACTIVE"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sedang Dipinjam ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab("HISTORY")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "HISTORY"
                  ? "bg-slate-800 text-white shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Riwayat Selesai ({historyCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari guru, nama alat, keperluan..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat data peminjaman...</div>
        ) : filteredLoans.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Tidak ada permohonan peminjaman pada tab ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Guru Peminjam</th>
                  <th className="p-3.5">Sarana / Alat</th>
                  <th className="p-3.5 text-center">Jumlah</th>
                  <th className="p-3.5">Jadwal Pinjam - Kembali</th>
                  <th className="p-3.5">Keperluan & Catatan</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-bold text-slate-900">
                      {loan.user.nama_lengkap}
                      <div className="text-[10px] text-slate-400 font-normal">@{loan.user.username}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{loan.inventaris.nama_item}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {loan.inventaris.barcode_id} • Lokasi: {loan.inventaris.lokasi}
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-bold text-slate-800">
                      {loan.jumlah_pinjam} unit
                    </td>
                    <td className="p-3.5 text-slate-600 text-[11px]">
                      <div><strong>Pinjam:</strong> {formatTanggalIndo(loan.tgl_pinjam)}</div>
                      <div><strong>Batas:</strong> {formatTanggalIndo(loan.tgl_kembali)}</div>
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-xs">
                      <div className="italic text-slate-800 font-medium">{loan.keperluan}</div>
                      {loan.catatan && (
                        <div className="text-[10px] text-blue-600 mt-1">Catatan: {loan.catatan}</div>
                      )}
                      {loan.ceklis_kondisi_kembali && (
                        <div className="text-[10px] text-emerald-600 mt-1">
                          Ceklis: {loan.ceklis_kondisi_kembali}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            loan.status_pinjam === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800"
                              : loan.status_pinjam === "REJECTED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {loan.status_pinjam}
                        </span>
                        {loan.status_pinjam === "APPROVED" && (
                          <div className="text-[9px] uppercase font-bold text-slate-400">
                            {loan.status_kembali === "DIKEMBALIKAN" ? "DIKEMBALIKAN" : "BELUM KEMBALI"}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      {/* PENDING Actions */}
                      {loan.status_pinjam === "PENDING" && (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedLoan(loan);
                              setActionType("APPROVE");
                              setCatatanAction("Disetujui untuk kegiatan praktik pembelajaran kejuruan.");
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-sm transition"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLoan(loan);
                              setActionType("REJECT");
                              setCatatanAction("Ditolak karena alat sedang dalam proses kalibrasi.");
                            }}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold shadow-sm transition"
                          >
                            Tolak
                          </button>
                        </div>
                      )}

                      {/* ACTIVE Actions: Verify Return */}
                      {loan.status_pinjam === "APPROVED" && loan.status_kembali === "BELUM" && (
                        <button
                          onClick={() => {
                            setReturnLoan(loan);
                            setChecklistValues({
                              lengkap: true,
                              bersih: true,
                              fungsiNormal: true,
                              kondisiAkhir: "BAIK",
                              catatanTambahan: "Alat diterima kembali dalam keadaan baik dan lengkap.",
                            });
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-sm flex items-center justify-center gap-1 mx-auto transition"
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          Ceklis Pengembalian
                        </button>
                      )}

                      {/* COMPLETED Actions */}
                      {(loan.status_kembali === "DIKEMBALIKAN" || loan.status_pinjam === "REJECTED") && (
                        <span className="text-[11px] text-slate-400 font-medium">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Approve / Reject */}
      {selectedLoan && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {actionType === "APPROVE" ? "Persetujuan Peminjaman (APPROVE)" : "Penolakan Peminjaman (REJECT)"}
              </h3>
              <button
                onClick={() => {
                  setSelectedLoan(null);
                  setActionType(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApproveRejectSubmit} className="mt-4 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div><strong>Peminjam:</strong> {selectedLoan.user.nama_lengkap}</div>
                <div><strong>Alat:</strong> {selectedLoan.inventaris.nama_item} ({selectedLoan.jumlah_pinjam} unit)</div>
                <div><strong>Stok Tersedia:</strong> {selectedLoan.inventaris.jumlah} unit</div>
                <div><strong>Keperluan:</strong> {selectedLoan.keperluan}</div>
              </div>

              {actionType === "APPROVE" && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-800">
                  Setelah disetujui, stok alat akan berkurang <strong>{selectedLoan.jumlah_pinjam} unit</strong> otomatis, dan Guru dapat mencetak <strong>Borang Peminjaman A4</strong>.
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Persetujuan / Alasan:
                </label>
                <textarea
                  rows={3}
                  value={catatanAction}
                  onChange={(e) => setCatatanAction(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLoan(null);
                    setActionType(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isActionSubmitting}
                  className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow disabled:opacity-50 ${
                    actionType === "APPROVE" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {isActionSubmitting ? "Memproses..." : actionType === "APPROVE" ? "Konfirmasi Setujui" : "Konfirmasi Tolak"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Verifikasi Fisik Pengembalian */}
      {returnLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                Ceklis Fisik & Verifikasi Pengembalian
              </h3>
              <button
                onClick={() => setReturnLoan(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="mt-4 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div><strong>Peminjam:</strong> {returnLoan.user.nama_lengkap}</div>
                <div><strong>Barang:</strong> {returnLoan.inventaris.nama_item} ({returnLoan.jumlah_pinjam} unit)</div>
                <div><strong>Lokasi Pengembalian:</strong> {returnLoan.inventaris.lokasi}</div>
              </div>

              {/* Physical Condition Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Ceklis Pemeriksaan Fisik oleh Toolman / Petugas:
                </label>
                <div className="space-y-2 border border-slate-200 p-3 rounded-xl bg-slate-50">
                  <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklistValues.lengkap}
                      onChange={(e) =>
                        setChecklistValues({ ...checklistValues, lengkap: e.target.checked })
                      }
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>Kelengkapan komponen/aksesoris lengkap tanpa ada yang tertinggal</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklistValues.bersih}
                      onChange={(e) =>
                        setChecklistValues({ ...checklistValues, bersih: e.target.checked })
                      }
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>Alat dalam kondisi bersih (bebas gram besi/oli berlebih/debu)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklistValues.fungsiNormal}
                      onChange={(e) =>
                        setChecklistValues({ ...checklistValues, fungsiNormal: e.target.checked })
                      }
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>Uji fungsi normal (tombol, motor penggerak, kabel, atau sensor menyala)</span>
                  </label>
                </div>
              </div>

              {/* Kondisi Akhir */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kondisi Akhir Alat Setelah Dipinjam:
                </label>
                <select
                  value={checklistValues.kondisiAkhir}
                  onChange={(e) =>
                    setChecklistValues({
                      ...checklistValues,
                      kondisiAkhir: e.target.value as any,
                    })
                  }
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BAIK">BAIK (Siap digunakan kembali)</option>
                  <option value="RUSAK">RUSAK (Perlu perbaikan sebelum dipinjam lagi)</option>
                </select>
              </div>

              {/* Catatan Tambahan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tambahan Pengembalian:
                </label>
                <textarea
                  rows={2}
                  value={checklistValues.catatanTambahan}
                  onChange={(e) =>
                    setChecklistValues({ ...checklistValues, catatanTambahan: e.target.value })
                  }
                  placeholder="Catatan kondisi fisik saat diterima kembali..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800">
                Setelah diverifikasi, status diubah menjadi <strong>DIKEMBALIKAN</strong> dan stok alat bertambah <strong>{returnLoan.jumlah_pinjam} unit</strong> otomatis ke inventaris.
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReturnLoan(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isReturnSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow disabled:opacity-50"
                >
                  {isReturnSubmitting ? "Menyimpan..." : "Verifikasi & Kembalikan Stok"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
