# Front-Banjay-AI

Front-Banjay-AI adalah aplikasi dashboard React untuk visualisasi, analisis, dan monitoring risiko banjir berbasis data spasial, satelit, dan AI. Proyek ini terintegrasi dengan backend Flask dan mendukung pemetaan interaktif, filter wilayah, serta chatbot analisis.

## Fitur Utama

- **Peta Interaktif**: Menampilkan peta Indonesia dengan filter Provinsi, Kota/Kabupaten, dan Kecamatan.
- **GeoJSON Border**: Menampilkan batas wilayah provinsi dan kabupaten secara visual.
- **Pick Koordinat**: Pilih titik koordinat di peta dengan satu klik (mode crosshair).
- **Chatbot Analisis**: Kirim pertanyaan atau data beserta lokasi ke backend Flask untuk analisis AI.
- **Upload Gambar Satelit**: Mendukung upload gambar satelit BMKG untuk analisis lebih lanjut.
- **Visualisasi Data**: Tersedia chart tren curah hujan dan tingkat kejenuhan tanah.
- **Respons Analisis**: Menampilkan hasil analisis AI dari backend.

## Struktur Folder

```
src/
  ├── BanjayMap.jsx
  ├── MapFilters.jsx
  ├── dashboard.jsx
  ├── dashboard.css
public/
  ├── provinces.json
  ├── regencies.json
  ├── districts.json
  └── province/   (folder GeoJSON provinsi)
  └── regency/    (folder GeoJSON kabupaten)
```

## Cara Menjalankan

1. **Install dependencies**
   ```
   npm install
   ```

2. **Jalankan frontend**
   ```
   npm start
   ```

3. **Pastikan backend Flask berjalan di** `http://localhost:5000` **dan endpoint** `/api/analisis` **aktif.**

4. **Pastikan file JSON wilayah dan GeoJSON sudah tersedia di folder public.**

## Cara Pakai

- Pilih Provinsi, Kota/Kabupaten, dan Kecamatan pada filter di atas peta.
- Klik tombol 📍 di peta untuk mengaktifkan mode pick koordinat, lalu klik pada peta untuk memilih lokasi.
- Isi pertanyaan atau data pada chatbot, lalu klik "Kirim" untuk mengirim ke backend.
- Hasil analisis akan muncul di bawah chatbot.

## Catatan

- Data wilayah (provinces, regencies, districts) diambil dari file JSON di folder `public`.
- Untuk menambah/ubah wilayah, edit file JSON terkait.
- Untuk menambah batas wilayah, tambahkan file GeoJSON ke folder `public/province` atau `public/regency`.