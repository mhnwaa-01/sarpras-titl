import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { barcode_id: string } }
) {
  try {
    const barcode_id = decodeURIComponent(params.barcode_id);

    const item = await prisma.inventaris.findUnique({
      where: { barcode_id },
      include: {
        peminjaman: {
          where: {
            status_pinjam: "APPROVED",
            status_kembali: "BELUM",
          },
          select: {
            id: true,
            tgl_pinjam: true,
            tgl_kembali: true,
            keperluan: true,
            jumlah_pinjam: true,
            user: {
              select: {
                nama_lengkap: true,
              },
            },
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: `Item atau ruangan dengan Barcode ID '${barcode_id}' tidak ditemukan di sistem.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      item,
      isCurrentlyBorrowed: item.peminjaman.length > 0,
      activeLoansCount: item.peminjaman.length,
    });
  } catch (error: any) {
    console.error("GET /api/scan/[barcode_id] error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data aset." },
      { status: 500 }
    );
  }
}
