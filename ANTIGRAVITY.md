# Antigravity — Agent Task Plan: Vendor & Admin Frontend
> Project: Travelink | Stack: Next.js | Scope: Vendor & Admin (User side sudah selesai)
> Gunakan **Plan Mode** untuk semua task di bawah — biar agent generate Plan Artifact dulu sebelum mulai coding.

---

## Konteks Project

- **User side** sudah berjalan di `app/` (bookings, destinations, vehicles, login, register, dashboard)
- **Vendor side** baru ada folder `app/vendor/` tapi belum diisi
- **Admin side** belum ada folder
- Services tersedia di `services/` (auth, booking, destination, review, vehicle, vendor)
- API client ada di `lib/api-client.ts`
- Auth context ada di `context/AuthContext.tsx`
- Toast hook ada di `hooks/use-toast.ts`

---

## TIPS PENGGUNAAN ANTIGRAVITY

- Gunakan **Plan Mode** untuk task yang menyentuh banyak file sekaligus
- Gunakan **Fast Mode** untuk perbaikan kecil seperti styling, rename, atau fix bug
- Cek **Artifacts Panel** setelah tiap task — review plan sebelum agent mulai eksekusi
- Gunakan **Agent Manager** untuk pantau status tiap task (Running / Success / Failed)
- Gunakan **Browser Preview** bawaan untuk cek hasil halaman langsung tanpa buka browser lain

---

## SHARED — Kerjakan Pertama

### TASK S-1 — Komponen Reusable
```
Buat komponen reusable berikut di folder components/shared/ yang akan dipakai bersama
oleh halaman vendor dan admin:

1. StatusBadge.tsx
   - Props: status (BookingStatus | PaymentStatus | VehicleStatus), size?
   - Tampilkan badge berwarna per status:
     PENDING_PAYMENT = kuning, CONFIRMED = biru, COMPLETED = hijau,
     CANCELLED = merah, ACTIVE = hijau, INACTIVE = abu, PAID = hijau,
     FAILED = merah, REFUNDED = ungu

2. DataTable.tsx
   - Props: columns[], data[], loading (boolean), emptyMessage (string)
   - Tampilkan loading skeleton saat loading=true
   - Tampilkan emptyMessage saat data kosong

3. ConfirmDialog.tsx
   - Modal konfirmasi sebelum aksi delete atau perubahan status
   - Props: isOpen, title, message, onConfirm, onCancel

4. PageHeader.tsx
   - Props: title, subtitle? (string), action? (ReactNode)
   - Header konsisten untuk semua halaman admin dan vendor

Pastikan styling konsisten dengan globals.css yang sudah ada.
```
**Files:** `components/shared/StatusBadge.tsx`, `DataTable.tsx`, `ConfirmDialog.tsx`, `PageHeader.tsx`

---

## VENDOR SIDE

### TASK V-1 — Layout & Route Guard Vendor
```
Buat layout shell untuk semua halaman vendor di app/vendor/layout.tsx.

Sidebar navigasi:
- Dashboard → /vendor/dashboard
- Kendaraan Saya → /vendor/vehicles
- Booking Masuk → /vendor/bookings
- Profil Bisnis → /vendor/profile

Route guard: gunakan AuthContext dari context/AuthContext.tsx.
Jika user tidak login atau role bukan VENDOR, redirect ke /unauthorized.
Buat juga app/vendor/page.tsx yang redirect ke /vendor/dashboard.
```
**Files:** `app/vendor/layout.tsx`, `app/vendor/page.tsx`

---

### TASK V-2 — Vendor Dashboard
```
Buat halaman dashboard vendor di app/vendor/dashboard/page.tsx.

Tampilkan dalam stat cards:
- Total kendaraan aktif milik vendor ini (Vehicle.status = ACTIVE)
- Booking bulan ini dengan status CONFIRMED atau COMPLETED
- Booking pending yang belum dibayar (status = PENDING_PAYMENT)
- Estimasi pendapatan bulan ini (Payment.status = PAID, sum amount)

Di bawah stat cards, tampilkan tabel 5 booking terbaru dengan kolom:
bookingCode, nama customer, kendaraan, tanggal, total, status booking, status payment.

Ambil data menggunakan vendor.service.ts dan booking.service.ts.
Filter semua data berdasarkan vendorId yang didapat dari AuthContext.
```
**Files:** `app/vendor/dashboard/page.tsx`

---

### TASK V-3 — Profil Bisnis Vendor
```
Buat halaman edit profil bisnis di app/vendor/profile/page.tsx.

Form yang bisa diedit:
- businessName (required)
- address
- city
- bankName
- bankAccount

Tampilkan sebagai read-only (tidak bisa diedit):
- isVerified (badge: Terverifikasi / Belum Terverifikasi)
- email dan nama dari User yang terhubung

Gunakan vendor.service.ts untuk GET data vendor dan PATCH/PUT update.
Setelah sukses simpan, tampilkan toast notifikasi menggunakan hooks/use-toast.ts.
```
**Files:** `app/vendor/profile/page.tsx`

---

### TASK V-4 — Daftar Kendaraan Vendor
```
Buat halaman daftar kendaraan di app/vendor/vehicles/page.tsx.

Tampilkan semua Vehicle milik vendor yang sedang login (filter by vendorId).
Kolom tabel: Gambar (thumbnail), Nama, Kategori, Destinasi, Kapasitas,
Harga/Hari, Status, Aksi.

Aksi per baris:
- Edit → link ke /vendor/vehicles/[id]/edit
- Toggle Status (ACTIVE ↔ INACTIVE) → konfirmasi dulu pakai ConfirmDialog
- Hapus → konfirmasi dulu pakai ConfirmDialog

Tombol "+ Tambah Kendaraan" di PageHeader yang link ke /vendor/vehicles/new.
Gunakan vehicle.service.ts dan komponen shared yang sudah dibuat di S-1.
```
**Files:** `app/vendor/vehicles/page.tsx`

---

### TASK V-5 — Form Tambah Kendaraan
```
Buat halaman tambah kendaraan di app/vendor/vehicles/new/page.tsx.

Field form sesuai model Vehicle di Prisma schema:
- name (string, required)
- description (textarea)
- categoryId (dropdown → GET /vehicle-categories)
- destinationId (dropdown → GET /destinations)
- capacity (number, required, min 1)
- pricePerDay (number, required, min 0)
- status (select: ACTIVE | INACTIVE, default ACTIVE)
- images (multi-upload, gambar pertama otomatis jadi isPrimary=true di VehicleImage)

Gunakan vehicle.service.ts untuk POST kendaraan baru.
Gunakan destination.service.ts untuk populate dropdown destinasi.
Setelah berhasil simpan, redirect ke /vendor/vehicles dengan toast sukses.
```
**Files:** `app/vendor/vehicles/new/page.tsx`

---

### TASK V-6 — Form Edit Kendaraan
```
Buat halaman edit kendaraan di app/vendor/vehicles/[id]/edit/page.tsx.

- Fetch data kendaraan by id dari params menggunakan vehicle.service.ts
- Pre-fill semua field form dengan data existing (field sama dengan form tambah di V-5)
- Untuk gambar: tampilkan gambar-gambar existing dengan tombol hapus per gambar,
  plus area upload gambar baru
- Validasi bahwa vehicle ini memang milik vendor yang sedang login
  (bandingkan vehicle.vendorId dengan vendorId dari AuthContext)
- Gunakan PATCH/PUT di vehicle.service.ts untuk update
- Redirect ke /vendor/vehicles setelah berhasil
```
**Files:** `app/vendor/vehicles/[id]/edit/page.tsx`

---

### TASK V-7 — Booking Masuk
```
Buat halaman daftar booking di app/vendor/bookings/page.tsx.

Tampilkan semua booking untuk kendaraan-kendaraan milik vendor ini.
Kolom: Kode Booking, Customer, Kendaraan, Tgl Mulai, Tgl Selesai,
Total Hari, Total Harga, Status Booking, Status Payment, Aksi.

Filter tab di atas tabel: ALL | PENDING_PAYMENT | CONFIRMED | COMPLETED | CANCELLED
Klik baris atau tombol Detail → /vendor/bookings/[id]

Gunakan booking.service.ts, filter berdasarkan kendaraan yang vendorId-nya sesuai.
Gunakan StatusBadge dari komponen shared untuk tampilkan status.
```
**Files:** `app/vendor/bookings/page.tsx`

---

### TASK V-8 — Detail Booking Vendor
```
Buat halaman detail booking di app/vendor/bookings/[id]/page.tsx.

Tampilkan:
- Info booking: bookingCode, tanggal mulai-selesai, totalDays, totalPrice, notes, status
- Info customer: nama, email, phone (read-only)
- Info kendaraan yang dipesan beserta gambar thumbnail-nya
- Info payment: method, amount, paidAt, status
- Review dari customer jika sudah ada: rating bintang + comment

Gunakan booking.service.ts untuk fetch detail booking by id.
Tampilkan tombol "← Kembali" ke /vendor/bookings.
```
**Files:** `app/vendor/bookings/[id]/page.tsx`

---

## ADMIN SIDE

### TASK A-0 — Setup Folder & Layout Admin
```
Buat struktur folder dan layout admin.

app/admin/layout.tsx — sidebar navigasi:
- Dashboard → /admin/dashboard
- Kelola User → /admin/users
- Kelola Vendor → /admin/vendors
- Kelola Destinasi → /admin/destinations
- Kelola Kategori → /admin/categories
- Kelola Kendaraan → /admin/vehicles
- Kelola Booking → /admin/bookings

Route guard: hanya role ADMIN yang bisa akses. Gunakan AuthContext.
Redirect ke /unauthorized jika bukan admin.
Buat app/admin/page.tsx yang redirect ke /admin/dashboard.
```
**Files:** `app/admin/layout.tsx`, `app/admin/page.tsx`

---

### TASK A-1 — Admin Dashboard
```
Buat halaman overview admin di app/admin/dashboard/page.tsx.

Stat cards:
- Total User (role CUSTOMER)
- Total Vendor aktif (isVerified = true)
- Vendor pending verifikasi (isVerified = false)
- Total Kendaraan (ACTIVE vs INACTIVE)
- Total Booking bulan ini
- Total Revenue bulan ini (Payment.status = PAID, sum amount)

Di bawah stat cards:
- Tabel 5 booking terbaru
- Tabel 5 vendor terbaru yang belum diverifikasi (isVerified = false)

Ambil data menggunakan semua service yang tersedia di services/.
```
**Files:** `app/admin/dashboard/page.tsx`

---

### TASK A-2 — Kelola User
```
Buat halaman manajemen user di app/admin/users/page.tsx.

Tabel: ID, Nama, Email, Phone, Role, Tanggal Daftar, Aksi.
Filter tab: ALL | CUSTOMER | VENDOR | ADMIN.
Search bar: cari berdasarkan nama atau email.
Aksi: Lihat Detail, Hapus (dengan ConfirmDialog).

Buat halaman detail di app/admin/users/[id]/page.tsx:
- Semua info user (nama, email, phone, role, avatar, createdAt)
- Jika role = VENDOR, tampilkan section info Vendor (businessName, city, isVerified)
- Tabel riwayat booking user (5 terakhir)

Fetch data user dari API menggunakan api-client.ts (GET /users dan GET /users/:id).
```
**Files:** `app/admin/users/page.tsx`, `app/admin/users/[id]/page.tsx`

---

### TASK A-3 — Kelola Vendor & Verifikasi
```
Buat halaman manajemen vendor di app/admin/vendors/page.tsx.

Tabel: ID, Business Name, Pemilik, Kota, Status Verifikasi, Bank, Aksi.
Filter tab: ALL | VERIFIED | UNVERIFIED.
Aksi: Lihat Detail, Toggle Verifikasi (dengan ConfirmDialog), Hapus.

Buat halaman detail di app/admin/vendors/[id]/page.tsx:
- Info lengkap vendor (businessName, address, city, bankName, bankAccount)
- Info user pemiliknya (nama, email)
- Badge status verifikasi yang menonjol
- Tombol "Verifikasi" atau "Cabut Verifikasi" yang prominent
- Daftar kendaraan milik vendor ini (nama, status, harga)

Gunakan vendor.service.ts dari services/.
```
**Files:** `app/admin/vendors/page.tsx`, `app/admin/vendors/[id]/page.tsx`

---

### TASK A-4 — Kelola Destinasi
```
Buat CRUD destinasi.

app/admin/destinations/page.tsx (list):
- Tabel: ID, Gambar thumbnail, Nama, Slug, Tipe, Kota, Status, Aksi
- Aksi: Edit, Hapus (ConfirmDialog), Toggle isActive
- Tombol "+ Tambah Destinasi"

app/admin/destinations/new/page.tsx (tambah) &
app/admin/destinations/[id]/edit/page.tsx (edit):
Form field:
- name (required)
- slug (auto-generate dari name tapi bisa diedit manual)
- type (input teks, contoh: pantai, gunung, kota)
- city (required)
- image (upload atau input URL)
- isActive (toggle switch)

Gunakan destination.service.ts dari services/.
```
**Files:** `app/admin/destinations/page.tsx`, `new/page.tsx`, `[id]/edit/page.tsx`

---

### TASK A-5 — Kelola Kategori Kendaraan
```
Buat CRUD kategori kendaraan.

app/admin/categories/page.tsx (list):
- Tabel: ID, Icon, Nama, Slug, Jumlah Kendaraan, Aksi
- Aksi: Edit, Hapus (ConfirmDialog)
- Tombol "+ Tambah Kategori"

app/admin/categories/new/page.tsx &
app/admin/categories/[id]/edit/page.tsx:
Form field:
- name (required, unique)
- slug (auto-generate, bisa diedit)
- icon (input emoji atau icon name)

Buat service function baru di services/category.service.ts untuk
endpoint GET/POST/PUT/DELETE /vehicle-categories.
```
**Files:** `app/admin/categories/page.tsx`, `new/page.tsx`, `[id]/edit/page.tsx`, `services/category.service.ts`

---

### TASK A-6 — Kelola Semua Kendaraan
```
Buat halaman manajemen semua kendaraan di app/admin/vehicles/page.tsx.

Tabel: ID, Gambar, Nama, Vendor, Kategori, Destinasi, Harga/Hari, Status, Aksi.
Filter: Status (ALL | ACTIVE | INACTIVE), dropdown Kategori, dropdown Destinasi.
Aksi: Lihat Detail, Edit, Hapus (ConfirmDialog), Toggle Status.

Buat halaman detail di app/admin/vehicles/[id]/page.tsx:
- Semua info kendaraan + gallery gambar-gambar
- Info vendor pemilik (businessName, link ke halaman vendor)
- Tabel booking untuk kendaraan ini (10 terakhir)
- Tabel review (rating, comment, nama customer)

Gunakan vehicle.service.ts.
```
**Files:** `app/admin/vehicles/page.tsx`, `app/admin/vehicles/[id]/page.tsx`

---

### TASK A-7 — Kelola Semua Booking
```
Buat halaman manajemen semua booking di app/admin/bookings/page.tsx.

Tabel: Kode Booking, Customer, Kendaraan, Vendor, Tgl Mulai-Selesai,
Total, Status Booking, Status Payment, Aksi.
Filter: BookingStatus, PaymentStatus.
Search: berdasarkan bookingCode atau nama customer.
Aksi: Lihat Detail, Update Status.

Buat halaman detail di app/admin/bookings/[id]/page.tsx:
- Info booking lengkap (semua field dari model Booking)
- Info customer, kendaraan, vendor masing-masing dengan link ke halaman detailnya
- Info payment: method, amount, paidAt, status
- Review jika ada
- Tombol update BookingStatus dengan dropdown pilihan status

Gunakan booking.service.ts.
```
**Files:** `app/admin/bookings/page.tsx`, `app/admin/bookings/[id]/page.tsx`

---

## URUTAN EKSEKUSI YANG DISARANKAN

```
1.  S-1   ← Komponen shared (fondasi, wajib duluan)
2.  V-1   ← Vendor layout & guard
3.  V-2   ← Vendor dashboard
4.  V-3   ← Profil bisnis
5.  V-4   ← List kendaraan
6.  V-5   ← Form tambah kendaraan
7.  V-6   ← Form edit kendaraan
8.  V-7   ← Booking masuk
9.  V-8   ← Detail booking vendor
10. A-0   ← Admin layout & guard
11. A-1   ← Admin dashboard
12. A-2   ← Kelola user
13. A-3   ← Kelola vendor & verifikasi
14. A-4   ← Kelola destinasi
15. A-5   ← Kelola kategori
16. A-6   ← Kelola kendaraan
17. A-7   ← Kelola booking
```

---

## CATATAN PENTING UNTUK AGENT

- Semua halaman vendor/admin wajib cek role di `AuthContext` — jangan lewati ini
- Selalu gunakan `lib/api-client.ts` yang sudah ada, jangan buat instance fetch/axios baru
- Error handling dan toast sudah tersedia di `hooks/use-toast.ts` — pakai konsisten
- Tipe data (`Vendor`, `Vehicle`, `Booking`, dll) extend dari `lib/types.ts`
- Ikuti konvensi yang sudah ada: kebab-case untuk nama folder, PascalCase untuk komponen
- Untuk pola route protection, lihat referensi di folder `app/unauthorized/` yang sudah ada
- Di **Plan Mode**, review Plan Artifact sebelum approve — pastikan file yang akan disentuh agent sudah benar sebelum eksekusi