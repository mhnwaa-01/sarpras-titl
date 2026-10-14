# Sistem Informasi Inventaris & Peminjaman Alat SMKN 10 Makassar

Aplikasi web modern berbasis **Next.js (App Router)**, **Tailwind CSS**, **PostgreSQL (Supabase / Vercel Postgres)**, dan **Prisma ORM** yang dirancang khusus untuk pengelolaan sarana dan prasarana bengkel kejuruan di **SMK Negeri 10 Makassar**.

Sistem ini mengacu secara ketat pada **Permendikbudristek No. 22 Tahun 2023** tentang Standar Sarana dan Prasarana pada Pendidikan Anak Usia Dini, Pendidikan Dasar, dan Pendidikan Menengah.

---

## 🏛️ Klasifikasi Aset (Permendikbudristek No. 22/2023)

Sistem membedakan secara tegas antara:
1. **SARANA**: Segala perlengkapan pembelajaran yang dapat dipindah-pindah:
   - **Bahan Pembelajaran**: Bahan habis pakai & material praktikum (kabel UTP, elektroda las, plat baja, komponen elektronik).
   - **Alat Pembelajaran**: Peralatan praktik kejuruan (Mesin Bubut CNC, Trainer Otomotif, Multimeter Digital, Workstation CAD, Tool Set).
   - **Perlengkapan**: Perabot pendukung (Meja Kerja Bengkel/Workbench, Lemari Alat, Rak Besi, APD/Kacamata Las).

2. **PRASARANA**: Fasilitas dasar satuan pendidikan:
   - **Ruang Praktik / Bengkel**: Bengkel Pemesinan, Bengkel Otomotif, Lab Jaringan Komputer, Lab Listrik.
   - **Ruang Kelas**: Ruang pembelajaran teori kejuruan.
   - **Laboratorium**: Lab Komputer, Lab IPA, Lab Multimedia.
   - **Ruang Administrasi**: Ruang Kepala Sekolah, Guru, Tata Usaha, Ruang Kepala Bengkel & Toolman.
   - **Lahan & Bangunan**: Konstruksi gedung dan area lapangan sekolah.

---

## 👥 Sistem Akses Multi-Role

| Role | Akses & Fitur Utama |
|---|---|
| **Admin / Kepala Bengkel** | • Dashboard metrik Sarpras & grafik kondisi aset (Baik vs Rusak)<br>• Manajemen CRUD Sarana & Prasarana terintegrasi<br>• Persetujuan (Approve) & Penolakan (Reject) peminjaman<br>• Verifikasi fisik pengembalian dengan form checklist & auto stock update<br>• Cetak Stiker Label Barcode/QR Code (satuan atau massal) |
| **Guru (Peminjam)** | • Katalog Sarana (Alat Pembelajaran & Perlengkapan) interaktif<br>• Formulir pengajuan peminjaman alat kejuruan (status awal: `PENDING`)<br>• Pelacakan status peminjaman mandiri<br>• **Cetak Borang Peminjaman A4 resmi** khusus yang berstatus `APPROVED` |
| **Publik (Tanpa Login)** | • Akses scanner kamera fisik `/scan`<br>• Halaman dinamis `/scan/[barcode_id]` menampilkan foto, nama, lokasi, jumlah, kondisi, dan status peminjaman secara transparan |

---

## 🚀 Panduan Setup & Deploy ke Vercel

### 1. Persiapan Database PostgreSQL (Supabase / Vercel Postgres)
1. Buat project gratis di [Supabase](https://supabase.com) atau [Vercel Storage (Postgres)](https://vercel.com/storage/postgres).
2. Dapatkan string koneksi PostgreSQL pada menu **Project Settings > Database**:
   - `DATABASE_URL`: Connection string PostgreSQL (gunakan connection pooling bila di Supabase).
   - `DIRECT_URL`: Direct connection string (untuk eksekusi migrasi schema).

### 2. Konfigurasi Environment Variables (.env)
Salin `.env.example` menjadi `.env`:
```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
JWT_SECRET="smkn10_makassar_sarpras_secret_key_super_secure_2026"
NEXT_PUBLIC_APP_URL="https://inventaris-smkn10.vercel.app"
```

### 3. Eksekusi Skema Database & Seeding Data
Di terminal proyek:
```bash
# Push skema Prisma ke database PostgreSQL
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Isi data awal realistis SMKN 10 Makassar
node prisma/seed.js
```

### 4. Deploy ke Vercel
1. Push repository ini ke GitHub / GitLab.
2. Buka dashboard [Vercel](https://vercel.com) -> Klik **"Add New Project"**.
3. Import repository.
4. Pada bagian **Environment Variables**, tambahkan:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
5. Klik **"Deploy"**. Vercel akan secara otomatis mem-build aplikasi Next.js dalam 1-2 menit.

---

## 🔑 Akun Uji Coba Default (Demo Credentials)

| Role | Username | Password | Keterangan |
|---|---|---|---|
| **Admin** | `admin` | `admin123` | Kepala Bengkel & Sarpras SMKN 10 Makassar |
| **Guru 1** | `guru` | `guru123` | Guru Produktif Pemesinan |
| **Guru 2** | `guru_tkj` | `guru123` | Guru Produktif Jaringan / RPL |

---

## 🖨️ Desain Print Layout (@media print CSS)
Aplikasi telah dioptimalkan untuk percetakan tanpa elemen web (navbar, button, shadow disembunyikan otomatis):
- **Stiker Barcode / QR Label**: Ukuran stiker proporsional untuk ditempel di fisik perkakas mesin, alat laboratorium, dan pintu ruangan.
- **Borang Peminjaman Resmi A4**: Standar surat resmi lengkap dengan Kop Surat SMKN 10 Makassar, data rincian alat, ketentuan tanggung jawab, serta 3 kolom tanda tangan resmi (Guru Peminjam, Toolman Bengkel, dan Kepala Bengkel).
