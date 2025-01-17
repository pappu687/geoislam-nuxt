<template>
  <div id="map" :style="{ height: '500px', width: '100%' }"></div>
</template>

<script>
import L from "leaflet";

export default {
  mounted() {
    // Initialize the map
    const map = L.map("map").setView([51.505, -0.09], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add a marker
    L.marker([51.505, -0.09])
      .addTo(map)
      .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      .openPopup();
  },
};
</script>
