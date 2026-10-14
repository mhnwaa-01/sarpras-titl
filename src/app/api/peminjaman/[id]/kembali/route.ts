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
    const body = await req.json();

    const { ceklis_kondisi_kembali, kondisi_akhir, catatan } = body;

    if (!ceklis_kondisi_kembali) {
      return NextResponse.json(
        { error: "Ceklis kondisi fisik pengembalian wajib diisi oleh Admin/Petugas." },
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

    if (peminjaman.status_pinjam !== "APPROVED") {
      return NextResponse.json(
        { error: "Peminjaman yang belum disetujui tidak dapat diproses pengembaliannya." },
        { status: 400 }
      );
    }

    if (peminjaman.status_kembali === "DIKEMBALIKAN") {
      return NextResponse.json(
        { error: "Alat ini sudah tercatat DIKEMBALIKAN sebelumnya." },
        { status: 400 }
      );
    }

    // Transaction: mark loan returned and restore inventory stock
    const result = await prisma.$transaction([
      prisma.peminjaman.update({
        where: { id },
        data: {
          status_kembali: "DIKEMBALIKAN",
          ceklis_kondisi_kembali,
          catatan: catatan ? `${peminjaman.catatan || ""}\n[Pengembalian]: ${catatan}`.trim() : peminjaman.catatan,
        },
      }),
      prisma.inventaris.update({
        where: { id: peminjaman.inventaris_id },
        data: {
          jumlah: {
            increment: peminjaman.jumlah_pinjam,
          },
          ...(kondisi_akhir && (kondisi_akhir === "BAIK" || kondisi_akhir === "RUSAK")
            ? { kondisi: kondisi_akhir }
            : {}),
        },
      }),
    ]);

    return NextResponse.json({
      message: "Verifikasi pengembalian berhasil. Status diubah menjadi DIKEMBALIKAN dan stok otomatis bertambah.",
      peminjaman: result[0],
      inventaris: result[1],
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak. Khusus Admin." }, { status: 403 });
    }
    console.error("POST /api/peminjaman/[id]/kembali error:", error);
    return NextResponse.json({ error: "Gagal memproses pengembalian." }, { status: 500 });
  }
}
