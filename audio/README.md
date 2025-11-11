# Audio Files

Folder ini untuk menyimpan file audio (MP3) yang akan digunakan di website.

## Cara Menambahkan Beberapa Lagu (Playlist)

### 1. Upload File MP3
Upload file MP3 Anda ke folder `audio/` ini.
- Format: MP3 (disarankan)
- Ukuran: Disarankan maksimal 5-10 MB per file untuk performa yang baik
- Nama file: Gunakan nama yang deskriptif, contoh: `nama-lagu-artis.mp3`

### 2. Update Playlist di `js/script.js`
Buka file `js/script.js` dan cari array `playlistData`. Tambahkan lagu-lagu Anda di sana:

```javascript
const playlistData = [
    {
        title: 'Punto y Aparte',
        artist: 'Morat',
        src: 'audio/Punto Y Aparte.mp3'
    },
    {
        title: 'Judul Lagu 2',
        artist: 'Nama Artis',
        src: 'audio/nama-file-lagu-2.mp3'
    },
    {
        title: 'Judul Lagu 3',
        artist: 'Nama Artis',
        src: 'audio/nama-file-lagu-3.mp3'
    }
    // Tambahkan lagu lain sesuai kebutuhan
];
```

**Format setiap lagu:**
- `title`: Judul lagu (akan ditampilkan di player)
- `artist`: Nama artis/penyanyi (akan ditampilkan di player)
- `src`: Path ke file MP3 (relatif dari root website)

### 3. Menggunakan URL Eksternal (Opsional)
Jika Anda ingin menggunakan file dari hosting eksternal:

```javascript
{
    title: 'Judul Lagu',
    artist: 'Nama Artis',
    src: 'https://example.com/audio/music.mp3'  // URL eksternal
}
```

## Fitur Playlist

✅ **Multiple Songs**: Bisa menambahkan banyak lagu dalam satu playlist  
✅ **Next/Previous**: Tombol untuk skip ke lagu berikutnya/sebelumnya  
✅ **Playlist View**: Klik tombol 📋 untuk melihat daftar lagu  
✅ **Click to Play**: Klik lagu di playlist untuk langsung memutar  
✅ **Auto-play Next**: Otomatis memutar lagu berikutnya ketika lagu selesai  
✅ **Loop**: Playlist akan loop kembali ke lagu pertama setelah lagu terakhir  
✅ **Current Song Indicator**: Lagu yang sedang diputar akan ditandai di playlist  

## Cara Menggunakan Audio Player

1. **Buka Audio Player**: Klik tombol 🎵 di pojok kanan bawah
2. **Play/Pause**: Klik tombol ▶/⏸ untuk memutar/menjeda
3. **Next/Previous**: Gunakan tombol ⏭/⏮ untuk skip lagu
4. **Lihat Playlist**: Klik tombol 📋 untuk melihat daftar lagu
5. **Pilih Lagu**: Klik lagu di playlist untuk langsung memutar
6. **Volume Control**: Gunakan slider volume atau tombol volume untuk mengatur suara
7. **Seek**: Klik pada progress bar untuk skip ke bagian tertentu

## Catatan

- File audio akan dimuat dengan `preload="metadata"` untuk menghemat bandwidth
- Audio player akan muncul di pojok kanan bawah website
- User perlu mengklik tombol play untuk memutar lagu (tidak auto-play)
- Audio player mendukung dark mode
- Audio player responsive untuk mobile devices
- Playlist dapat di-collapse untuk menghemat ruang

