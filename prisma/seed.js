const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai seeding data SMKN 10 Makassar...");

  // 1. Bersihkan data lama jika ada
  await prisma.peminjaman.deleteMany();
  await prisma.inventaris.deleteMany();
  await prisma.users.deleteMany();

  // 2. Hash passwords
  const passwordAdmin = await bcrypt.hash("admin123", 10);
  const passwordGuru = await bcrypt.hash("guru123", 10);

  // 3. Buat Data Users
  const admin = await prisma.users.create({
    data: {
      username: "admin",
      password: passwordAdmin,
      role: "ADMIN",
      nama_lengkap: "Drs. H. M. Said, M.Pd. (Kepala Bengkel & Sarpras)",
    },
  });

  const guruPemesinan = await prisma.users.create({
    data: {
      username: "guru",
      password: passwordGuru,
      role: "GURU",
      nama_lengkap: "Andi Pratama, S.Pd., Gr.",
    },
  });

  const guruTkj = await prisma.users.create({
    data: {
      username: "guru_tkj",
      password: passwordGuru,
      role: "GURU",
      nama_lengkap: "Nurul Hidayah, S.Kom.",
    },
  });

  console.log("Pengguna berhasil dibuat: admin (admin123), guru (guru123), guru_tkj (guru123)");

  // 4. Buat Data Inventaris (Permendikbudristek No. 22 Tahun 2023)
  // --- SARANA (Bahan, Alat, Perlengkapan) ---
  const bubut = await prisma.inventaris.create({
    data: {
      jenis_aset: "SARANA",
      kategori: "Alat Pembelajaran",
      nama_item: "Mesin Bubut Konvensional CQ6230",
      gambar_url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
      lokasi: "Bengkel Pemesinan 1 (Gedung B Lt. 1)",
      jumlah: 4,
      kondisi: "BAIK",
      barcode_id: "SMK10-SAR-2026-001",
    },
  });

  const multimeter = await prisma.inventaris.create({
    data: {
      jenis_aset: "SARANA",
      kategori: "Alat Pembelajaran",
      nama_item: "Digital Multimeter Sanwa CD800a",
      gambar_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      lokasi: "Lab Kelistrikan & Instrumentasi",
      jumlah: 12,
      kondisi: "BAIK",
      barcode_id: "SMK10-SAR-2026-002",
    },
  });

  const trainerOtomotif = await prisma.inventaris.create({
    data: {
      jenis_aset: "SARANA",
      kategori: "Alat Pembelajaran",
      nama_item: "Trainer Engine Stand EFI Toyota Avanza 1.3",
      gambar_url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lokasi: "Bengkel Otomotif & Kendaraan Ringan",
      jumlah: 2,
      kondisi: "BAIK",
      barcode_id: "SMK10-SAR-2026-003",
    },
  });

  const pcCad = await prisma.inventaris.create({
    data: {
      jenis_aset: "SARANA",
      kategori: "Alat Pembelajaran",
      nama_item: "PC Workstation Core i7 Design CAD/CAM & Multimedia",
      gambar_url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
      lokasi: "Lab Komputer Desain & Multimedia Lt. 2",
      jumlah: 24,
      kondisi: "BAIK",
      barcode_id: "SMK10-SAR-2026-004",
    },
  });

  const lasTig = await prisma.inventaris.create({
    data: {
      jenis_aset: "SARANA",
      kategori: "Alat Pembelajaran",
      nama_item: "Mesin Las Inverter TIG/MIG 200 Ampere",
      gambar_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      lokasi: "Bengkel Fabrikasi & Pengelasan",
      jumlah: 1,
      kondisi: "RUSAK",
      barcode_id: "SMK10-SAR-2026-005",
    },
  });

  const kabelUtp = await prisma.inventaris.create({
    data: {
      jenis_aset: "SARANA",
      kategori: "Bahan Pembelajaran",
      nama_item: "Kabel UTP Belden Cat6 (Roll 305 Meter)",
      gambar_url: null,
      lokasi: "Gudang Sarpras Jaringan Komputer",
      jumlah: 6,
      kondisi: "BAIK",
      barcode_id: "SMK10-SAR-2026-006",
    },
  });

  const workbench = await prisma.inventaris.create({
    data: {
      jenis_aset: "SARANA",
      kategori: "Perlengkapan",
      nama_item: "Meja Kerja Praktik Bengkel (Steel Workbench with Vice)",
      gambar_url: null,
      lokasi: "Bengkel Pemesinan 1",
      jumlah: 8,
      kondisi: "BAIK",
      barcode_id: "SMK10-SAR-2026-007",
    },
  });

  // --- PRASARANA (Ruang Praktik/Bengkel, Ruang Kelas, Lab, Lahan, Bangunan) ---
  const bengkelMesin = await prisma.inventaris.create({
    data: {
      jenis_aset: "PRASARANA",
      kategori: "Ruang Praktik / Bengkel",
      nama_item: "Bengkel Pemesinan & Fabrikasi Logam SMKN 10",
      gambar_url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
      lokasi: "Gedung B Lantai 1",
      jumlah: 1,
      kondisi: "BAIK",
      barcode_id: "SMK10-PRA-2026-001",
    },
  });

  const labTkj = await prisma.inventaris.create({
    data: {
      jenis_aset: "PRASARANA",
      kategori: "Ruang Praktik / Bengkel",
      nama_item: "Laboratorium Komputer Jaringan & RPL",
      gambar_url: null,
      lokasi: "Gedung C Lantai 2",
      jumlah: 1,
      kondisi: "BAIK",
      barcode_id: "SMK10-PRA-2026-002",
    },
  });

  const ruangKelas11 = await prisma.inventaris.create({
    data: {
      jenis_aset: "PRASARANA",
      kategori: "Ruang Kelas",
      nama_item: "Ruang Kelas Teori Kejuruan XI-TP-1",
      gambar_url: null,
      lokasi: "Gedung A Lantai 2",
      jumlah: 1,
      kondisi: "BAIK",
      barcode_id: "SMK10-PRA-2026-003",
    },
  });

  const ruangKabeng = await prisma.inventaris.create({
    data: {
      jenis_aset: "PRASARANA",
      kategori: "Ruang Administrasi",
      nama_item: "Ruang Kerja Kepala Bengkel & Toolman Sarpras",
      gambar_url: null,
      lokasi: "Gedung B Lantai 1 (Depan Bengkel Mesin)",
      jumlah: 1,
      kondisi: "BAIK",
      barcode_id: "SMK10-PRA-2026-004",
    },
  });

  console.log("Sarana & Prasarana berhasil dibuat sesuai Permendikbudristek No. 22/2023.");

  // 5. Buat Data Peminjaman Sampel
  // Peminjaman 1: APPROVED (Bisa langsung dicetak Borang A4)
  const pinjamApproved = await prisma.peminjaman.create({
    data: {
      user_id: guruPemesinan.id,
      inventaris_id: bubut.id,
      jumlah_pinjam: 1,
      tgl_pinjam: new Date("2026-10-15T08:00:00Z"),
      tgl_kembali: new Date("2026-10-15T15:00:00Z"),
      keperluan: "Praktik Pembubutan Bertingkat & Ulir Segitiga Kelas XII TP 1",
      status_pinjam: "APPROVED",
      status_kembali: "BELUM",
      catatan: "Disetujui. Harap bersihkan tatal besi dan lumasi eretan setelah dipakai.",
    },
  });

  // Peminjaman 2: PENDING (Menunggu persetujuan Admin/Kepala Bengkel)
  const pinjamPending = await prisma.peminjaman.create({
    data: {
      user_id: guruTkj.id,
      inventaris_id: multimeter.id,
      jumlah_pinjam: 2,
      tgl_pinjam: new Date("2026-10-16T09:00:00Z"),
      tgl_kembali: new Date("2026-10-16T12:00:00Z"),
      keperluan: "Pengukuran Tegangan Power Supply & Hambatan Jaringan LAN Siswa XI TKJ",
      status_pinjam: "PENDING",
      status_kembali: "BELUM",
    },
  });

  // Peminjaman 3: DIKEMBALIKAN (Riwayat selesai dengan ceklis fisik)
  const pinjamSelesai = await prisma.peminjaman.create({
    data: {
      user_id: guruPemesinan.id,
      inventaris_id: trainerOtomotif.id,
      jumlah_pinjam: 1,
      tgl_pinjam: new Date("2026-10-10T08:00:00Z"),
      tgl_kembali: new Date("2026-10-10T14:00:00Z"),
      keperluan: "Praktik Diagnosis Sensor EFI Menggunakan OBD-II Scanner",
      status_pinjam: "APPROVED",
      status_kembali: "DIKEMBALIKAN",
      ceklis_kondisi_kembali: "[V] Kelengkapan Fisik Lengkap, [V] Kebersihan Terjaga, [V] Fungsi Alat Normal",
      catatan: "Selesai dikembalikan tepat waktu, kondisi normal dan bersih.",
    },
  });

  console.log("Seeding peminjaman selesai. ID Approved untuk cetak borang:", pinjamApproved.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
