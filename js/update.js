$(document).ready(function () {
    // URL API
    var dataUrl = "http://127.0.0.1:8000/api/admin/products";
    var kategoriUrl = 'http://127.0.0.1:8000/api/admin/categories'; // URL untuk kategori
    var imgurl = "http://127.0.0.1:8000/storage/";
    var token = localStorage.getItem("authToken");
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get('id');
    var existingImage = '';

    if (!token) {
        $("#updateResult").text("You must login first!");
        return;
    }

    // Fungsi untuk menangani kesalahan
    function handleError(jqXHR, textStatus, errorThrown) {
        console.error("Error: " + textStatus, errorThrown);
        $("#updateResult").text("Error: " + textStatus + " " + errorThrown);
    }

    // Fungsi untuk mengisi form dengan data produk
    function fillForm(data) {
        $('#nama').val(data.name);
        $('#deskripsi').val(data.description || '');
        $('#harga').val(data.price);
        $('#stok').val(data.stock || '');
        $('#kategori').val(data.category_id);

        // Tambahkan gambar jika ada
        if (data.image) {
            var imageUrl = imgurl + data.image;
            existingImage = data.image; // Simpan nama gambar lama
            $('.gambar').html('<img src="' + imageUrl + '" alt="Gambar Produk" class="img-fluid">');
        }
    }

    // Fungsi untuk mengambil data produk berdasarkan ID
    function getProductById(id) {
        $.ajax({
            url: `${dataUrl}/${id}`,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            dataType: 'json',
            success: function (response) {
                if (response.success && response.data.product) {
                    fillForm(response.data.product);
                } else {
                    $('#updateResult').text('Failed to fetch product data.');
                }
            },
            error: handleError
        });
    }

    // Fungsi untuk memuat kategori
    function loadKategori() {
        $.ajax({
            url: kategoriUrl,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            dataType: 'json',
            success: function (data) {
                console.log('Kategori fetched:', data); // Logging tambahan
                var kategoriSelect = $('#kategori');
                if (data.success && Array.isArray(data.data.categories)) {
                    data.data.categories.forEach(function (category) {
                        kategoriSelect.append(new Option(category.name, category.id));
                    });
                    // Setelah kategori dimuat, isi form dengan data produk
                    getProductById(productId);
                } else {
                    console.error('Unexpected response format:', data);
                }
            },
            error: handleError
        });
    }

    // Fungsi untuk menangani pengiriman form
    $('#updateProductForm').on('submit', function (e) {
        e.preventDefault();

        var formData = new FormData();
        formData.append('name', $('#nama').val());
        var imageFile = $('#foto')[0].files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        } else {
            formData.append('existing_image', existingImage); // Gunakan nama gambar lama jika tidak ada gambar baru yang diupload
        }
        formData.append('description', $('#deskripsi').val());
        formData.append('price', $('#harga').val());
        formData.append('stock', $('#stok').val());
        formData.append('category_id', $('#kategori').val());

        $.ajax({
            url: `${dataUrl}/${productId}`,
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $('#updateResult').text('Produk berhasil diperbarui.');
                setTimeout(function () {
                    window.location.href = 'admin.html';
                }, 2000); // Tunggu 2 detik sebelum mengarahkan ke admin.html
            },
            error: handleError
        });
    });

    loadKategori(); // Memuat kategori saat halaman dimuat
});