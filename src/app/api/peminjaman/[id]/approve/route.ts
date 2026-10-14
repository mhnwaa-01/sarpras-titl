import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(["ADMIN"]);
    const id = params.id;
    const { status_pinjam, catatan } = await req.json();

    if (status_pinjam !== "APPROVED" && status_pinjam !== "REJECTED") {
      return NextResponse.json(
        { error: "Status pinjam harus 'APPROVED' atau 'REJECTED'." },
        { status: 400 }
      );
    }

    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id },
      include: { inventaris: true },
    });

    if (!peminjaman) {
      return NextResponse.json({ error: "Data peminjaman tidak ditemukan." }, { status: 404 });
    }

    if (peminjaman.status_pinjam !== "PENDING") {
      return NextResponse.json(
        { error: `Peminjaman ini sudah berstatus ${peminjaman.status_pinjam} sebelumnya.` },
        { status: 400 }
      );
    }

    // If approving, verify stock and deduct stock
    if (status_pinjam === "APPROVED") {
      if (peminjaman.inventaris.jumlah < peminjaman.jumlah_pinjam) {
        return NextResponse.json(
          { error: `Stok inventaris tidak mencukupi (Tersisa: ${peminjaman.inventaris.jumlah}, Diminta: ${peminjaman.jumlah_pinjam}).` },
          { status: 400 }
        );
      }

      // Transaction: update loan status and deduct inventory stock
      const result = await prisma.$transaction([
        prisma.peminjaman.update({
          where: { id },
          data: {
            status_pinjam: "APPROVED",
            catatan: catatan || peminjaman.catatan,
          },
        }),
        prisma.inventaris.update({
          where: { id: peminjaman.inventaris_id },
          data: {
            jumlah: {
              decrement: peminjaman.jumlah_pinjam,
            },
          },
        }),
      ]);

      return NextResponse.json({
        message: "Permohonan peminjaman berhasil DISETUJUI (APPROVED). Stok alat telah disesuaikan.",
        peminjaman: result[0],
      });
    }

    // If REJECTED
    const updated = await prisma.peminjaman.update({
      where: { id },
      data: {
        status_pinjam: "REJECTED",
        catatan: catatan || "Ditolak oleh Kepala Bengkel / Admin.",
      },
    });

    return NextResponse.json({
      message: "Permohonan peminjaman DITOLAK (REJECTED).",
      peminjaman: updated,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak. Khusus Admin." }, { status: 403 });
    }
    console.error("POST /api/peminjaman/[id]/approve error:", error);
    return NextResponse.json({ error: "Gagal memproses persetujuan peminjaman." }, { status: 500 });
  }
}
