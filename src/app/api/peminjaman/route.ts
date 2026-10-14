import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(["ADMIN", "GURU"]);
    const { searchParams } = new URL(req.url);
    const status_pinjam = searchParams.get("status_pinjam");
    const status_kembali = searchParams.get("status_kembali");

    const where: any = {};

    // Guru only sees their own loans
    if (user.role === "GURU") {
      where.user_id = user.id;
    }

    if (status_pinjam) {
      where.status_pinjam = status_pinjam;
    }

    if (status_kembali) {
      where.status_kembali = status_kembali;
    }

    const peminjaman = await prisma.peminjaman.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            nama_lengkap: true,
            username: true,
            role: true,
          },
        },
        inventaris: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ peminjaman });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }
    console.error("GET /api/peminjaman error:", error);
    return NextResponse.json({ error: "Gagal mengambil data peminjaman." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(["GURU", "ADMIN"]);
    const body = await req.json();

    const { inventaris_id, jumlah_pinjam, tgl_pinjam, tgl_kembali, keperluan } = body;

    if (!inventaris_id || !tgl_pinjam || !tgl_kembali || !keperluan) {
      return NextResponse.json(
        { error: "Semua form peminjaman wajib diisi." },
        { status: 400 }
      );
    }

    // Verify item exists
    const inventaris = await prisma.inventaris.findUnique({
      where: { id: inventaris_id },
    });

    if (!inventaris) {
      return NextResponse.json({ error: "Item inventaris tidak ditemukan." }, { status: 404 });
    }

    if (inventaris.jenis_aset !== "SARANA") {
      return NextResponse.json(
        { error: "Peminjaman alat/sarana hanya berlaku untuk aset jenis SARANA (Alat/Bahan/Perlengkapan)." },
        { status: 400 }
      );
    }

    if (inventaris.kondisi !== "BAIK") {
      return NextResponse.json(
        { error: "Alat ini dalam kondisi RUSAK dan tidak dapat dipinjam." },
        { status: 400 }
      );
    }

    const qty = parseInt(jumlah_pinjam) || 1;
    if (qty > inventaris.jumlah) {
      return NextResponse.json(
        { error: `Jumlah pinjam (${qty}) melebihi stok yang tersedia (${inventaris.jumlah}).` },
        { status: 400 }
      );
    }

    const newLoan = await prisma.peminjaman.create({
      data: {
        user_id: user.id,
        inventaris_id,
        jumlah_pinjam: qty,
        tgl_pinjam: new Date(tgl_pinjam),
        tgl_kembali: new Date(tgl_kembali),
        keperluan,
        status_pinjam: "PENDING",
        status_kembali: "BELUM",
      },
      include: {
        inventaris: true,
        user: {
          select: {
            nama_lengkap: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Permohonan peminjaman berhasil diajukan. Menunggu persetujuan Admin/Kepala Bengkel.",
      peminjaman: newLoan,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }
    console.error("POST /api/peminjaman error:", error);
    return NextResponse.json({ error: "Gagal mengajukan peminjaman." }, { status: 500 });
  }
}
