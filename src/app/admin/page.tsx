import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  Boxes,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ClipboardList,
  QrCode,
  ArrowRight,
  PlusCircle,
  FileText
} from "lucide-react";
import { formatTanggalIndo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalSarana,
    totalPrasarana,
    kondisiBaik,
    kondisiRusak,
    pendingLoans,
    activeLoans,
    recentPendingList,
  ] = await Promise.all([
    prisma.inventaris.count({ where: { jenis_aset: "SARANA" } }),
    prisma.inventaris.count({ where: { jenis_aset: "PRASARANA" } }),
    prisma.inventaris.count({ where: { kondisi: "BAIK" } }),
    prisma.inventaris.count({ where: { kondisi: "RUSAK" } }),
    prisma.peminjaman.count({ where: { status_pinjam: "PENDING" } }),
    prisma.peminjaman.count({
      where: { status_pinjam: "APPROVED", status_kembali: "BELUM" },
    }),
    prisma.peminjaman.findMany({
      where: { status_pinjam: "PENDING" },
      include: {
        user: { select: { nama_lengkap: true, username: true } },
        inventaris: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            Dashboard Kepala Bengkel & Sarpras
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sistem Inventaris SMKN 10 Makassar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan aset mengacu pada Permendikbudristek No. 22 Tahun 2023.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/inventaris?action=create"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition"
          >
            <PlusCircle className="w-4 h-4" />
            Tambah Aset Baru
          </Link>
          <Link
            href="/admin/barcode"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-lg text-xs font-semibold shadow transition"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            Cetak Label Barcode
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sarana */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sarana</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalSarana}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Bahan, Alat Pembelajaran, Perlengkapan
          </div>
        </div>

        {/* Total Prasarana */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Prasarana</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalPrasarana}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Ruang Praktik/Bengkel, Lab, Lahan, Bangunan
          </div>
        </div>

        {/* Kondisi Baik vs Rusak */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kondisi Aset</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{kondisiBaik}</span>
            <span className="text-xs text-slate-500">Baik /</span>
            <span className="text-lg font-bold text-rose-600">{kondisiRusak}</span>
            <span className="text-xs text-slate-500">Rusak</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {kondisiRusak > 0 ? "Memerlukan perbaikan/maintenance" : "Semua aset siap pakai"}
          </div>
        </div>

        {/* Peminjaman Pending & Aktif */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peminjaman</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{pendingLoans}</span>
            <span className="text-xs text-slate-500">Pending /</span>
            <span className="text-lg font-bold text-blue-600">{activeLoans}</span>
            <span className="text-xs text-slate-500">Aktif</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {pendingLoans > 0 ? "Ada permohonan menunggu persetujuan" : "Tidak ada antrean pending"}
          </div>
        </div>
      </div>

      {/* Permendikbud Reference Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-blue-800 text-[10px] font-bold uppercase tracking-wider text-blue-200">
            Standar Nasional Pendidikan
          </span>
          <h3 className="text-lg font-bold mt-1 text-white">
            Pedoman Permendikbudristek No. 22 Tahun 2023
          </h3>
          <p className="text-xs text-blue-200 mt-1 max-w-2xl">
            Sistem memisahkan sarana (bahan pembelajaran, alat pembelajaran, dan perlengkapan) dari prasarana (lahan,
            bangunan, dan ruang: ruang kelas, ruang praktik/bengkel, laboratorium, ruang administrasi) guna akurasi
            laporan sarpras SMK.
          </p>
        </div>
        <Link
          href="/admin/inventaris"
          className="shrink-0 px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          Buka Tabel Sarpras <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Recent Pending Loans Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Permohonan Peminjaman Menunggu Persetujuan ({pendingLoans})
            </h3>
          </div>
          <Link
            href="/admin/peminjaman"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Lihat Semua Peminjaman <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentPendingList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Tidak ada permohonan peminjaman yang berstatus PENDING saat ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Guru Peminjam</th>
                  <th className="p-3.5">Alat / Sarana</th>
                  <th className="p-3.5 text-center">Jumlah</th>
                  <th className="p-3.5">Tgl Pinjam - Kembali</th>
                  <th className="p-3.5">Keperluan Praktik</th>
                  <th className="p-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPendingList.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-bold text-slate-900">
                      {loan.user.nama_lengkap}
                      <div className="text-[10px] text-slate-400 font-normal">@{loan.user.username}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800">{loan.inventaris.nama_item}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{loan.inventaris.barcode_id}</div>
                    </td>
                    <td className="p-3.5 text-center font-bold text-slate-800">{loan.jumlah_pinjam} unit</td>
                    <td className="p-3.5 text-slate-600 text-[11px]">
                      {formatTanggalIndo(loan.tgl_pinjam)} s/d {formatTanggalIndo(loan.tgl_kembali)}
                    </td>
                    <td className="p-3.5 text-slate-600 italic max-w-xs truncate">{loan.keperluan}</td>
                    <td className="p-3.5 text-center">
                      <Link
                        href={`/admin/peminjaman?highlight=${loan.id}`}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-semibold transition inline-block"
                      >
                        Tinjau & Setujui
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
