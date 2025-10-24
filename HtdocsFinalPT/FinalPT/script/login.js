$(document).ready(function() {
  $("#login").click((e)=> {

    console.log("hello world");
    
    const username = $("#username").val()
    const password = $("#password").val()

    $.ajax({
      url: "../database/login.php",
      type: "POST",
      data: {
        username,
        password
      },
      success: function(response) {
        try {
          const res = JSON.parse(response);

          if (res.success) {
            $("#message").css("color", "green").text(res.message);

            if (res.role === "admin") {
              window.location.href = "../admin/admin.php";
            } else if (res.role === "user") {
              window.location.href = "../pages/userPages/home.html";
            } else if (res.role === "driver"){
              window.location.href = "../pages/driverPages/driverHome.html";
            }
          } else {
            $("#message").css("color", "red").text(res.message);
          }
        } catch (err) {
          console.error("Invalid JSON:", response);
          $("#message").text("Server error. Check console.");
        }
      },
      error: function() {
        alert("Error connecting to server");
      }
    });
  });
});
