# rahmanflower

Website katalog bunga dan anggur berbahasa Indonesia dengan tema lembut. Buka `index.html` di browser untuk menjalankannya; tidak perlu instalasi atau server.

Pemilih bahasa di kanan atas menyediakan Bahasa Indonesia, English, dan العربية. Pilihan bahasa menerjemahkan antarmuka, katalog, keranjang, serta pesan checkout; bahasa Arab mengaktifkan tata letak kanan-ke-kiri.

## Halaman admin

Buka `/admin/` pada alamat situs untuk mengelola produk dan pengaturan toko, termasuk bio di bagian “Cerita kami”, caption beranda, serta judul, deskripsi, dan caption foto pada bagian utama beranda. Teks khusus yang diatur admin ditampilkan apa adanya pada setiap pilihan bahasa. Daftar produk menyediakan pencarian, filter kategori, serta aksi edit dan hapus. Foto produk dapat diunggah dalam format gambar yang didukung browser dan akan dioptimalkan menjadi JPEG. Foto RAW kamera biasanya perlu dikonversi ke JPG atau PNG terlebih dahulu karena browser tidak dapat menampilkannya langsung. Pada saat ini perubahan disimpan di penyimpanan browser (localStorage), sehingga hanya berlaku pada browser/perangkat yang digunakan dan tidak otomatis mengubah data bagi pengunjung lain. Gunakan ekspor/impor JSON untuk memindahkan data. Agar perubahan admin langsung berlaku bagi semua pengunjung, situs memerlukan backend/API dan autentikasi admin; halaman statis ini belum menyediakannya.

## Mengubah katalog dan pengaturan toko

Buka `products.js`:

- Ubah `STORE_CONFIG.name` untuk nama toko.
- Isi `STORE_CONFIG.whatsappPhone` dengan nomor WhatsApp format internasional tanpa `+` atau spasi, misalnya `6281234567890`. Nomor ini digunakan untuk layanan pelanggan dan checkout.
- Isi `STORE_CONFIG.email` dengan alamat email toko untuk menampilkan tautan email pada bagian kontak. Kosongkan jika belum tersedia.
- Isi `STORE_CONFIG.payment.bankName`, `bankAccountName`, dan `bankAccountNumber` dengan detail rekening resmi. Isi `qrisImageUrl` dengan URL gambar kode QRIS resmi yang dapat diakses browser. Jika detail belum diisi, pelanggan diminta meminta informasi pembayaran kepada admin melalui WhatsApp.
- Isi `STORE_CONFIG.mapLocation` dengan alamat lengkap atau nama tempat yang dapat dicari di Google Maps. Bagian lokasi di bawah halaman akan menampilkan peta setelah nilai ini diisi; jika kosong, lokasi tidak akan ditebak.
- Isi `STORE_CONFIG.socialUrls.instagram`, `tiktok`, dan `facebook` dengan tautan profil toko. Tautan kosong akan menampilkan pemberitahuan untuk mengisi konfigurasi.
- Atur `STORE_CONFIG.shippingOptions` untuk kurir dan `websiteUrl` situs resminya. Pilihan awal adalah JNE, J&T Express, SiCepat, dan POS Indonesia. Pelanggan dapat membuka situs kurir yang dipilih atau Cekresi.com untuk memasukkan nomor resi.
- Atur `STORE_CONFIG.packingOptions` untuk nama pilihan packing dan `price` dalam rupiah. `price: 0` berarti gratis; isi harga untuk packing aman dan gift packaging. Checkout meminta alamat tujuan dan menampilkan total sementara tanpa ongkir.
- Edit daftar `PRODUCTS` untuk menambah, menghapus, atau mengubah produk. Setiap produk memakai `id` unik, `name`, `category`, `description`, `price` (angka dalam rupiah), `image` (URL gambar), dan `tag` (opsional; isi `""` untuk menyembunyikannya).

Checkout mengirimkan rincian pesanan dan metode pembayaran pilihan (transfer bank atau QRIS) melalui WhatsApp. Admin perlu mengonfirmasi ketersediaan produk, ongkir, total akhir, dan detail pembayaran sebelum pelanggan membayar; situs ini belum memproses pembayaran otomatis. Tambahkan testimoni hanya dari pelanggan asli dan setelah mendapat izin untuk memublikasikannya.

Contoh struktur konfigurasi kontak dan pembayaran (ganti dengan data resmi toko):

```js
email: "pesanan@example.com",
payment: {
  bankName: "Nama Bank",
  bankAccountName: "Nama Pemilik Rekening",
  bankAccountNumber: "Nomor Rekening",
  qrisImageUrl: "https://alamat-gambar/kode-qris.png",
},
```

Contoh produk:

```js
{
  id: "mawar-putih",
  name: "Mawar Putih",
  category: "Bunga",
  description: "12 tangkai mawar putih segar.",
  price: 175000,
  image: "https://alamat-gambar/mawar.jpg",
  tag: "FAVORIT",
}
```

Kategori filter akan mengikuti kategori yang digunakan di produk. Produk bougenvil berada di kategori Bunga bersama produk bunga lainnya. Gambar perlu berupa URL yang dapat diakses browser.
Harga dan gambar bougenvil masih contoh; ganti dengan harga, foto tanaman yang sesuai, warna, ukuran pot, dan kondisi stok sebenarnya sebelum toko dipublikasikan.

Contoh pilihan kurir:

```js
shippingOptions: [
  { id: "jne", name: "JNE", websiteUrl: "https://www.jne.co.id/" },
  { id: "jnt", name: "J&T Express", websiteUrl: "https://jet.co.id/" },
  { id: "sicepat", name: "SiCepat", websiteUrl: "https://www.sicepat.com/" },
  { id: "pos-indonesia", name: "POS Indonesia", websiteUrl: "https://www.posindonesia.co.id/" },
],
packingOptions: [
  { id: "standard", name: "Packing standar", price: 0 },
  { id: "secure", name: "Packing aman", price: 10000 },
  { id: "gift", name: "Gift packaging", price: 15000 },
],
```

Situs ini belum terhubung ke API tarif atau pelacakan otomatis. Tautan tracking membuka situs kurir/Cekresi agar pelanggan memasukkan nomor resi di sana. Ongkir dan total akhir dikonfirmasi admin berdasarkan alamat tujuan melalui WhatsApp; total di keranjang belum termasuk ongkir. Untuk estimasi otomatis diperlukan integrasi API tarif melalui backend yang aman.
