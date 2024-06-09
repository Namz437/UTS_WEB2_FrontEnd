$(document).ready(function () {
    // URL API
    var dataUrl = "http://127.0.0.1:8000/api/admin/products";
    var imageUrl = "http://127.0.0.1:8000/storage/";
    var kategoriUrl = 'http://127.0.0.1:8000/api/admin/categories'; // URL untuk kategori

    // Fungsi untuk menangani kesalahan
    function handleError(jqXHR, textStatus, errorThrown) {
        console.error("Error: " + textStatus, errorThrown);
        $("#dataResult").text("Error: " + textStatus + " " + errorThrown);
    }

    // Fungsi untuk membuat tabel
    function createTable(data) {
        var tbody = $("#table-body");
        tbody.empty(); // Kosongkan tbody sebelumnya

        // Buat baris data
        data.forEach(function (item, index) {
            var row = $("<tr></tr>");
            row.append("<td>" + (index + 1) + "</td>"); // No
            row.append("<td>" + item.name + "</td>"); // Nama
            if (item.image) {
                row.append(
                    '<td><img src="' +
                    item.picture_url +
                    '" alt="Image" style="max-width:100px; max-height:100px;"></td>'
                ); // Foto
            } else {
                row.append("<td>No Image</td>"); // Jika tidak ada gambar
            }
            row.append("<td>" + item.description + "</td>"); // Deskripsi
            row.append("<td>" + item.price + "</td>"); // Harga
            row.append("<td>" + item.stock + "</td>"); // Stok
            row.append("<td>" + (item.category ? item.category.name : "No Category") + "</td>"); // Kategori
            // Tambahkan tombol Update dan Delete
            var actionButtons = $('<td></td>');
            var updateButton = $('<a href="update.html?id=' + item.id + '" class="btn btn-primary update-btn">Update</a>').attr('data-id', item.id);
            var deleteButton = $('<button class="btn btn-danger delete-btn">Delete</button>').attr('data-id', item.id);
            actionButtons.append(updateButton).append(' ').append(deleteButton);
            row.append(actionButtons);

            tbody.append(row);
        });
        // Tambahkan event listener untuk tombol Delete
        $('.delete-btn').on('click', function () {
            var id = $(this).data('id');
            deleteProduk(id);
        });

        function deleteProduk(id) {
            // Konfirmasi pengguna sebelum menghapus
            if (confirm("Apakah Anda yakin ingin menghapus product ini?")) {
                $.ajax({
                    url: 'http://127.0.0.1:8000/api/admin/products/' + id,
                    type: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function (response) {
                        // Hapus baris dari tabel setelah berhasil menghapus dari server
                        $('tr[data-id="' + id + '"]').remove(); // Hapus baris yang terkait dari tabel
                        $('#dataResult').text('Makanan berhasil dihapus.');

                        // Refresh halaman setelah menghapus
                        location.reload();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('Error: ' + textStatus, errorThrown);
                        $('#dataResult').text('Gagal menghapus makanan: ' + textStatus);
                    }
                });
            }
        }
    }

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
                } else {
                    console.error('Unexpected response format:', data);
                }
            },
            error: handleError
        });
    }

    // Logout
    $("#logout").click(function () {
        // Tampilkan konfirmasi sebelum logout
        if (confirm("Apa anda yakin ingin logout?")) {
            localStorage.removeItem("authToken"); // Hapus token dari localStorage
            localStorage.removeItem("userRole"); // Hapus peran pengguna dari localStorage
            localStorage.removeItem("userName"); // Hapus nama pengguna dari localStorage
            // Redirect ke halaman login
            window.location.href = "login.html";
        }
    });

    // Fetch data request
    function fetchData() {
        var token = localStorage.getItem("authToken"); // Ambil token dari localStorage
        var role = localStorage.getItem("userRole"); // Ambil peran dari localStorage

        if (!token) {
            $("#dataResult").text("You must login first!");
            return;
        }
        if (role !== "admin") {
            $("#dataResult").text("AKSES DITOLAK. HANYA ADMIN, YANG DAPAT MELIHAT!!");
            return;
        }

        $.ajax({
            url: dataUrl,
            type: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
            dataType: "json",
            success: function (data) {
                console.log(data); // Log the entire response for debugging
                $("#dataResult").empty(); // Kosongkan hasil sebelumnya

                if (data.success && Array.isArray(data.data.categories)) {
                    // Menampilkan data dalam bentuk tabel
                    createTable(data.data.categories);
                } else {
                    $("#dataResult").text("Data fetched is not an array.");
                }
            },
            error: handleError,
        });
    }

    // Periksa token dan peran pengguna
    var token = localStorage.getItem("authToken");
    var role = localStorage.getItem("userRole");

    if (token && role === "admin") {
        fetchData(); // Otomatis fetch data jika sudah login dan role admin
        loadKategori(); // Memuat kategori saat halaman dimuat
    } else {
        if (!token) {
            $("#dataResult").text("You must login first!");
        } else {
            $("#dataResult").text("AKSES DITOLAK. HANYA ADMIN, YANG DAPAT MELIHAT!!");
        }
    }
    $('#addProductForm').on('submit', function (e) {
        e.preventDefault();
 
        var formData = new FormData();
        formData.append('name', $('#nama').val());
        formData.append('image', $('#foto')[0].files[0]);
        formData.append('description', $('#deskripsi').val());
        formData.append('price', $('#harga').val());
        formData.append('stock', $('#stok').val());
        formData.append('category_id', $('#kategori').val());
 
        $.ajax({
            url: dataUrl,
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $('#addResult').text('Produk berhasil ditambahkan.');
                setTimeout(function () {
                    window.location.href = 'admin.html';
                }, 2000); // Tunggu 2 detik sebelum mengarahkan ke admin.html
            },
            error: handleError
        });
    });





    // // Fungsi untuk mengisi form dengan data product
    // function fillForm(data) {
    //     $('#nama').val(data.name);
    //     $('#deskripsi').val(data.description || '');
    //     $('#harga').val(data.price);
    //     $('#stok').val(data.stock || '');
    //     $('#kategori').val(data.category_id);
 
    //     // Tambahkan gambar jika ada
    //     if (data.image) {
    //         var imageUrl = imgurl + data.image;
    //         existingImage = data.image; // Simpan nama gambar lama
    //         $('.gambar').html('<img src="' + imageUrl + '" alt="Gambar Product" class="img-fluid">');
    //     }
    // }
 
    // // Fungsi untuk mengambil data makanan berdasarkan ID
    // function getMakananById(id) {
    //     $.ajax({
    //         url: `${dataUrl}/${id}`,
    //         type: 'GET',
    //         headers: {
    //             'Authorization': 'Bearer ' + token
    //         },
    //         dataType: 'json',
    //         success: function (response) {
    //             if (response.success && response.data.categories) {
    //                 fillForm(response.data.categories);
    //             } else {
    //                 $('#updateResult').text('Failed to fetch food data.');
    //             }
    //         },
    //         error: handleError
    //     });
    // }
 
    // // Fungsi untuk memuat kategori
    // function loadKategori() {
    //     $.ajax({
    //         url: kategoriUrl,
    //         type: 'GET',
    //         headers: {
    //             'Authorization': 'Bearer ' + token
    //         },
    //         dataType: 'json',
    //         success: function (data) {
    //             console.log('Kategori fetched:', data); // Logging tambahan
    //             var kategoriSelect = $('#kategori');
    //             if (data.success && Array.isArray(data.data.categories)) {
    //                 data.data.categories.forEach(function (category) {
    //                     kategoriSelect.append(new Option(category.name, category.id));
    //                 });
    //                 // Setelah kategori dimuat, isi form dengan data makanan
    //                 getProductById(productId);
    //             } else {
    //                 console.error('Unexpected response format:', data);
    //             }
    //         },
    //         error: handleError
    //     });
    // }
 
    // // Fungsi untuk menangani pengiriman form
    // $('#updateFood').on('submit', function (e) {
    //     e.preventDefault();
 
    //     var formData = new FormData();
    //     formData.append('name', $('#nama').val());
    //     var imageFile = $('#formFile')[0].files[0];
    //     if (imageFile) {
    //         formData.append('image', imageFile);
    //     } else {
    //         formData.append('existing_image', existingImage); // Gunakan nama gambar lama jika tidak ada gambar baru yang diupload
    //     }
    //     formData.append('description', $('#deskripsi').val());
    //     formData.append('price', $('#harga').val());
    //     formData.append('stock', $('#stok').val());
    //     formData.append('category_id', $('#kategori').val());
 
    //     $.ajax({
    //         url: `${dataUrl}/${productId}`,
    //         type: 'POST',
    //         headers: {
    //             'Authorization': 'Bearer ' + token
    //         },
    //         data: formData,
    //         contentType: false,
    //         processData: false,
    //         success: function (response) {
    //             $('#updateResult').text('Product berhasil diperbarui.');
    //             setTimeout(function () {
    //                 window.location.href = 'index.html';
    //             }, 2000); // Tunggu 2 detik sebelum mengarahkan ke index.html
    //         },
    //         error: handleError
    //     });
    // });
});
