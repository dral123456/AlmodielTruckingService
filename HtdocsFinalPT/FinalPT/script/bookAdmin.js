$(document).ready(function () {
  const map = L.map('map', {
    center: [10.668638, 122.957611],
    zoom: 12,
    minZoom: 10,
    maxBounds: [
      [8.958454, 122.178955],
      [11.102477, 123.755493]
    ],
    maxBoundsViscosity: 1.0
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  let markers = [];
  let routingControl = null;
  let endBtn;
  let highlightLayer = null;
  let cityLayer, barangayLayer;

  // --- Load Cities GeoJSON
  $.getJSON('../../data/negros_cities.geojson').done((citiesData) => {
    cityLayer = L.geoJSON(citiesData, {
      style: { color: '#777', weight: 1, fillOpacity: 0 },
      pointToLayer: () => null
    }).addTo(map);

    barangayLayer = L.geoJSON(null, {
      style: { color: '#aaa', weight: 1, fillOpacity: 0 },
      pointToLayer: () => null,
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties.name);
      }
    }).addTo(map);

    const citySearch = new L.Control.Search({
      layer: cityLayer,
      propertyName: 'name',
      marker: false,
      moveToLocation: (latlng, title, map) => {
        map.setView(latlng, 12);
      }
    }).on('search:locationfound', (e) => {
      if (highlightLayer) map.removeLayer(highlightLayer);
      highlightLayer = L.geoJSON(e.layer.feature, {
        style: { color: 'blue', weight: 3, fillOpacity: 0.1 }
      }).addTo(map);
      selectedCity = e.layer.feature.properties.name;
      $('#barangaySearch').prop('disabled', false);
    });

    map.addControl(citySearch);
  }).fail((err) => {
    console.error("Failed to load GeoJSON:", err);
  });

  // --- Custom Map Controls
  var customControl = L.control({ position: 'topright' });
  customControl.onAdd = function () {
    var div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    L.DomEvent.disableClickPropagation(div);

    var resetBtn = L.DomUtil.create('button', '', div);
    resetBtn.innerHTML = "Reset Zoom";
    resetBtn.style.width = "100%";
    resetBtn.onclick = function (e) {
      L.DomEvent.stopPropagation(e);
      map.setView([10.669644, 122.948844], 17);
    };

    var routeBtn = L.DomUtil.create('button', '', div);
    routeBtn.innerHTML = "Route";
    routeBtn.style.width = "100%";
    routeBtn.onclick = function (e) {
      L.DomEvent.stopPropagation(e);

      if (routingControl) {
        alert("Please end the current route first.");
        return;
      }

      if (markers.length !== 2) {
        alert("Please choose a Starting point and a Destination");
        return;
      }

      // Remove marker icons before showing routes
      markers.forEach(m => map.removeLayer(m));

      routingControl = L.Routing.control({
        waypoints: [markers[0].getLatLng(), markers[1].getLatLng()],
        routeWhileDragging: true,
      }).addTo(map);

      // Create END button
      endBtn = L.DomUtil.create('button', '', div);
      endBtn.innerHTML = "End Route";
      endBtn.style.width = "100%";
      endBtn.onclick = function (e) {
        L.DomEvent.stopPropagation(e);
        routingControl.setWaypoints([]);
        map.removeControl(routingControl);
        routingControl = null;
        markers = [];
        endBtn.remove();
      };
    };

    return div;
  };
  customControl.addTo(map);

  // --- Map Click Event for Markers
  map.on("click", function (e) {
    if ($(e.originalEvent.target).closest(".leaflet-control").length > 0) return;

    var lat = e.latlng.lat.toFixed(6);
    var lng = e.latlng.lng.toFixed(6);

    if (markers.length === 2) {
      map.removeLayer(markers[0]);
      markers = markers.slice(1);
    }

    var marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    markers.push(marker);
  });

  // --- PRICE FIELD VALIDATION
  const $price = $('#price');
  if (!$price.val()) $price.val('0.00');

  $price.on('input', function () {
    let val = $(this).val().replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts[1];
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
      val = parts.join('.');
    }
    $(this).val(val);
  });

  $price.on('blur', function () {
    let val = $(this).val();
    if (val === '' || isNaN(val)) val = '0.00';
    else val = parseFloat(val).toFixed(2);
    $(this).val(val);
  });

  // --- FETCH DRIVERS
  let driverid = null;

  $.ajax({
    url: "../../admin/fetchDriver.php",
    type: "GET",
    dataType: 'json',
    cache: false,
    success: (response) => {
      if (response.status === "success") {
        $("#dropdown-menu").empty();

        response.data.forEach(element => {
          const listItem = $(`
            <li><a class="dropdown-item" href="#">${element.fname}</a></li>
          `);

          listItem.find("a").on("click", function (e) {
            e.preventDefault();
            $("#driver").val(element.fname);
            driverid = element.id;
          });

          $("#dropdown-menu").append(listItem);
        });
      } else {
        console.error("Application error:", response.error);
        alert("Retrieving data error: " + (response.error || "Unknown Application Error"));
      }
    },
    error: (xhr, status, error) => {
      console.error("AJAX Error:", { httpStatus: xhr.status, jQueryStatus: status, errorText: error });
      alert("Server Error occurred! Status: " + xhr.status);
    }
  });

  // --- SUBMIT BOOKING
  $("#submit").click(() => {
    const modal = new bootstrap.Modal(document.getElementById('responseModal'));
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    const pickUp = $("#pickUp").val().trim();
    const destination = $("#delivery").val().trim();
    const description = $("#description").val().trim();
    const date = $("#date").val();
    const time = $("#time").val();
    const price = $("#price").val();

    if (!markers[0] || !markers[1]) {
      modalTitle.textContent = 'Markers Missing';
      modalTitle.classList.add('text-danger');
      modalMessage.textContent = 'Please set both pick-up and destination markers.';
      modal.show();
      return;
    }

    const pickUpLat = markers[0].getLatLng().lat;
    const pickUpLng = markers[0].getLatLng().lng;
    const destinationLat = markers[1].getLatLng().lat;
    const destinationLng = markers[1].getLatLng().lng;

    if (!pickUp || !destination || !description || !date) {
      modalTitle.textContent = 'Missing Fields';
      modalTitle.classList.add('text-danger');
      modalMessage.textContent = 'Please fill out all required fields.';
      modal.show();
      return;
    }

    $.ajax({
      url: "../../admin/bookAdmin.php",
      method: "POST",
      dataType: "json",
      data: {
        pickUp,
        description,
        destination,
        destinationLat,
        destinationLng,
        pickUpLat,
        pickUpLng,
        date,
        time,
        driverid,
        price
      },
      success: (res) => {
        modalTitle.classList.remove('text-danger');
        modalTitle.classList.add('text-success');
        modalTitle.textContent = res.status === 'success' ? 'Success' : 'Error';
        modalMessage.textContent = res.message;
        modal.show();

        if (res.status === 'success') $('#bookingForm')[0].reset();
      },
      error: () => {
        modalTitle.textContent = '⚠️ Server Error';
        modalTitle.classList.add('text-danger');
        modalMessage.textContent = 'Failed to connect to the server.';
        modal.show();
      }
    });
  });
});
