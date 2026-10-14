import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Sistem Informasi Inventaris & Peminjaman Alat - SMKN 10 Makassar",
  description:
    "Aplikasi Inventaris Sarana dan Prasarana Berdasarkan Permendikbudristek No. 22 Tahun 2023 di SMKN 10 Makassar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 min-h-screen flex flex-col font-sans antialiased text-slate-800">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-center text-xs no-print">
          <div className="max-w-7xl mx-auto px-4">
            <p className="font-semibold text-slate-300">
              SMK Negeri 10 Makassar — Sistem Informasi Inventaris & Peminjaman Alat
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Berpedoman pada Permendikbudristek No. 22 Tahun 2023 tentang Standar Sarana dan Prasarana Pendidikan.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
