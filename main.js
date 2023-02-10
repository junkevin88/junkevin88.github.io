// Masukkan elemen yang ada di dalam file HTML ke dalam variabel
function update() {
    const select = document.getElementById("selection");
    const inputValue = document.getElementById("inputValue").value;
    const targetObject1 = document.getElementById("targetObject1");
    const targetObject2 = document.getElementById("targetObject2");
  
// Gunakan switch-case untuk menentukan fitur yang akan dibuat
    switch (select.value) {
      case "Warna Latar":
        targetObject1.style.backgroundColor = inputValue;
        break;
      case "Warna Text":
        targetObject2.style.color = inputValue;
        break;
      case "Ukuran Text":
        // Ubah ukuran font jangan lupa tambahkan satuan "px"
        targetObject2.style.fontSize = inputValue+"px";
        break;
      case "Jenis Font":
        targetObject2.style.fontFamily = inputValue;
        break;
      case "Lebar Konten":
        // Ubah lebar jangan lupa tambahkan satuan "px"
        targetObject1.style.width = inputValue+"px";
        break;
      case "Tinggi Konten":
        // Ubah tinggi jangan lupa tambahkan satuan "px"
        targetObject1.style.height = inputValue+"px";
        break;
      default:
        break;
    }
  }
  