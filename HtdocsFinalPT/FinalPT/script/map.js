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

  let markers = [];
  let routingControl = null;
  let endBtn; 

  let cityLayer;
  let highlightLayer = null;

  Promise.all([
  $.getJSON('../../data/negros_cities.geojson')
]).then(([citiesData]) => {
  // --- City Layer (polygon only, no markers)
  cityLayer = L.geoJSON(citiesData, {
    style: { color: '#777', weight: 1, fillOpacity: 0 },
    pointToLayer: () => null // prevent automatic markers for Point geometries
  }).addTo(map);

  // --- Barangay Layer (load later when needed)
  barangayLayer = L.geoJSON(null, {
    style: { color: '#aaa', weight: 1, fillOpacity: 0 },
    pointToLayer: () => null, // prevent markers
    onEachFeature: (feature, layer) => {
      layer.bindPopup(feature.properties.name);
    }
  }).addTo(map);

  // --- City Search Control (no markers)
  const citySearch = new L.Control.Search({
    layer: cityLayer,
    propertyName: 'name',
    marker: false, // ensures no search result marker
    moveToLocation: (latlng, title, map) => {
      map.setView(latlng, 12);
    }
  })
  .on('search:locationfound', (e) => {
    // Remove previous highlight
    if (highlightLayer) map.removeLayer(highlightLayer);

    // Highlight the selected city
    highlightLayer = L.geoJSON(e.layer.feature, {
      style: { color: 'blue', weight: 3, fillOpacity: 0.1 }
    }).addTo(map);

    selectedCity = e.layer.feature.properties.name;
    $('#barangaySearch').prop('disabled', false); // enable barangay search
  });

  map.addControl(citySearch);
});

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

    // Route Button
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

      // Create routing control
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
        routesList = [];
        markers = [];
        endBtn.remove();
      };      

      routingControl.on('routesfound', function(e) {
        const routes = e.routes;
        
        if (!routingControl._routes || routingControl._routes.length === 0) return;
      });

      // Detect when route is cleared/ended manually
      routingControl.on('waypointschanged', function (e) {
        const activeWaypoints = e.waypoints.filter(w => w.latLng);
        if (activeWaypoints.length === 0) {
          
          endBtn?.remove();
        }
      });
    };

    return div;
  };

  customControl.addTo(map);

  // Map click: place markers
  map.on("click", function (e) {
    if ($(e.originalEvent.target).closest(".leaflet-control").length > 0) return;

    var lat = e.latlng.lat.toFixed(6);
    var lng = e.latlng.lng.toFixed(6);

    if (markers.length === 2) {
      map.removeLayer(markers[0]);
      markers = markers.slice(1);
    }

    var marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    console.log(lat, lng);
    
    markers.push(marker);
  });


 $("#submit").click(() => {


  const modal = new bootstrap.Modal(document.getElementById('responseModal'));
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');

  const pickUp = $("#pickUp").val().trim();
  const destination = $("#delivery").val().trim();
  const description = $("#description").val().trim();
  const date = $("#date").val();
  const time = $("#time").val()

  if (!markers[0] || !markers[1]) {
    modalTitle.classList.remove('text-success');
    modalTitle.textContent = 'Markers';
    modalTitle.classList.add('text-danger');
    modalMessage.textContent = 'Please set both pick-up and destination markers on the map.';

      modal.show();
    
    
    return;
  }

  const pickUpLat = markers[0].getLatLng().lat;
  const pickUpLng = markers[0].getLatLng().lng;
  const destinationLat = markers[1].getLatLng().lat;
  const destinationLng = markers[1].getLatLng().lng;

  if (!pickUp || !destination || !description || !date) {
    modalTitle.classList.remove('text-success');
    modalTitle.textContent = 'Fields';
    modalTitle.classList.add('text-danger');
    modalMessage.textContent = 'Please fill out all required fields!';
    
    modal.show();
    return;
  }

  $.ajax({
    url: "../../database/book.php",
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
      time
    },
    success: (res) => {
      const modal = new bootstrap.Modal(document.getElementById('responseModal'));
      const modalTitle = document.getElementById('modalTitle');
      const modalMessage = document.getElementById('modalMessage');

      modalTitle.classList.remove('text-danger', 'text-success');

      if (res.status === 'success') {
        modalTitle.textContent = 'Success';
        modalTitle.classList.add('text-success');
        modalMessage.textContent = res.message;
        $('#bookingForm')[0].reset();
      } else {
        modalTitle.textContent = 'Error';
        modalTitle.classList.add('text-danger');
        modalMessage.textContent = res.message;
      }

      modal.show();
    },
    error: (xhr, status, error) => {
      const modal = new bootstrap.Modal(document.getElementById('responseModal'));
      const modalTitle = document.getElementById('modalTitle');
      const modalMessage = document.getElementById('modalMessage');

      modalTitle.classList.remove('text-success');
      modalTitle.textContent = '⚠️ Server Error';
      modalTitle.classList.add('text-danger');
      modalMessage.textContent = 'Failed to connect to the server. Please try again.';

      modal.show();
    }
  });
});


});