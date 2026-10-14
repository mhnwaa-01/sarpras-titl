import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { Boxes, ClipboardList, User, LogOut } from "lucide-react";

export default async function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Guru Subnav Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              GP
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {user.nama_lengkap}
              </div>
              <div className="text-[10px] text-slate-500">
                Portal Guru Peminjam • SMKN 10 Makassar
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/guru"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
            >
              <Boxes className="w-4 h-4 text-blue-600" />
              Katalog Sarana
            </Link>

            <Link
              href="/guru/peminjaman"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
            >
              <ClipboardList className="w-4 h-4 text-blue-600" />
              Riwayat Peminjaman Saya
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
