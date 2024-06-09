$(document).ready(function () {
  // URL API
  var loginUrl = "http://127.0.0.1:8000/api/login";

  // Fungsi untuk menangani kesalahan
  function handleError(jqXHR, textStatus, errorThrown) {
    console.error("Error: " + textStatus, errorThrown);
    $("#loginResult").text("Error: " + textStatus + " " + errorThrown);
  }

  // Login request
  $("#login").click(function () {
    var email = $("#email").val();
    var password = $("#password").val();
    var loginData = {
      email: email,
      password: password,
    };

    $.ajax({
      url: loginUrl,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(loginData),
      dataType: "json",
      success: function (response) {
        var token = response.data.token;
        var role = response.data.user.role;
        localStorage.setItem("authToken", token); // Simpan token di localStorage
        localStorage.setItem("userRole", role); // Simpan peran pengguna di localStorage
        $("#loginResult").text("Login successful! Token: " + token);

        if (role === "admin") {
          window.location.href = "admin.html"; // Redirect ke homepage jika admin
        } else if (role === "customer") {
          window.location.href = "detail.html"; // Redirect ke halaman berbeda jika customer
        } else {
          $("#loginResult").text("Access denied. Admins only.");
        }

        // window.location.href = "homepage.html";
      },
      error: handleError,
    });
  });
});
