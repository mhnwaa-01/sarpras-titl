"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Printer, MapPin, Tag, Box } from "lucide-react";

interface BarcodeLabelProps {
  item: {
    id: string;
    nama_item: string;
    barcode_id: string;
    jenis_aset: "SARANA" | "PRASARANA";
    kategori: string;
    lokasi: string;
    jumlah: number;
    kondisi: "BAIK" | "RUSAK";
  };
  showPrintButton?: boolean;
}

export default function BarcodeLabel({ item, showPrintButton = true }: BarcodeLabelProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    // Generate QR Code data URL linking to public scan page
    const publicUrl = typeof window !== "undefined"
      ? `${window.location.origin}/scan/${item.barcode_id}`
      : `/scan/${item.barcode_id}`;

    QRCode.toDataURL(publicUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Error generating QR code", err));
  }, [item.barcode_id]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      {showPrintButton && (
        <button
          onClick={handlePrint}
          className="mb-4 no-print flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition"
        >
          <Printer className="w-4 h-4" />
          Cetak Label Stiker (A4 / Thermal)
        </button>
      )}

      {/* Label Stiker Fisik */}
      <div className="w-[360px] border-2 border-slate-900 bg-white p-3 rounded-lg text-slate-900 shadow-sm print:shadow-none print:border-black print:w-full print:max-w-[400px]">
        {/* Header Label */}
        <div className="text-center border-b-2 border-slate-900 pb-2 mb-2">
          <div className="font-extrabold text-xs tracking-wider uppercase text-slate-900">
            SMK NEGERI 10 MAKASSAR
          </div>
          <div className="text-[10px] font-semibold text-slate-700">
            LABEL INVENTARIS SARANA & PRASARANA
          </div>
          <div className="text-[8px] font-mono text-slate-500">
            Permendikbudristek No. 22 Tahun 2023
          </div>
        </div>

        {/* Content Body */}
        <div className="flex items-center gap-3">
          {/* QR Code Container */}
          <div className="shrink-0 flex flex-col items-center justify-center p-1 bg-white border border-slate-300 rounded">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt={`QR Code ${item.barcode_id}`} className="w-24 h-24 object-contain" />
            ) : (
              <div className="w-24 h-24 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                Loading QR...
              </div>
            )}
            <span className="text-[8px] font-bold text-slate-600 uppercase mt-0.5 tracking-tighter">
              Scan untuk info
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 text-[11px] leading-tight space-y-1">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500">Nama Aset:</span>
              <div className="font-bold text-slate-900 text-xs truncate" title={item.nama_item}>
                {item.nama_item}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="px-1.5 py-0.5 rounded font-bold uppercase text-[9px] bg-slate-100 border border-slate-300">
                {item.jenis_aset}
              </span>
              <span className="text-slate-600 truncate">{item.kategori}</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-slate-700">
              <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="truncate">{item.lokasi}</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-dashed border-slate-300 text-[10px]">
              <span>Kondisi: <strong className="uppercase">{item.kondisi}</strong></span>
              <span>Jml: <strong>{item.jumlah}</strong></span>
            </div>
          </div>
        </div>

        {/* Barcode Number Footer */}
        <div className="mt-2 pt-1 border-t border-slate-900 text-center">
          <div className="font-mono font-bold text-xs tracking-widest text-slate-900">
            {item.barcode_id}
          </div>
        </div>
      </div>
    </div>
  );
}
