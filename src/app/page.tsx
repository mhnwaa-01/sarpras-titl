import Link from "next/link";
import {
  Boxes,
  QrCode,
  LogIn,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Building2,
  Wrench,
  Sparkles
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/50 border border-blue-700/60 text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Sesuai Permendikbudristek No. 22 Tahun 2023</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Sistem Informasi Inventaris & Peminjaman Alat{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              SMKN 10 Makassar
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Platform digital terintegrasi untuk pendataan sarana pembelajaran, prasarana ruang praktik kejuruan,
            pengelolaan peminjaman alat berbasis QR/Barcode, dan cetak borang peminjaman resmi.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/guru"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              <Boxes className="w-4 h-4" />
              Katalog Sarana (Alat & Bahan)
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/scan"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition transform hover:-translate-y-0.5"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              Scan QR / Barcode Fisik
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/80 transition transform hover:-translate-y-0.5"
            >
              <LogIn className="w-4 h-4 text-blue-400" />
              Masuk / Login Petugas & Guru
            </Link>
          </div>
        </div>
      </section>

      {/* Permendikbudristek No. 22 Tahun 2023 Standar Classification Info */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 w-full mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Sarana */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  Klasifikasi Aset 1
                </span>
                <h3 className="text-xl font-bold text-slate-900">Sarana Pembelajaran</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Merupakan perlengkapan pembelajaran yang dapat dipindah-pindahkan untuk mendukung proses belajar mengajar
              kejuruan.
            </p>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Bahan Pembelajaran:</strong> Bahan habis pakai dan material praktik (kabel, elektroda, plat, komponen).
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Alat Pembelajaran:</strong> Mesin bubut, trainer otomotif, multimeter, oscilloskop, PC workstation, tool set.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Perlengkapan:</strong> Meja kerja bengkel (workbench), lemari alat, rak display, safety gear/APD, papan tulis.
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                href="/guru"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
              >
                Jelajahi Sarana Tersedia <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card Prasarana */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                  Klasifikasi Aset 2
                </span>
                <h3 className="text-xl font-bold text-slate-900">Prasarana Sekolah</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Merupakan fasilitas dasar yang diperlukan untuk menjalankan fungsi satuan pendidikan kejuruan secara optimal.
            </p>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Ruang Praktik & Bengkel:</strong> Bengkel Pemesinan, Bengkel Otomotif/TKR/TBSM, Lab Komputer TKJ/RPL, Bengkel Listrik.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Ruang Kelas & Laboratorium:</strong> Ruang teori kejuruan, Lab Sains IPA, Lab Multimedia, Lab Bahasa.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Lahan, Bangunan & Administrasi:</strong> Gedung bengkel, ruang kepala bengkel, ruang guru, ruang tata usaha, dan gudang alat.
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                href="/scan"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
              >
                Scan Barcode Ruangan Fisik <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Step Explanation */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Alur Kerja Peminjaman & Pengembalian</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standar Operasional Prosedur (SOP) Sarana Praktik di SMKN 10 Makassar
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center relative">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-3 text-sm">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Guru Mengajukan</h4>
            <p className="text-xs text-slate-500">
              Guru memilih alat di katalog sarana, mengisi jumlah & keperluan praktik. Status tersimpan sebagai <strong>PENDING</strong>.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center relative">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-3 text-sm">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Verifikasi Admin</h4>
            <p className="text-xs text-slate-500">
              Kepala Bengkel/Admin meninjau permohonan, menyetujui (<strong>APPROVE</strong>), dan stok otomatis berkurang.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center relative">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-3 text-sm">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Cetak Borang A4</h4>
            <p className="text-xs text-slate-500">
              Guru mencetak dokumen resmi <strong>Borang Peminjaman</strong> berformat A4 rapi lengkap dengan tanda tangan.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center relative">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-3 text-sm">
              4
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Ceklis Pengembalian</h4>
            <p className="text-xs text-slate-500">
              Admin mengecek fisik alat, mengisi form ceklis kondisi, menandai <strong>DIKEMBALIKAN</strong>, & stok pulih otomatis.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
