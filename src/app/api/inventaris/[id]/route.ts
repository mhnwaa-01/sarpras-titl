import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(["ADMIN"]);
    const id = params.id;
    const body = await req.json();

    const {
      jenis_aset,
      kategori,
      nama_item,
      gambar_url,
      lokasi,
      jumlah,
      kondisi,
      barcode_id,
    } = body;

    const existing = await prisma.inventaris.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Data inventaris tidak ditemukan." }, { status: 404 });
    }

    if (barcode_id && barcode_id !== existing.barcode_id) {
      const barcodeExists = await prisma.inventaris.findUnique({
        where: { barcode_id },
      });
      if (barcodeExists) {
        return NextResponse.json(
          { error: `Barcode ID '${barcode_id}' sudah digunakan item lain.` },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.inventaris.update({
      where: { id },
      data: {
        ...(jenis_aset && { jenis_aset }),
        ...(kategori && { kategori }),
        ...(nama_item && { nama_item }),
        gambar_url: gambar_url !== undefined ? gambar_url : existing.gambar_url,
        ...(lokasi && { lokasi }),
        ...(jumlah !== undefined && { jumlah: parseInt(jumlah) }),
        ...(kondisi && { kondisi }),
        ...(barcode_id && { barcode_id }),
      },
    });

    return NextResponse.json({
      message: "Data inventaris berhasil diperbarui.",
      item: updated,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }
    console.error("PUT /api/inventaris/[id] error:", error);
    return NextResponse.json({ error: "Gagal memperbarui inventaris." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(["ADMIN"]);
    const id = params.id;

    await prisma.inventaris.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Data inventaris berhasil dihapus." });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }
    console.error("DELETE /api/inventaris/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus inventaris." }, { status: 500 });
  }
}
