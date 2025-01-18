<template>
  <div class="hero min-h-screen bg-base-200">
    <div style="height: 100%; width: 100vw">
      <ClientOnly>
        <LMap
          v-model:zoom="zoom"
          :center="center"
          :use-global-leaflet="false"
          @ready="onMapReady"
          ref="mapRef"
        >
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            layer-type="base"
            name="OpenStreetMap"
          />
          <LGeoJson
            v-if="geoJsonData"
            :geojson="geoJsonData"
            :options="geoJsonOptions"
            ref="geoJsonRef"
            @ready="onGeoJsonReady"
          />
        </LMap>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const zoom = ref(6);
const center = ref([47.21322, -1.559482]);
const geoJsonData = ref(null);
const mapRef = ref(null);
const geoJsonRef = ref(null);

const geoJsonOptions = ref({
  style: (feature) => ({
    fillColor: '#3388ff',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  }),
  onEachFeature: (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }
  },
});

// Function to fit bounds
const fitMapToBounds = () => {
  if (mapRef.value && geoJsonRef.value) {
    const leafletMap = mapRef.value.leafletObject;
    const geoJsonLayer = geoJsonRef.value.leafletObject;

    // Get bounds of GeoJSON layer
    const bounds = geoJsonLayer.getBounds();

    // Fit the map to those bounds with some padding
    leafletMap.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 16,
    });
  }
};

// Fetch GeoJSON data
const fetchGeoJson = async () => {
  try {
    const response = await fetch('http://localhost:9090/api/v1/locations');
    const data = await response.json();
    geoJsonData.value = data;
  } catch (error) {
    console.error('Error fetching GeoJSON:', error);
  }
};

// Handle GeoJSON layer ready event
const onGeoJsonReady = () => {
  fitMapToBounds();
};

const onMapReady = (mapInstance) => {
  console.log('Map is ready', mapInstance);
  fetchGeoJson(); // Fetch data when map is ready
};
</script>

<style scoped>
.hero {
  position: relative;
}
</style>
