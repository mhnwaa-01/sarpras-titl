"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Printer,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Boxes,
  RotateCcw,
  AlertCircle
} from "lucide-react";
import { formatTanggalIndo } from "@/lib/utils";

interface PeminjamanRecord {
  id: string;
  jumlah_pinjam: number;
  tgl_pinjam: string;
  tgl_kembali: string;
  keperluan: string;
  status_pinjam: "PENDING" | "APPROVED" | "REJECTED";
  status_kembali: "BELUM" | "DIKEMBALIKAN";
  catatan?: string | null;
  ceklis_kondisi_kembali?: string | null;
  inventaris: {
    nama_item: string;
    barcode_id: string;
    jenis_aset: string;
    kategori: string;
    lokasi: string;
    kondisi: string;
  };
}

export default function GuruPeminjamanPage() {
  const [loans, setLoans] = useState<PeminjamanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/peminjaman")
      .then((res) => res.json())
      .then((data) => setLoans(data.peminjaman || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            Manajemen Peminjaman Mandiri
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            Riwayat Peminjaman Alat Saya
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Status persetujuan Kepala Bengkel dan akses cetak Borang Peminjaman resmi format A4.
          </p>
        </div>
        <Link
          href="/guru"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow transition"
        >
          <Boxes className="w-4 h-4" />
          Ajukan Peminjaman Baru
        </Link>
      </div>

      {/* Main Loan List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat riwayat peminjaman...</div>
        ) : loans.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Anda belum pernah mengajukan peminjaman alat sarana.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Nama Sarana / Alat</th>
                  <th className="p-3.5 text-center">Jumlah</th>
                  <th className="p-3.5">Jadwal Pinjam - Kembali</th>
                  <th className="p-3.5">Keperluan & Catatan</th>
                  <th className="p-3.5 text-center">Status Verifikasi</th>
                  <th className="p-3.5 text-center">Cetak Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loans.map((loan) => {
                  const isApproved = loan.status_pinjam === "APPROVED";
                  const isPending = loan.status_pinjam === "PENDING";
                  const isRejected = loan.status_pinjam === "REJECTED";
                  const isReturned = loan.status_kembali === "DIKEMBALIKAN";

                  return (
                    <tr key={loan.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{loan.inventaris.nama_item}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {loan.inventaris.barcode_id} • {loan.inventaris.lokasi}
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
                          <div className="text-[10px] text-blue-600 mt-1">
                            <strong>Catatan Admin:</strong> {loan.catatan}
                          </div>
                        )}
                        {loan.ceklis_kondisi_kembali && (
                          <div className="text-[10px] text-emerald-600 mt-1">
                            <strong>Ceklis Kembali:</strong> {loan.ceklis_kondisi_kembali}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              isApproved
                                ? "bg-emerald-100 text-emerald-800"
                                : isRejected
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {loan.status_pinjam}
                          </span>
                          {isApproved && (
                            <div className="text-[9px] uppercase font-bold text-slate-500">
                              {isReturned ? "SUDAH KEMBALI" : "SEDANG DIGUNAKAN"}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        {isApproved ? (
                          <Link
                            href={`/guru/peminjaman/cetak/${loan.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-sm transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Cetak Borang A4
                          </Link>
                        ) : (
                          <button
                            disabled
                            title="Borang hanya dapat dicetak setelah permohonan disetujui (Approved) oleh Kepala Bengkel"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-400 rounded-lg text-[11px] font-semibold cursor-not-allowed border border-slate-200"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            {isPending ? "Menunggu Approve" : "Ditolak"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
