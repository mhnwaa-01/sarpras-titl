"use client";

import { useEffect, useState } from "react";
import { QrCode, Printer, CheckSquare, Square, Filter } from "lucide-react";
import BarcodeLabel from "@/components/BarcodeLabel";

interface InventarisItem {
  id: string;
  jenis_aset: "SARANA" | "PRASARANA";
  kategori: string;
  nama_item: string;
  lokasi: string;
  jumlah: number;
  kondisi: "BAIK" | "RUSAK";
  barcode_id: string;
}

export default function AdminBarcodePrintPage() {
  const [items, setItems] = useState<InventarisItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterJenis, setFilterJenis] = useState<"ALL" | "SARANA" | "PRASARANA">("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inventaris")
      .then((res) => res.json())
      .then((data) => {
        const list = data.items || [];
        setItems(list);
        setSelectedIds(list.map((i: any) => i.id)); // select all by default
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter((i) => {
    if (filterJenis !== "ALL" && i.jenis_aset !== filterJenis) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    setSelectedIds(filteredItems.map((i) => i.id));
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  const handlePrint = () => {
    window.print();
  };

  const itemsToPrint = filteredItems.filter((i) => selectedIds.includes(i.id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar (Hidden on Print) */}
      <div className="no-print bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <QrCode className="w-6 h-6 text-blue-600" />
            Cetak Label Stiker Barcode & QR Code
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Format cetak label stiker inventaris fisik sesuai standar Permendikbudristek No. 22/2023.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            disabled={itemsToPrint.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            Cetak {itemsToPrint.length} Label Terpilih
          </button>
        </div>
      </div>

      {/* Control Selection Bar (Hidden on Print) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={selectAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition"
          >
            <CheckSquare className="w-3.5 h-3.5" /> Pilih Semua
          </button>
          <button
            onClick={deselectAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition"
          >
            <Square className="w-3.5 h-3.5" /> Batalkan Semua
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-semibold">Filter:</span>
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value as any)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white"
          >
            <option value="ALL">Semua Jenis Aset</option>
            <option value="SARANA">Hanya SARANA</option>
            <option value="PRASARANA">Hanya PRASARANA</option>
          </select>
        </div>
      </div>

      {/* Printable Grid of Labels */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 no-print">Memuat data label...</div>
      ) : itemsToPrint.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 no-print">
          Tidak ada label yang dipilih untuk dicetak.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4 print:p-0">
          {itemsToPrint.map((item) => (
            <div
              key={item.id}
              className="relative bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition print:border-none print:shadow-none print:p-0 print-avoid-break"
            >
              {/* Checkbox selector in web view (hidden on print) */}
              <div className="no-print absolute top-3 right-3 z-10">
                <button
                  onClick={() => toggleSelect(item.id)}
                  className="p-1 rounded text-slate-400 hover:text-blue-600 transition"
                >
                  {selectedIds.includes(item.id) ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Printable Label Component */}
              <BarcodeLabel item={item} showPrintButton={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
