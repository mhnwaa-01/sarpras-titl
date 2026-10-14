"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QrCode, LogIn, LogOut, Package, User, Wrench, Menu, X, ShieldCheck } from "lucide-react";

interface UserSession {
  id: string;
  username: string;
  role: "ADMIN" | "GURU";
  nama_lengkap: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  // If inside admin dashboard, the admin layout has its own sidebar
  const isAdminPath = pathname.startsWith("/admin");
  if (isAdminPath) return null;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md group-hover:bg-blue-500 transition">
              10
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base leading-tight tracking-wide text-white group-hover:text-blue-400 transition">
                SMKN 10 MAKASSAR
              </div>
              <div className="text-[11px] text-slate-400 font-medium leading-none">
                Sistem Inventaris Sarpras & Peminjaman
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition ${
                pathname === "/" ? "text-blue-400" : "text-slate-300 hover:text-white"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/guru"
              className={`text-sm font-medium flex items-center gap-1.5 transition ${
                pathname.startsWith("/guru") ? "text-blue-400" : "text-slate-300 hover:text-white"
              }`}
            >
              <Package className="w-4 h-4" />
              Katalog Sarana
            </Link>
            <Link
              href="/scan"
              className={`text-sm font-medium flex items-center gap-1.5 transition ${
                pathname.startsWith("/scan") ? "text-blue-400" : "text-slate-300 hover:text-white"
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              Scan QR / Barcode
            </Link>
          </nav>

          {/* User / Auth Action */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-white leading-tight">{user.nama_lengkap}</div>
                  <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                    {user.role === "ADMIN" ? "Kepala Bengkel / Admin" : "Guru Peminjam"}
                  </div>
                </div>
                {user.role === "ADMIN" ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold shadow transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Dashboard Admin
                  </Link>
                ) : (
                  <Link
                    href="/guru/peminjaman"
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-medium border border-slate-700 transition"
                  >
                    <Wrench className="w-3.5 h-3.5 text-blue-400" />
                    Peminjaman Saya
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
              >
                <LogIn className="w-4 h-4" />
                Masuk / Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-b border-slate-700 px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-700"
          >
            Beranda
          </Link>
          <Link
            href="/guru"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-700"
          >
            Katalog Sarana (Alat & Perlengkapan)
          </Link>
          <Link
            href="/scan"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-700"
          >
            Scan QR / Barcode Fisik
          </Link>
          {user ? (
            <div className="pt-2 border-t border-slate-700 space-y-2">
              <div className="px-3 text-xs text-slate-400">
                Login sebagai: <strong className="text-white">{user.nama_lengkap}</strong> ({user.role})
              </div>
              {user.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white"
                >
                  Masuk Dashboard Admin
                </Link>
              ) : (
                <Link
                  href="/guru/peminjaman"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white"
                >
                  Riwayat Peminjaman Saya
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-rose-400 hover:bg-slate-700"
              >
                Logout / Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center mt-2 px-3 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white"
            >
              Masuk / Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
