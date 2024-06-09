$(document).ready(function() {
    // URL API
    var dataUrl  = 'http://127.0.0.1:8000/api/admin/products';
    var ImageUrl = 'http://127.0.0.1:8000/storage/';

    // Fungsi untuk menangani kesalahan
    function handleError(jqXHR, textStatus, errorThrown) {
        console.error('Error: ' + textStatus, errorThrown);
        $('#dataResult').text('Error: ' + textStatus + ' ' + errorThrown);
    }

    // Fungsi untuk membuat tabel
    function createTable(data) {
        var table = $('<table class="table table-bordered"></table>');
        var thead = $('<thead><tr></tr></thead>');
        var tbody = $('<tbody></tbody>');

        // Buat header tabel
        Object.keys(data[0]).forEach(function(key) {
            thead.find('tr').append('<th>' + key + '</th>');
        });

        // Buat baris data
        data.forEach(function(item) {
            var row = $('<tr></tr>');
            Object.entries(item).forEach(function([key, value]) {
                if (key === 'image' && value !== '') {
                    row.append('<td><img src="'+ ImageUrl + value + '" alt="Image" style="max-width:100px; max-height:100px;"></td>');
                } else {
                    row.append('<td>' + value + '</td>');
                }
            });
            tbody.append(row);
        });

        table.append(thead).append(tbody);
        return table;
    }

     // Logout
    $('#logout').click(function() {
    // Tampilkan konfirmasi sebelum logout
    if (confirm('Apa anda yakin ingin logout?')) {
        localStorage.removeItem('authToken'); // Hapus token dari localStorage
        localStorage.removeItem('userRole'); // Hapus peran pengguna dari localStorage
        localStorage.removeItem('userName'); // Hapus nama pengguna dari localStorage
        // Redirect ke halaman login
        window.location.href = 'login.html';
    }
  });

    // Fetch data request
    $('#fetchData').click(function() {
        var token = localStorage.getItem('authToken'); // Ambil token dari localStorage
        var role = localStorage.getItem('userRole'); // Ambil peran dari localStorage

        if (!token) {
            $('#dataResult').text('You must login first!');
            return;
        }
        if (role !== 'admin') {
            $('#dataResult').text('AKSES DITOLAK. HANYA ADMIN, YANG DAPAT MELIHAT!!');
            return;
        }

        $.ajax({
            url: dataUrl,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            dataType: 'json',
            success: function(data) {
                $('#dataResult').empty(); // Kosongkan hasil sebelumnya
                
                if (data.success) {
                    // Menampilkan data dalam bentuk tabel
                    $('#dataResult').append(createTable(data.data.categories));
                } else {
                    $('#dataResult').text('Data fetched is not an array.');
                }
            },
            error: handleError
        });
    });
});
