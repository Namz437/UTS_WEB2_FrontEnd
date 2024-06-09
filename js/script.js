$(document).ready(function() {
    $('#show-products-btn').on('click', function() {
        if (!token) {
            $('#dataResult').text('You must login first!');
            return;
        }

        $.ajax({
            url: 'http://127.0.0.1:8000/api/admin/produks',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            dataType: 'json',
            success: function(response) {
                displayProducts(response.data.products);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching products:', xhr.responseJSON.message);
            }
        });
    });
});

function displayProducts(products) {
    $('#product-table-body').empty(); // Clear the table body first

    products.forEach(function(product) {
        $('#product-table-body').append(`
            <tr>
                <td>${product.id}</td>
                <td>${product.product_name}</td>
                <td>${product.description}</td>
                <td>${product.harga}</td>
                <td>${product.stok}</td>
            </tr>
        `);
    });

    $('#product-table-container').show(); // Show the table
}
