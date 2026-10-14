"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  QrCode,
  LogOut,
  ExternalLink,
  ShieldAlert,
  GraduationCap
} from "lucide-react";

export default function AdminSidebar({ user }: { user?: { nama_lengkap: string; username: string } }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      name: "Sarana & Prasarana",
      href: "/admin/inventaris",
      icon: Boxes,
      active: pathname.startsWith("/admin/inventaris"),
    },
    {
      name: "Peminjaman & Kembali",
      href: "/admin/peminjaman",
      icon: ClipboardList,
      active: pathname.startsWith("/admin/peminjaman"),
    },
    {
      name: "Cetak Barcode & QR",
      href: "/admin/barcode",
      icon: QrCode,
      active: pathname.startsWith("/admin/barcode"),
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col justify-between shrink-0 min-h-screen no-print">
      <div>
        {/* Brand / Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20">
              10
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-white leading-tight">SMKN 10 MAKASSAR</h1>
              <p className="text-[11px] text-blue-400 font-semibold tracking-wider uppercase">Panel Sarpras & Bengkel</p>
            </div>
          </div>
          <div className="mt-3 px-2.5 py-1.5 bg-slate-800/80 rounded-md border border-slate-700/60 flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[10px] text-slate-300 font-medium">Permendikbudristek No. 22/2023</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Menu Utama
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                  item.active
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${item.active ? "text-white" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Akses Cepat
          </div>
          <Link
            href="/guru"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Lihat Katalog Guru
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            href="/scan"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="flex items-center gap-3">
              <QrCode className="w-4 h-4 text-cyan-400" />
              Scanner Publik
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </nav>
      </div>

      {/* User profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-white truncate">
              {user?.nama_lengkap || "Kepala Bengkel"}
            </div>
            <div className="text-[10px] text-slate-400">@{user?.username || "admin"}</div>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-900/60 text-blue-300 rounded border border-blue-700/50">
            ADMIN
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/60 rounded-lg text-xs font-medium transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar Sistem
        </button>
      </div>
    </aside>
  );
}
