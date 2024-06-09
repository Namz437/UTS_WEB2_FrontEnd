$(document).ready(function(){
    $('#register-form').submit(function(e){
        e.preventDefault(); // Prevent the default form submission
        
        // Collect form data
        var formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            password_confirmation: $('#password_confirmation').val(),
        };
        
        // Send form data to server
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:8000/api/register',
            data: formData,
            dataType: 'json',
            encode: true
        })
        .done(function(data){
            // Handle success response
            console.log(data); // You can log the response for debugging
            // Redirect to success page or do something else
            window.location.href = 'login.html';
        })
        .fail(function(data){
            // Handle error response
            console.log(data); // You can log the error for debugging
            // Display error message to user
            $('#register-error').text(data.responseJSON.message);
        });
    });
});

