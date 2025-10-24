$(document).ready(function() {
  $("#login").click((e)=> {

    console.log("hello world");
    
    const username = $("#username").val()
    const password = $("#password").val()

    $.ajax({
      url: "../database/adminLogin.php",
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
              window.location.href = "../pages/adminPages/queuing.html";
            } else if (res.role === "user") {
              window.location.href = "../client/home.php";
            } else {
              alert("Unknown role");
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
