"use client";

import { useEffect, useState } from "react";
import {
  Boxes,
  PlusCircle,
  Search,
  Filter,
  QrCode,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Printer,
  Sparkles,
  Building2,
  Wrench
} from "lucide-react";
import BarcodeLabel from "@/components/BarcodeLabel";
import {
  KATEGORI_SARANA_OPTIONS,
  KATEGORI_PRASARANA_OPTIONS,
} from "@/lib/permendikbud";
import { generateBarcodeId } from "@/lib/utils";

interface InventarisItem {
  id: string;
  jenis_aset: "SARANA" | "PRASARANA";
  kategori: string;
  nama_item: string;
  gambar_url?: string | null;
  lokasi: string;
  jumlah: number;
  kondisi: "BAIK" | "RUSAK";
  barcode_id: string;
  createdAt: string;
}

export default function AdminInventarisPage() {
  const [items, setItems] = useState<InventarisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabJenis, setTabJenis] = useState<"ALL" | "SARANA" | "PRASARANA">("ALL");
  const [filterKondisi, setFilterKondisi] = useState<"ALL" | "BAIK" | "RUSAK">("ALL");
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventarisItem | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    jenis_aset: "SARANA" as "SARANA" | "PRASARANA",
    kategori: KATEGORI_SARANA_OPTIONS[0],
    nama_item: "",
    gambar_url: "",
    lokasi: "",
    jumlah: 1,
    kondisi: "BAIK" as "BAIK" | "RUSAK",
    barcode_id: "",
  });

  // Print Label Modal State
  const [labelItem, setLabelItem] = useState<InventarisItem | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/inventaris");
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      jenis_aset: "SARANA",
      kategori: KATEGORI_SARANA_OPTIONS[1], // Alat Pembelajaran
      nama_item: "",
      gambar_url: "",
      lokasi: "",
      jumlah: 1,
      kondisi: "BAIK",
      barcode_id: generateBarcodeId("SARANA"),
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventarisItem) => {
    setEditingItem(item);
    setFormData({
      jenis_aset: item.jenis_aset,
      kategori: item.kategori,
      nama_item: item.nama_item,
      gambar_url: item.gambar_url || "",
      lokasi: item.lokasi,
      jumlah: item.jumlah,
      kondisi: item.kondisi,
      barcode_id: item.barcode_id,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleJenisChange = (jenis: "SARANA" | "PRASARANA") => {
    setFormData((prev) => ({
      ...prev,
      jenis_aset: jenis,
      kategori: jenis === "SARANA" ? KATEGORI_SARANA_OPTIONS[0] : KATEGORI_PRASARANA_OPTIONS[0],
      barcode_id: !editingItem ? generateBarcodeId(jenis) : prev.barcode_id,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);

    try {
      const url = editingItem ? `/api/inventaris/${editingItem.id}` : "/api/inventaris";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan data.");
      }

      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (item: InventarisItem) => {
    if (!confirm(`Hapus inventaris '${item.nama_item}' (${item.barcode_id})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/inventaris/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        fetchItems();
      } else {
        alert("Gagal menghapus item.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Items
  const filteredItems = items.filter((item) => {
    if (tabJenis !== "ALL" && item.jenis_aset !== tabJenis) return false;
    if (filterKondisi !== "ALL" && item.kondisi !== filterKondisi) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      const matchName = item.nama_item.toLowerCase().includes(s);
      const matchBarcode = item.barcode_id.toLowerCase().includes(s);
      const matchLoc = item.lokasi.toLowerCase().includes(s);
      const matchCat = item.kategori.toLowerCase().includes(s);
      return matchName || matchBarcode || matchLoc || matchCat;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-blue-600" />
            Manajemen Sarana & Prasarana
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Klasifikasi terintegrasi berdasarkan Permendikbudristek No. 22 Tahun 2023.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow transition"
        >
          <PlusCircle className="w-4 h-4" />
          Tambah Aset Baru
        </button>
      </div>

      {/* Tabs and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Classification Tabs (Permendikbud) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setTabJenis("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                tabJenis === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua Aset ({items.length})
            </button>
            <button
              onClick={() => setTabJenis("SARANA")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                tabJenis === "SARANA" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-blue-600"
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Sarana ({items.filter((i) => i.jenis_aset === "SARANA").length})
            </button>
            <button
              onClick={() => setTabJenis("PRASARANA")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                tabJenis === "PRASARANA" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Prasarana ({items.filter((i) => i.jenis_aset === "PRASARANA").length})
            </button>
          </div>

          {/* Condition Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Kondisi:
            </span>
            <select
              value={filterKondisi}
              onChange={(e) => setFilterKondisi(e.target.value as any)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">Semua Kondisi</option>
              <option value="BAIK">BAIK</option>
              <option value="RUSAK">RUSAK</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama aset, kode barcode, kategori, atau lokasi..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat data inventaris...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Tidak ada data inventaris yang sesuai dengan filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Kode Barcode</th>
                  <th className="p-3.5">Nama Aset / Ruangan</th>
                  <th className="p-3.5">Klasifikasi Permendikbud</th>
                  <th className="p-3.5">Lokasi</th>
                  <th className="p-3.5 text-center">Jumlah</th>
                  <th className="p-3.5 text-center">Kondisi</th>
                  <th className="p-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const isSarana = item.jenis_aset === "SARANA";
                  const isBaik = item.kondisi === "BAIK";

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{item.barcode_id}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{item.nama_item}</div>
                        {item.gambar_url && (
                          <span className="text-[10px] text-blue-500 italic">Ada foto fisik</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              isSarana
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {item.jenis_aset}
                          </span>
                          <span className="text-slate-600">{item.kategori}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-700">{item.lokasi}</td>
                      <td className="p-3.5 text-center font-bold text-slate-800">{item.jumlah} unit</td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isBaik
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {isBaik ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {item.kondisi}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setLabelItem(item)}
                            title="Cetak Barcode / QR Label"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded transition"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            title="Edit Data"
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            title="Hapus"
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingItem ? "Edit Data Inventaris" : "Tambah Inventaris Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Jenis Aset Selector (Permendikbud No. 22/2023) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Klasifikasi Aset (Permendikbud No. 22/2023)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleJenisChange("SARANA")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      formData.jenis_aset === "SARANA"
                        ? "bg-blue-600 text-white border-blue-600 shadow"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    SARANA (Alat / Bahan)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleJenisChange("PRASARANA")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      formData.jenis_aset === "PRASARANA"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    PRASARANA (Ruang / Lahan)
                  </button>
                </div>
              </div>

              {/* Kategori Permendikbud Options */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Standar
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {(formData.jenis_aset === "SARANA"
                    ? KATEGORI_SARANA_OPTIONS
                    : KATEGORI_PRASARANA_OPTIONS
                  ).map((kat) => (
                    <option key={kat} value={kat}>
                      {kat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nama Item */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Item / Ruangan
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama_item}
                  onChange={(e) => setFormData({ ...formData, nama_item: e.target.value })}
                  placeholder="Contoh: Mesin Bubut CNC, atau Bengkel Mesin 1"
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Barcode ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode Barcode ID (Unique)
                </label>
                <input
                  type="text"
                  required
                  value={formData.barcode_id}
                  onChange={(e) => setFormData({ ...formData, barcode_id: e.target.value })}
                  className="w-full text-xs font-mono border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Lokasi & Jumlah */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lokasi Penempatan
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    placeholder="Contoh: Bengkel Mesin Lt. 1"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah / Kapasitas
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.jumlah}
                    onChange={(e) => setFormData({ ...formData, jumlah: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Kondisi Fisik */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kondisi Fisik Saat Ini
                </label>
                <select
                  value={formData.kondisi}
                  onChange={(e) => setFormData({ ...formData, kondisi: e.target.value as any })}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BAIK">BAIK (Siap Pakai)</option>
                  <option value="RUSAK">RUSAK (Perlu Perbaikan / Rusak Berat)</option>
                </select>
              </div>

              {/* URL Foto */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Foto Barang / Ruangan (Opsional)
                </label>
                <input
                  type="url"
                  value={formData.gambar_url}
                  onChange={(e) => setFormData({ ...formData, gambar_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow disabled:opacity-50"
                >
                  {formSubmitting ? "Menyimpan..." : "Simpan Inventaris"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Print Single Label */}
      {labelItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 relative">
            <button
              onClick={() => setLabelItem(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg no-print"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-base text-slate-900 mb-4 no-print">
              Preview Cetak Stiker Barcode
            </h3>
            <BarcodeLabel item={labelItem} />
          </div>
        </div>
      )}
    </div>
  );
}
