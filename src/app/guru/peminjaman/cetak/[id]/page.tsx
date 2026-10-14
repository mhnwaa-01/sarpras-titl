import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import BorangPrint from "@/components/BorangPrint";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface PageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export default async function CetakBorangPage({ params }: PageProps) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const peminjaman = await prisma.peminjaman.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          nama_lengkap: true,
          username: true,
        },
      },
      inventaris: true,
    },
  });

  if (!peminjaman) {
    notFound();
  }

  // Security check: Only allow the loan owner or admin to view
  if (user.role === "GURU" && peminjaman.user_id !== user.id) {
    redirect("/guru/peminjaman");
  }

  // Strictly enforce specification: Only APPROVED loans can generate Borang
  if (peminjaman.status_pinjam !== "APPROVED") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            Borang Belum Dapat Dicetak
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Berdasarkan SOP SMKN 10 Makassar, Borang Peminjaman hanya dapat dicetak setelah permohonan disetujui (Status: <strong>APPROVED</strong>) oleh Kepala Bengkel. Status saat ini: <strong>{peminjaman.status_pinjam}</strong>.
          </p>
          <Link
            href="/guru/peminjaman"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Riwayat
          </Link>
        </div>
      </div>
    );
  }

  return <BorangPrint peminjaman={peminjaman} />;
}
