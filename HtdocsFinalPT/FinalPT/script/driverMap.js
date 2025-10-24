$(document).ready(function () {
  const map = L.map('map', {
    center: [10.668638, 122.957611], // roughly central Negros Island
    zoom: 12,
    minZoom: 10,            // Prevent zooming out too far 
    maxBounds: [
      [8.958454, 122.178955],  // Southwest corner — near Sipalay
      [11.102477, 123.755493]  // Northeast corner — near Escalante/Bais
    ],
    maxBoundsViscosity: 1.0 // prevents panning out of bounds
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
    {attribution: '&copy; OpenStreetMap contributors'}).addTo(map);

  let values = [];
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    console.error("❌ Missing ID in URL");
    return;
  }

  var customControl = L.control({ position: 'topright' });
  customControl.onAdd = function () {
    var div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    L.DomEvent.disableClickPropagation(div);

    // Reset Zoom Button
    var resetBtn = L.DomUtil.create('button', '', div);
    resetBtn.innerHTML = "Reset Zoom";
    resetBtn.style.width = "100%";
    resetBtn.onclick = function (e) {
      L.DomEvent.stopPropagation(e);
      map.setView([10.669644, 122.948844], 17);
    };

    
};

  $.ajax({
    url: "../../admin/fetchRoute.php",
    type: "GET",
    data: { id: id },
    dataType: "json",
    success: (res) => {
      if (res.status === "success") {
        console.log("✅ Data retrieved:", res.data);

        // ✅ Access correct properties from res.data
        const pickupLat = parseFloat(res.data.pickuplat);
        const pickupLng = parseFloat(res.data.pickuplng);
        const destinationLat = parseFloat(res.data.destinationlat);
        const destinationLng = parseFloat(res.data.destinationlng);

        const firstName = res.data.fname
        const lastName = res.data.lname
        const number = res.data.number
        const city = res.data.city
        const brgy = res.data.brgy
        const date = res.data.date
        const time = res.data.time

        $("#firstname").val(firstName)
        $("#lastname").val(lastName)
        $("#number").val(number)
        $("#city").val(city)
        $("#brgy").val(brgy)
        $("#time").val(time)
        $("#date").val(date)

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

          // ✅ Fit map to route area
          map.fitBounds([markers[0], markers[1]]);

          // ✅ Add markers
          L.marker(markers[0]).addTo(map).bindPopup("Pickup").openPopup();
          L.marker(markers[1]).addTo(map).bindPopup("Destination");

          // ✅ Create the route
          const routingControl = L.Routing.control({
            waypoints: markers,
            routeWhileDragging: true,
          }).addTo(map);

          routingControl.on('routesfound', function(e) {
            console.log(e);
            
           /*  e.routes[0].instructions.forEach(instruction => {
              if(instruction.road === "DestinationReached"){
                values.push({id:instruction.index, label:"Destination Reached"});
              }else{
               values.push({id:instruction.index, label:instruction.type + " " + instruction.road});
              }
            }) */
            
         /*  const container = document.getElementById("checkboxContainer");
          console.log(values);
          
          values.forEach(value => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "Checkpoints";
            checkbox.id = value.id;
            checkbox.value = value.label;

            const label = document.createElement("label");
            label.htmlFor = value.id;
            label.textContent = value.label;

            container.appendChild(checkbox);
            container.appendChild(label);
            container.appendChild(document.createElement("br"));
          });  */
          });
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




 const $fill = $('#progressFill');
      const $step1 = $('#step1');
      const $step2 = $('#step2');
      const $step3 = $('#step3');
      const urlParamss = new URLSearchParams(window.location.search);

        const paramID = urlParamss.get('id');
      
      // Fetch current status from DB on load
      $.ajax({
        url: '../../database/getStatus.php',
        type: 'POST',
        data: { paramID },
        dataType: 'json',
        success: function(res) {
          if (res.status === 'Pending') {
            $step1.addClass('active');
            $fill.css('width', '0%');
          } else if (res.status === 'Transmitting') {
            $step2.addClass('active');
            $fill.css('width', '50%');
          } else if (res.status === 'Delivered') {
            $step2.addClass('completed');
            $step3.addClass('active');
            $fill.css('width', '100%');
          }
        },
        error: function() {
          alert('Error fetching status.');
        }
      });

      // Update status function
      function updateStatus(status) {
        $.ajax({
          url: '../../database/updateStatus.php',
          type: 'POST',
          data: { status, paramID },
          dataType: 'json',
          success: function(res) {
            alert(res.message);
          },
          error: function() {
            alert('Database error.');
          }
        });
      }

      $('#transmittingBtn').on('click', function() {
        $step2.addClass('active');
        $fill.css('width', '50%');
        updateStatus('Transmitting');
      });

      $('#deliveredBtn').on('click', function() {
        $step2.addClass('completed');
        $step3.addClass('active');
        $fill.css('width', '100%');
        updateStatus('Delivered');
      });



});
