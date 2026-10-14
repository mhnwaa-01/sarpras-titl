import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { generateBarcodeId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jenis = searchParams.get("jenis"); // "SARANA" | "PRASARANA"
    const kategori = searchParams.get("kategori");
    const kondisi = searchParams.get("kondisi"); // "BAIK" | "RUSAK"
    const search = searchParams.get("search");

    const where: any = {};

    if (jenis === "SARANA" || jenis === "PRASARANA") {
      where.jenis_aset = jenis;
    }

    if (kategori) {
      where.kategori = kategori;
    }

    if (kondisi === "BAIK" || kondisi === "RUSAK") {
      where.kondisi = kondisi;
    }

    if (search) {
      where.OR = [
        { nama_item: { contains: search, mode: "insensitive" } },
        { barcode_id: { contains: search, mode: "insensitive" } },
        { lokasi: { contains: search, mode: "insensitive" } },
      ];
    }

    const items = await prisma.inventaris.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("GET /api/inventaris error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data inventaris." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Only Admin / Kepala Bengkel can create inventory
    await requireAuth(["ADMIN"]);

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

    if (!jenis_aset || !kategori || !nama_item || !lokasi) {
      return NextResponse.json(
        { error: "Field jenis_aset, kategori, nama_item, dan lokasi wajib diisi." },
        { status: 400 }
      );
    }

    const finalBarcodeId = barcode_id?.trim() || generateBarcodeId(jenis_aset);

    // Check barcode collision
    const existing = await prisma.inventaris.findUnique({
      where: { barcode_id: finalBarcodeId },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Barcode ID '${finalBarcodeId}' sudah terdaftar.` },
        { status: 400 }
      );
    }

    const newItem = await prisma.inventaris.create({
      data: {
        jenis_aset,
        kategori,
        nama_item,
        gambar_url: gambar_url || null,
        lokasi,
        jumlah: parseInt(jumlah) || 1,
        kondisi: kondisi || "BAIK",
        barcode_id: finalBarcodeId,
      },
    });

    return NextResponse.json({
      message: "Data inventaris berhasil ditambahkan.",
      item: newItem,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses ditolak. Khusus Admin/Kepala Bengkel." }, { status: 403 });
    }
    console.error("POST /api/inventaris error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data inventaris." },
      { status: 500 }
    );
  }
}
