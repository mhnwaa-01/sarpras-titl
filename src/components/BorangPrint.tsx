"use client";

import { Printer, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { formatTanggalIndo } from "@/lib/utils";

interface BorangPrintProps {
  peminjaman: {
    id: string;
    jumlah_pinjam: number;
    tgl_pinjam: string | Date;
    tgl_kembali: string | Date;
    keperluan: string;
    status_pinjam: "PENDING" | "APPROVED" | "REJECTED";
    status_kembali: "BELUM" | "DIKEMBALIKAN";
    catatan?: string | null;
    ceklis_kondisi_kembali?: string | null;
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
    };
  };
}

export default function BorangPrint({ peminjaman }: BorangPrintProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Top Action Bar (Hidden on print) */}
      <div className="no-print mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <Link
          href="/guru/peminjaman"
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Riwayat Peminjaman
        </Link>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Status: {peminjaman.status_pinjam}
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition"
          >
            <Printer className="w-4 h-4" />
            Cetak Borang (A4)
          </button>
        </div>
      </div>

      {/* Official A4 Document Paper */}
      <div className="bg-white p-8 sm:p-12 border border-slate-300 shadow-lg print:border-none print:shadow-none print:p-0 text-black">
        {/* Kop Surat Resmi SMKN 10 Makassar */}
        <div className="border-b-4 border-double border-black pb-4 mb-6 text-center">
          <div className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-black">
            PEMERINTAH PROVINSI SULAWESI SELATAN
          </div>
          <div className="text-xs sm:text-sm font-bold tracking-wider uppercase text-black">
            DINAS PENDIDIKAN
          </div>
          <div className="text-base sm:text-xl font-black tracking-wide uppercase text-black mt-1">
            UPT SMK NEGERI 10 MAKASSAR
          </div>
          <div className="text-[11px] text-gray-700 mt-1">
            Jl. Bontomanai No. 14, Gn. Sari, Kec. Rappocini, Kota Makassar, Sulawesi Selatan 90222
          </div>
          <div className="text-[10px] text-gray-600">
            Laman: smkn10makassar.sch.id | Surel: info@smkn10makassar.sch.id
          </div>
        </div>

        {/* Title of Document */}
        <div className="text-center mb-6">
          <h2 className="text-base font-extrabold uppercase underline tracking-wider text-black">
            BORANG PEMINJAMAN SARANA PEMBELAJARAN & PERALATAN PRAKTIK
          </h2>
          <p className="text-xs font-mono text-gray-700 mt-0.5">
            Nomor Registrasi: PINJAM-{peminjaman.id.substring(0, 8).toUpperCase()}
          </p>
          <p className="text-[10px] text-gray-500 italic">
            Acuan: Permendikbudristek No. 22 Tahun 2023 tentang Standar Sarana dan Prasarana
          </p>
        </div>

        {/* Content Paragraph */}
        <p className="text-xs leading-relaxed mb-4 text-justify">
          Pada hari ini telah tercatat permohonan dan persetujuan peminjaman sarana pembelajaran praktik kejuruan
          di lingkungan SMK Negeri 10 Makassar dengan rincian data sebagai berikut:
        </p>

        {/* Section 1: Data Peminjam */}
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-gray-100 p-1.5 border-l-4 border-black mb-2">
            A. IDENTITAS PEMINJAM
          </h3>
          <table className="w-full text-xs border-collapse">
            <tbody>
              <tr>
                <td className="w-48 py-1 font-semibold text-gray-700">Nama Lengkap Guru</td>
                <td className="w-4 py-1">:</td>
                <td className="py-1 font-bold">{peminjaman.user.nama_lengkap}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold text-gray-700">Username / NIP / ID</td>
                <td className="py-1">:</td>
                <td className="py-1">{peminjaman.user.username}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold text-gray-700">Tanggal Mulai Pinjam</td>
                <td className="py-1">:</td>
                <td className="py-1 font-medium">{formatTanggalIndo(peminjaman.tgl_pinjam)}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold text-gray-700">Rencana Tanggal Pengembalian</td>
                <td className="py-1">:</td>
                <td className="py-1 font-medium">{formatTanggalIndo(peminjaman.tgl_kembali)}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold text-gray-700">Keperluan Penggunaan</td>
                <td className="py-1">:</td>
                <td className="py-1 font-medium italic">{peminjaman.keperluan}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: Data Sarana yang Dipinjam */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-gray-100 p-1.5 border-l-4 border-black mb-2">
            B. RINCIAN SARANA / ALAT YANG DIPINJAM
          </h3>
          <table className="w-full text-xs border border-black border-collapse text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-2 text-center w-8">No</th>
                <th className="border border-black p-2">Kode Barcode</th>
                <th className="border border-black p-2">Nama Sarana / Alat</th>
                <th className="border border-black p-2">Klasifikasi Permendikbud</th>
                <th className="border border-black p-2">Lokasi Asal</th>
                <th className="border border-black p-2 text-center">Jumlah</th>
                <th className="border border-black p-2 text-center">Kondisi Awal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2 text-center font-bold">1</td>
                <td className="border border-black p-2 font-mono font-bold">{peminjaman.inventaris.barcode_id}</td>
                <td className="border border-black p-2 font-bold">{peminjaman.inventaris.nama_item}</td>
                <td className="border border-black p-2">{peminjaman.inventaris.kategori}</td>
                <td className="border border-black p-2">{peminjaman.inventaris.lokasi}</td>
                <td className="border border-black p-2 text-center font-bold">{peminjaman.jumlah_pinjam} unit</td>
                <td className="border border-black p-2 text-center font-bold text-emerald-800">
                  {peminjaman.inventaris.kondisi}
                </td>
              </tr>
            </tbody>
          </table>
          {peminjaman.catatan && (
            <div className="mt-2 text-xs text-gray-700 italic">
              <strong>Catatan Petugas/Kepala Bengkel:</strong> {peminjaman.catatan}
            </div>
          )}
        </div>

        {/* Section 3: Pernyataan dan Tata Tertib */}
        <div className="mb-8 p-3 bg-gray-50 border border-gray-300 rounded text-[11px] leading-relaxed">
          <div className="font-bold uppercase text-black mb-1">KETENTUAN & PERNYATAAN PEMINJAM:</div>
          <ol className="list-decimal pl-4 space-y-0.5 text-gray-800">
            <li>Peminjam wajib menjaga keutuhan, kebersihan, dan fungsi normal alat selama masa peminjaman.</li>
            <li>Alat tidak diperkenankan dipindahtangankan kepada pihak lain tanpa persetujuan Kepala Bengkel.</li>
            <li>Segala bentuk kehilangan, kerusakan akibat kelalaian, menjadi tanggung jawab penuh peminjam sesuai SOP SMKN 10 Makassar.</li>
            <li>Pengembalian wajib diverifikasi langsung oleh Toolman/Petugas Sarpras dengan mengisi ceklis fisik.</li>
          </ol>
        </div>

        {/* Signatures Columns (3 Kolom) */}
        <div className="mt-8 pt-4 border-t border-gray-300">
          <div className="text-right text-xs mb-4">
            Makassar, {formatTanggalIndo(peminjaman.tgl_pinjam)}
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            {/* Kolom 1: Peminjam */}
            <div className="flex flex-col justify-between h-32">
              <div>
                <p className="font-semibold text-gray-700">Peminjam,</p>
                <p className="text-[10px] text-gray-500">Guru Mata Pelajaran</p>
              </div>
              <div>
                <div className="font-bold underline text-black">{peminjaman.user.nama_lengkap}</div>
                <div className="text-[10px] text-gray-600">NIP/ID: {peminjaman.user.username}</div>
              </div>
            </div>

            {/* Kolom 2: Petugas Sarpras */}
            <div className="flex flex-col justify-between h-32">
              <div>
                <p className="font-semibold text-gray-700">Petugas Sarana Prasarana,</p>
                <p className="text-[10px] text-gray-500">Toolman Bengkel</p>
              </div>
              <div>
                <div className="font-bold underline text-black">Petugas Sarpras SMKN 10</div>
                <div className="text-[10px] text-gray-600">NIP. ........................................</div>
              </div>
            </div>

            {/* Kolom 3: Mengetahui Kepala Bengkel */}
            <div className="flex flex-col justify-between h-32">
              <div>
                <p className="font-semibold text-gray-700">Menyetujui,</p>
                <p className="text-[10px] text-gray-500">Kepala Bengkel / Sarpras</p>
              </div>
              <div>
                <div className="font-bold underline text-black">Kepala Bengkel SMKN 10</div>
                <div className="text-[10px] text-gray-600">NIP. ........................................</div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification stamp placeholder for returns */}
        <div className="mt-8 pt-4 border-t border-dashed border-gray-300 text-[10px] text-gray-500 flex justify-between">
          <span>* Lembar 1: Arsip Sarpras | Lembar 2: Peminjam</span>
          <span>Sistem Informasi Inventaris SMKN 10 Makassar</span>
        </div>
      </div>
    </div>
  );
}
