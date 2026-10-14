"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QrCode, Search, Camera, ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

export default function PublicScanPage() {
  const router = useRouter();
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    router.push(`/scan/${encodeURIComponent(barcodeInput.trim())}`);
  };

  const sampleBarcodes = [
    { id: "SMK10-SAR-2026-001", name: "Mesin Bubut CNC Lathe 2-Axis", type: "SARANA - Alat Pembelajaran" },
    { id: "SMK10-SAR-2026-002", name: "Digital Multimeter Sanwa CD800a", type: "SARANA - Alat Pembelajaran" },
    { id: "SMK10-PRA-2026-001", name: "Bengkel Pemesinan & Fabrikasi", type: "PRASARANA - Ruang Praktik" },
    { id: "SMK10-PRA-2026-002", name: "Lab Komputer Jaringan & RPL", type: "PRASARANA - Ruang Praktik" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20 mb-4">
            <QrCode className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Scanner QR & Barcode Publik
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Arahkan kamera ke label stiker fisik pada peralatan atau pintu ruangan di lingkungan SMKN 10 Makassar.
          </p>
        </div>

        {/* Input Barcode Manual */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Masukkan Kode Barcode ID
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Contoh: SMK10-SAR-2026-001"
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow transition"
            >
              <Search className="w-4 h-4" />
              Cek Detail Item
            </button>
          </form>

          {/* Camera Scanner Simulation */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button
              onClick={() => setIsScanning(!isScanning)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              {isScanning ? "Tutup Pemindai Kamera" : "Aktifkan Kamera Pemindai"}
            </button>

            {isScanning && (
              <div className="mt-4 p-4 bg-slate-900 rounded-xl text-white relative overflow-hidden">
                <div className="w-full h-48 border-2 border-dashed border-emerald-400 rounded-lg flex flex-col items-center justify-center relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 animate-pulse" />
                  <Camera className="w-10 h-10 text-slate-500 mb-2 animate-bounce" />
                  <span className="text-xs text-slate-300">Menghubungkan ke sensor kamera perangkat...</span>
                  <span className="text-[10px] text-slate-400 mt-1">Arahkan barcode/QR ke dalam kotak fokus</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Sample Link Card */}
        <div className="bg-slate-100 rounded-xl p-5 border border-slate-200">
          <div className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Contoh Aset Terdaftar di SMKN 10 (Klik untuk melihat info):
          </div>
          <div className="space-y-2">
            {sampleBarcodes.map((sample) => (
              <Link
                key={sample.id}
                href={`/scan/${sample.id}`}
                className="flex items-center justify-between p-3 bg-white hover:bg-emerald-50 rounded-lg border border-slate-200 hover:border-emerald-300 transition group"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">
                    {sample.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {sample.id} • {sample.type}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
