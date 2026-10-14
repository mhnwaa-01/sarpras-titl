import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(["ADMIN", "GURU"]);
    const id = params.id;

    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id },
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
    });

    if (!peminjaman) {
      return NextResponse.json({ error: "Data peminjaman tidak ditemukan." }, { status: 404 });
    }

    // If guru, check ownership
    if (user.role === "GURU" && peminjaman.user_id !== user.id) {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    return NextResponse.json({ peminjaman });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }
    console.error("GET /api/peminjaman/[id] error:", error);
    return NextResponse.json({ error: "Gagal mengambil data peminjaman." }, { status: 500 });
  }
}
