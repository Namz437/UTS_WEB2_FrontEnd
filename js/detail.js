$(document).ready(function() {
    var dataUrl = 'http://127.0.0.1:8000/api/admin/products';
    var ImageUrl = 'http://127.0.0.1:8000/storage/';

    function handleError(jqXHR, textStatus, errorThrown) {
        console.error('Error: ' + textStatus, errorThrown);
        $('#dataResult').text('Error: ' + textStatus + ' ' + errorThrown);
    }

    function createCart(data) {
        var cart = $('<div class="cart"></div>');

        data.forEach(function(item) {
            var productCard = $('<div class="product-card"></div>');

            var productImage = item.image ? '<img src="'+ ImageUrl + item.image + '" alt="Image">' : '';
            var productName = '<p><strong>Name:</strong> ' + item.name + '</p>';
            var productDescription = '<p><strong>Description:</strong> ' + item.description + '</p>';
            var productStock = '<p><strong>Stock:</strong> ' + item.stock + '</p>';
            var productPrice = '<p><strong>Price:</strong> ' + item.price + '</p>';
            var productButton = $('<button class="btn btn-primary keranjang-btn">Keranjang</button>');

            productButton.click(function() {
                addToCart(item);
            });

            productCard.append(productImage, productName, productDescription, productStock, productPrice, productButton);
            cart.append(productCard);
        });

        return cart;
    }

    function addToCart(item) {
        var cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'cart.html';
    }

    function fetchData() {
        var token = localStorage.getItem('authToken');

        if (!token) {
            $('#dataResult').text('You must login first!');
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
                $('#dataResult').empty();
                
                if (data.success) {
                    $('#dataResult').append(createCart(data.data.categories));
                } else {
                    $('#dataResult').text('Data fetched is not an array.');
                }
            },
            error: handleError
        });
    }

    fetchData();
});
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
