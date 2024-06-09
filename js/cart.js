document.addEventListener('DOMContentLoaded', function() {
    var ImageUrl = 'http://127.0.0.1:8000/storage/';
    var cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCart() {
        var cartItemsContainer = document.getElementById('cartItems');
        cartItemsContainer.innerHTML = '';

        cart.forEach(function(item, index) {
            var cartItem = `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="${ImageUrl + item.image}" class="card-img-top" alt="${item.name}" style="width:100%; height:auto;">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">Description: ${item.description}</p>
                            <p class="card-text">Price: $${item.price}</p>
                            <p class="card-text">Stock: ${item.stock}</p>
                            <div class="d-flex align-items-center mb-2">
                                <button class="btn btn-danger btn-sm me-2" onclick="updateQuantity(${index}, -1)">-</button>
                                <input type="text" class="form-control text-center" value="${item.quantity}" style="width: 50px;" readonly>
                                <button class="btn btn-success btn-sm ms-2" onclick="updateQuantity(${index}, 1)">+</button>
                            </div>
                            <button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Delete</button>
                            <input type="checkbox" class="form-check-input item-checkbox" data-id="${item.id}">
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItem;
        });

        localStorage.setItem('cart', JSON.stringify(cart));
    }

    window.updateQuantity = function(index, change) {
        var item = cart[index];
        item.quantity = (item.quantity || 0) + change;

        if (item.quantity < 1) {
            item.quantity = 1;
        } else if (item.quantity > item.stock) {
            item.quantity = item.stock;
        }

        renderCart();
    }

    window.removeItem = function(index) {
        cart.splice(index, 1);
        renderCart();
    }

    document.getElementById('checkout').addEventListener('click', function() {
        var selectedItems = [];

        // Find all checkboxes with class 'item-checkbox' that are checked
        var checkboxes = document.querySelectorAll('.item-checkbox:checked');

        // Loop through checked checkboxes and push their 'data-id' attribute to selectedItems array
        checkboxes.forEach(function(checkbox) {
            selectedItems.push(checkbox.getAttribute('data-id'));
        });

        // Now selectedItems array contains IDs of selected items, you can proceed with checkout process
        console.log('Selected Items:', selectedItems);
    });

    document.getElementById('checkout').addEventListener('click', function() {
        var token = localStorage.getItem('authToken');
        if (!token) {
            alert('You must login first!');
            return;
        }

        var selectedItems = [];
        var checkboxes = document.querySelectorAll('.item-checkbox:checked');

        checkboxes.forEach(function(checkbox) {
            selectedItems.push(checkbox.getAttribute('id'));
        });

        var checkoutData = cart.filter(item => selectedItems.includes(item.id));

        fetch('http://127.0.0.1:8000/api/checkout', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkoutData)
        })
        .then(response => {
            if (response.ok) {
                alert('Checkout successful!');
                cart = cart.filter(item => !selectedItems.includes(item.id));
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            } else {
                alert('Checkout failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error during checkout:', error);
            alert('An error occurred during checkout. Please try again later.');
        });
    });

    renderCart();
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
