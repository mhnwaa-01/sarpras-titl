/**
 * Klasifikasi Sarana dan Prasarana SMK berdasarkan Permendikbudristek No. 22 Tahun 2023
 * tentang Standar Sarana dan Prasarana pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar,
 * dan Jenjang Pendidikan Menengah.
 */

export const PERMENDIKBUD_STANDARDS = {
  SARANA: {
    label: "Sarana",
    deskripsi: "Segala perlengkapan pembelajaran yang dapat dipindah-pindah untuk mendukung proses pembelajaran.",
    kategori: [
      {
        id: "Bahan Pembelajaran",
        nama: "Bahan Pembelajaran",
        keterangan: "Bahan habis pakai atau material pendukung praktik kejuruan (misal: kabel UTP, elektroda las, plat baja, komponen elektronik).",
      },
      {
        id: "Alat Pembelajaran",
        nama: "Alat Pembelajaran",
        keterangan: "Peralatan praktikum kejuruan spesifik (misal: Mesin Bubut CNC, Multimeter Digital, Trainer Otomotif, PC Workstation, Tool Set).",
      },
      {
        id: "Perlengkapan",
        nama: "Perlengkapan",
        keterangan: "Perabot dan fasilitas pendukung ruang praktik (misal: Meja Kerja Bengkel/Workbench, Lemari Penyimpanan Alat, APD/Kacamata Las, Rak Besi).",
      },
    ],
  },
  PRASARANA: {
    label: "Prasarana",
    deskripsi: "Fasilitas dasar yang diperlukan untuk menjalankan fungsi satuan pendidikan.",
    kategori: [
      {
        id: "Ruang Praktik / Bengkel",
        nama: "Ruang Praktik / Bengkel",
        keterangan: "Bengkel kejuruan dan laboratorium teknis (misal: Bengkel Pemesinan, Bengkel Otomotif, Lab Komputer & Jaringan, Lab Kelistrikan).",
      },
      {
        id: "Ruang Kelas",
        nama: "Ruang Kelas",
        keterangan: "Ruangan untuk kegiatan pembelajaran teori umum bagi peserta didik.",
      },
      {
        id: "Laboratorium",
        nama: "Laboratorium",
        keterangan: "Ruang laboratorium penunjang keilmuan (Lab IPA, Komputer, Multimedia, Bahasa).",
      },
      {
        id: "Ruang Administrasi",
        nama: "Ruang Administrasi",
        keterangan: "Ruang pimpinan, guru, tata usaha, dan ruang kerja kepala bengkel/program keahlian.",
      },
      {
        id: "Bangunan",
        nama: "Bangunan",
        keterangan: "Konstruksi gedung sekolah, gedung bengkel utama, dan struktur fisik.",
      },
      {
        id: "Lahan",
        nama: "Lahan",
        keterangan: "Tanah, lapangan olahraga, area uji kendara, dan lingkungan terbuka sekolah.",
      },
      {
        id: "Fasilitas Penunjang",
        nama: "Fasilitas Penunjang",
        keterangan: "Gudang sarana prasarana, ruang UKS, toilet, dan fasilitas pendukung operasional sekolah.",
      },
    ],
  },
};

export const KATEGORI_SARANA_OPTIONS = PERMENDIKBUD_STANDARDS.SARANA.kategori.map((k) => k.id);
export const KATEGORI_PRASARANA_OPTIONS = PERMENDIKBUD_STANDARDS.PRASARANA.kategori.map((k) => k.id);

export function getKategoriBadgeColor(jenisAset: "SARANA" | "PRASARANA"): string {
  if (jenisAset === "SARANA") {
    return "bg-blue-100 text-blue-800 border-blue-200";
  }
  return "bg-emerald-100 text-emerald-800 border-emerald-200";
}
