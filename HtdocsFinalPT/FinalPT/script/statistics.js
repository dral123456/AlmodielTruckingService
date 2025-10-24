
$(document).ready(function () {
    // Initialize map
    const map = L.map('map', {
    minZoom: 8,
    maxZoom: 13,
    }).setView([10.3, 123.0], 9); // Center of Negros Island

    // Base map layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Limit map bounds to Negros Island
    const negrosBounds = L.latLngBounds(
    L.latLng(9.0, 122.3),  // Southwest
    L.latLng(11.3, 123.6)  // Northeast
    );
    map.setMaxBounds(negrosBounds);
    map.on('drag', function() { map.panInsideBounds(negrosBounds, { animate: false }); });

    // Load GeoJSON (Negros cities) + user data
    Promise.all([
    $.getJSON("../../data/negros_cities.geojson"),
    $.getJSON("../../admin/fetchUserCounts.php")
    ]).then(([geoData, userResponse]) => {
    const counts = userResponse.data || {};

    // Color scale for density
    function getColor(d) {
        return d > 100 ? '#800026' :
                d > 50  ? '#BD0026' :
                d > 20  ? '#E31A1C' :
                d > 10  ? '#FC4E2A' :
                d > 5   ? '#FD8D3C' :
                d > 0   ? '#FEB24C' :
                        '#FFEDA0';
    }

    function style(feature) {
        const cityName = feature.properties.name || "Unknown";
        const count = counts[cityName] || 0;
        return {
        fillColor: getColor(count),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
        };
    }

    const cityLayer = L.geoJSON(geoData, {
        style: style,
        pointToLayer: () => null, // ✅ Prevent markers for Point features
        onEachFeature: function (feature, layer) {
            const cityName = feature.properties.name || "Unknown";
            const count = counts[cityName] || 0;
            layer.bindPopup(`<b>${cityName}</b><br>Users: ${count}`);
        }
        }).addTo(map);

    // Legend control
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [1, 10, 20, 50, 100];
        div.innerHTML = '<b>User Density</b><br>';

        for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(map);
    }).catch(error => {
    console.error("Error loading data:", error);
    alert("Failed to load map or user data.");
    });
});
