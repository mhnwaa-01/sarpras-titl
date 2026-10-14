import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  ArrowLeft,
  MapPin,
  Tag,
  Boxes,
  CheckCircle2,
  XCircle,
  Building2,
  Wrench,
  Clock,
  QrCode,
  ShieldAlert
} from "lucide-react";
import { formatTanggalIndo } from "@/lib/utils";

interface PageProps {
  params: {
    barcode_id: string;
  };
}

export default async function PublicItemScanPage({ params }: PageProps) {
  const barcode_id = decodeURIComponent(params.barcode_id);

  let item = null;
  let activeLoans: any[] = [];
  let errorMsg = null;

  try {
    item = await prisma.inventaris.findUnique({
      where: { barcode_id },
      include: {
        peminjaman: {
          where: {
            status_pinjam: "APPROVED",
            status_kembali: "BELUM",
          },
          include: {
            user: {
              select: {
                nama_lengkap: true,
              },
            },
          },
        },
      },
    });

    if (item) {
      activeLoans = item.peminjaman;
    }
  } catch (err: any) {
    console.error("Scan query error:", err);
    errorMsg = "Gagal terhubung ke database inventaris.";
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Item Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mb-6">
            Barcode ID <span className="font-mono font-bold text-slate-800">"{barcode_id}"</span> belum terdaftar
            dalam sistem inventaris SMKN 10 Makassar.
          </p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" /> Scan Barcode Lain
          </Link>
        </div>
      </div>
    );
  }

  const isSarana = item.jenis_aset === "SARANA";
  const isBaik = item.kondisi === "BAIK";
  const isCurrentlyBorrowed = activeLoans.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Scan Kode Lain
          </Link>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <QrCode className="w-3.5 h-3.5" />
            <span className="font-mono">{item.barcode_id}</span>
          </div>
        </div>

        {/* Main Item Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    isSarana ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
                  }`}
                >
                  {item.jenis_aset}
                </span>
                <span className="text-slate-300 text-xs font-medium">
                  {item.kategori}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {item.nama_item}
              </h1>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> Lokasi: {item.lokasi}
              </p>
            </div>

            {/* Condition Status Badge */}
            <div className="shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                  isBaik
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}
              >
                {isBaik ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                Kondisi: {item.kondisi}
              </span>
            </div>
          </div>

          {/* Grid Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Image display if available */}
            {item.gambar_url ? (
              <div className="w-full h-64 sm:h-80 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.gambar_url}
                  alt={item.nama_item}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-40 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                {isSarana ? <Wrench className="w-10 h-10 mb-1" /> : <Building2 className="w-10 h-10 mb-1" />}
                <span className="text-xs">Foto fisik belum diunggah</span>
              </div>
            )}

            {/* Information Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-500">Jumlah / Kapasitas</span>
                <div className="text-xl font-bold text-slate-900 mt-1">{item.jumlah} unit</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-500">Status Fisik</span>
                <div className={`text-base font-bold mt-1 ${isBaik ? "text-emerald-700" : "text-rose-700"}`}>
                  {item.kondisi}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Klasifikasi Standar</span>
                <div className="text-xs font-semibold text-slate-800 mt-1">
                  Permendikbudristek No. 22/2023 ({item.jenis_aset})
                </div>
              </div>
            </div>

            {/* Real-time Borrowing Status */}
            {isSarana && (
              <div className="border border-slate-200 rounded-2xl p-5 bg-white">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" /> Status Ketersediaan Saat Ini
                </h3>

                {isCurrentlyBorrowed ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      Sedang Dipinjam ({activeLoans.length} Peminjaman Aktif)
                    </div>
                    {activeLoans.map((loan) => (
                      <div key={loan.id} className="text-xs text-amber-900 border-t border-amber-200/60 pt-2 mt-2">
                        <div>
                          <strong>Peminjam:</strong> {loan.user.nama_lengkap} ({loan.jumlah_pinjam} unit)
                        </div>
                        <div className="text-[11px] text-amber-800">
                          <strong>Batas Kembali:</strong> {formatTanggalIndo(loan.tgl_kembali)} • Keperluan: {loan.keperluan}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Tersedia untuk dipinjam oleh Guru SMKN 10 Makassar
                    </div>
                    <Link
                      href="/guru"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow transition"
                    >
                      Ajukan Pinjam
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
