"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Boxes,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Wrench,
  X,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { KATEGORI_SARANA_OPTIONS } from "@/lib/permendikbud";

interface SaranaItem {
  id: string;
  jenis_aset: "SARANA";
  kategori: string;
  nama_item: string;
  gambar_url?: string | null;
  lokasi: string;
  jumlah: number;
  kondisi: "BAIK" | "RUSAK";
  barcode_id: string;
}

export default function GuruCatalogPage() {
  const [items, setItems] = useState<SaranaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  // Modal Pinjam Form
  const [selectedItem, setSelectedItem] = useState<SaranaItem | null>(null);
  const [formJumlah, setFormJumlah] = useState(1);
  const [formTglPinjam, setFormTglPinjam] = useState("");
  const [formTglKembali, setFormTglKembali] = useState("");
  const [formKeperluan, setFormKeperluan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Set default dates: today & tomorrow
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    setFormTglPinjam(today);
    setFormTglKembali(tomorrow);

    fetch("/api/inventaris?jenis=SARANA")
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openLoanModal = (item: SaranaItem) => {
    setSelectedItem(item);
    setFormJumlah(1);
    setFormKeperluan("");
    setFormError(null);
    setSubmitSuccess(false);
  };

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setFormError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inventaris_id: selectedItem.id,
          jumlah_pinjam: formJumlah,
          tgl_pinjam: formTglPinjam,
          tgl_kembali: formTglKembali,
          keperluan: formKeperluan,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengajukan peminjaman.");
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== "ALL" && item.kategori !== selectedCategory) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      const matchName = item.nama_item.toLowerCase().includes(s);
      const matchBarcode = item.barcode_id.toLowerCase().includes(s);
      const matchLoc = item.lokasi.toLowerCase().includes(s);
      return matchName || matchBarcode || matchLoc;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            Katalog Peralatan Praktik Kejuruan
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-blue-600" />
            Katalog Sarana Pembelajaran
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mengacu pada Permendikbudristek No. 22 Tahun 2023 (Alat Pembelajaran, Bahan, & Perlengkapan).
          </p>
        </div>
        <Link
          href="/guru/peminjaman"
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow transition"
        >
          Lihat Riwayat Peminjaman Saya <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === "ALL"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Semua Sarana ({items.length})
            </button>
            {KATEGORI_SARANA_OPTIONS.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat} ({items.filter((i) => i.kategori === cat).length})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari alat atau kode barcode..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Item Cards Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          Memuat katalog sarana...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          Tidak ada sarana yang sesuai dengan filter atau pencarian Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isBaik = item.kondisi === "BAIK";
            const isAvailable = isBaik && item.jumlah > 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                    {item.gambar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.gambar_url}
                        alt={item.nama_item}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Wrench className="w-10 h-10 mb-1" />
                        <span className="text-[10px]">Foto Alat</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-600 text-white shadow-sm">
                      {item.kategori}
                    </span>
                    <span
                      className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                        isBaik ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                      }`}
                    >
                      {item.kondisi}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">{item.barcode_id}</div>
                      <h3 className="font-bold text-sm text-slate-900 mt-0.5 line-clamp-2">
                        {item.nama_item}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.lokasi}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Stok Tersedia:</span>
                      <span className="font-extrabold text-slate-900">{item.jumlah} unit</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => openLoanModal(item)}
                    disabled={!isAvailable}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Calendar className="w-4 h-4" />
                    {isAvailable ? "Ajukan Pinjam Alat" : isBaik ? "Stok Habis" : "Kondisi Rusak"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form Pengajuan Peminjaman */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                Formulir Peminjaman Sarana Praktik
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Permohonan Berhasil Dikirim!</h4>
                <p className="text-xs text-slate-500">
                  Permohonan berstatus <strong>PENDING</strong> dan menunggu persetujuan Kepala Bengkel. Setelah disetujui, Anda dapat mencetak <strong>Borang Peminjaman Resmi A4</strong>.
                </p>
                <div className="pt-2">
                  <Link
                    href="/guru/peminjaman"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
                  >
                    Buka Riwayat Peminjaman
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLoanSubmit} className="mt-4 space-y-4">
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
                    {formError}
                  </div>
                )}

                {/* Selected Item Info Box */}
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-slate-900">{selectedItem.nama_item}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{selectedItem.barcode_id} • Lokasi: {selectedItem.lokasi}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">Tersedia: {selectedItem.jumlah} unit</div>
                </div>

                {/* Form Fields */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Alat yang Dipinjam
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedItem.jumlah}
                    required
                    value={formJumlah}
                    onChange={(e) => setFormJumlah(parseInt(e.target.value) || 1)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Pinjam
                    </label>
                    <input
                      type="date"
                      required
                      value={formTglPinjam}
                      onChange={(e) => setFormTglPinjam(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Rencana Kembali
                    </label>
                    <input
                      type="date"
                      required
                      value={formTglKembali}
                      onChange={(e) => setFormTglKembali(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Keperluan Praktik / Mata Pelajaran / Kelas
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formKeperluan}
                    onChange={(e) => setFormKeperluan(e.target.value)}
                    placeholder="Contoh: Praktik Pemesinan Bubut Kelas XII TP 1 di Bengkel Mesin..."
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-800">
                  <ShieldAlert className="w-3.5 h-3.5 inline mr-1 text-blue-600" />
                  Peminjam wajib menjaga keutuhan dan mengembalikan alat sesuai jadwal untuk verifikasi ceklis toolman.
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow disabled:opacity-50"
                  >
                    {isSubmitting ? "Mengajukan..." : "Kirim Permohonan Pinjam"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
