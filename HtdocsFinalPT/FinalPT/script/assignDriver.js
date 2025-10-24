$(document).ready(() => {
  // ✅ Get ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    console.error("❌ Missing ID in URL");
    return;
  }

  // ✅ Initialize map
  const map = L.map("map").setView([10.669644, 122.948844], 17);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  // ✅ Fetch location data
  $.ajax({
    url: "../../admin/fetchRoute.php",
    type: "GET",
    data: { id: id },
    dataType: "json",
    success: (res) => {
      if (res.status === "success") {
        console.log("✅ Data retrieved:", res.data);

        const pickupLat = parseFloat(res.data.pickuplat);
        const pickupLng = parseFloat(res.data.pickuplng);
        const destinationLat = parseFloat(res.data.destinationlat);
        const destinationLng = parseFloat(res.data.destinationlng);
        const price = res.data.price;
        const firstName = res.data.fname;
        const lastName = res.data.lname;
        const number = res.data.number;
        const city = res.data.city;
        const brgy = res.data.brgy;

        $("#firstname").val(firstName);
        $("#lastname").val(lastName);
        $("#number").val(number);
        $("#city").val(city);
        $("#brgy").val(brgy);

        if(price){$("#price").val(price);}

        if (
          !isNaN(pickupLat) &&
          !isNaN(pickupLng) &&
          !isNaN(destinationLat) &&
          !isNaN(destinationLng)
        ) {
          const markers = [
            L.latLng(pickupLat, pickupLng),
            L.latLng(destinationLat, destinationLng)
          ];

          map.fitBounds([markers[0], markers[1]]);
          L.marker(markers[0]).addTo(map).bindPopup("Pickup").openPopup();
          L.marker(markers[1]).addTo(map).bindPopup("Destination");

          L.Routing.control({
            waypoints: markers,
            routeWhileDragging: true,
          }).addTo(map);
        } else {
          console.warn("⚠️ Invalid coordinates in database:", res.data);
        }
      } else {
        console.warn("⚠️ " + res.message);
      }
    },
    error: (xhr, status, error) => {
      console.error("❌ Server error:", error);
    }
  });

  // ✅ PRICE FIELD VALIDATION
  const $price = $('#price');

  if (!$price.val()) {
    $price.val('0.00');
  }

  $price.on('input', function() {
    let val = $(this).val();
    val = val.replace(/[^0-9.]/g, '');
    const parts = val.split('.');

    if (parts.length > 2) {
      val = parts[0] + '.' + parts[1];
    }
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
      val = parts.join('.');
    }

    $(this).val(val);
  });

  $price.on('blur', function() {
    let val = $(this).val();
    if (val === '' || isNaN(val)) {
      val = '0.00';
    } else {
      val = parseFloat(val).toFixed(2);
    }
    $(this).val(val);
  });

  var driverid;

  $.ajax({
    url: "../../admin/fetchCurrentDriver.php",
    type: "GET",
    dataType: 'json',
    data: { id: id },
    cache: false,
    success: (response) => {
      console.log("Full Response:", response);

      if (response.status === "success") {
        $("#driver").val(response.data.fname);

      } else {
        console.error("Server reported an application error:", response.error);
        alert("Retrieving data error: " + (response.error || "Unknown Application Error"));
      }
    },
    error: (xhr, status, error) => {
      const rawResponse = xhr.responseText.trim();

      console.error("AJAX Error Details:", {
        httpStatus: xhr.status,
        jQueryStatus: status,
        errorText: error,
        rawResponse: rawResponse.substring(0, 100) + '...'
      });

      if (status === "parsererror") {
        alert("Parsing Error! Response is corrupted. Check PHP files for stray output or errors.");
      } else {
        alert(`Server Error occurred! Status: ${xhr.status} (${error})`);
      }
    }
  });

  // ✅ FETCH DRIVERS AND HANDLE SELECTION
  $.ajax({
    url: "../../admin/fetchDriver.php",
    type: "GET",
    dataType: 'json',
    cache: false,
    success: (response) => {
      console.log("Full Response:", response);

      if (response.status === "success") {
        $("#dropdown-menu").empty();

        response.data.forEach(element => {
          const listItem = $(`
            <li><a class="dropdown-item" href="#">${element.fname}</a></li>
          `);

          // ✅ When a driver is clicked, reflect it in the input field
          listItem.find("a").on("click", function(e) {
            e.preventDefault();
            $("#driver").val(element.fname);
            driverid = element.id
          });

          $("#dropdown-menu").append(listItem);
        });

      } else {
        console.error("Server reported an application error:", response.error);
        alert("Retrieving data error: " + (response.error || "Unknown Application Error"));
      }
    },
    error: (xhr, status, error) => {
      const rawResponse = xhr.responseText.trim();

      console.error("AJAX Error Details:", {
        httpStatus: xhr.status,
        jQueryStatus: status,
        errorText: error,
        rawResponse: rawResponse.substring(0, 100) + '...'
      });

      if (status === "parsererror") {
        alert("Parsing Error! Response is corrupted. Check PHP files for stray output or errors.");
      } else {
        alert(`Server Error occurred! Status: ${xhr.status} (${error})`);
      }
    }
  });

  $("#assign").on("click", function(){
    var price = $("#price").val();
    $.ajax({
      url: '../../admin/assignDriver.php',
      type: 'POST',
      data: { driverid : driverid, 
              price : price, 
              id : id },
      dataType: 'json',
      success: function(res) {
        alert(res.message);
      },
      error: function(res) {
        console.log(res);
        
      }
    });
  });
});
