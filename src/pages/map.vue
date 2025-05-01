# pages/map.vue
<template>
  <div class="relative">
    <!-- Map Container -->
    <div class="absolute top-[64px] h-[calc(100vh-64px)] w-full">
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

    <!-- Sidebar -->
    <div
      class="fixed right-0 top-[64px] h-[calc(100vh-64px)] w-1/3 transform bg-white shadow-lg transition-transform duration-300 ease-in-out z-[1000]"
      :class="{'translate-x-0': isSidebarOpen, 'translate-x-full': !isSidebarOpen}"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between border-b border-gray-200 px-5 py-1 pr-2">
        <h2 class="text-lg font-semibold">{{ selectedFeature?.properties.name }}</h2>
        <button
          @click="closeSidebar"
          class="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Tabs Navigation -->
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            class="flex-1 px-4 py-2 text-sm font-medium text-center"
            :class="{
              'border-b-2 border-blue-500 text-blue-600': currentTab === tab.id,
              'text-gray-500 hover:text-gray-700': currentTab !== tab.id
            }"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-4 overflow-y-auto h-[calc(100%-100px)]">
        <!-- Info Tab -->
        <div v-if="currentTab === 'info' && selectedFeature" class="space-y-4">
          <div v-for="(value, key) in selectedFeature.properties" :key="key" class="border-b pb-2">
            <h3 class="text-sm font-medium text-gray-500 capitalize">{{ key }}</h3>
            <p class="mt-1 text-gray-900">{{ value || 'N/A' }}</p>
          </div>
        </div>

        <!-- References Tab -->
        <div v-if="currentTab === 'references'" class="space-y-4">
          <div v-if="selectedFeature?.properties.references?.length" class="space-y-4">
            <div v-for="(reference, index) in selectedFeature.properties.references" :key="index" class="border-b pb-3">
              <h3 class="font-medium">{{ reference.title }}</h3>
              <p class="text-sm text-gray-600">{{ reference.content }}</p>
            </div>
          </div>
          <p v-else class="text-gray-500">No references available</p>
        </div>

        <!-- Media Tab -->
        <div v-if="currentTab === 'media'" class="space-y-4">
          <div v-if="selectedFeature?.properties.media?.length" class="space-y-4">
            <div v-for="(item, index) in selectedFeature.properties.media" :key="index" class="border-b pb-3">
              <h3 class="font-medium">{{ item.title }}</h3>
              <p class="text-sm text-gray-600 mb-2">{{ item.content }}</p>

              <!-- YouTube Embed -->
              <div v-if="isYouTubeUrl(item.media_url)" class="aspect-video w-full">
                <iframe
                  class="w-full h-full rounded-lg"
                  :src="getYouTubeEmbedUrl(item.media_url)"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
                </iframe>
              </div>

              <!-- Regular Image -->
              <img
                v-else-if="item.media_url"
                :src="item.media_url"
                alt="Media"
                class="w-full rounded-lg"
              >
            </div>
          </div>
          <p v-else class="text-gray-500">No media available</p>
        </div>

        <!-- Comments Tab -->
        <div v-if="currentTab === 'comments'" class="space-y-4">
          <div v-if="selectedFeature?.properties.comments?.length" class="space-y-4">
            <div v-for="(comment, index) in selectedFeature.properties.comments" :key="index" class="border-b pb-3">
              <h3 class="font-medium">{{ comment.title }}</h3>
              <p class="text-sm text-gray-600">{{ comment.content }}</p>
            </div>
          </div>
          <p v-else class="text-gray-500">No comments available</p>
        </div>

        <!-- No Feature Selected Message -->
        <div v-if="!selectedFeature" class="text-gray-500">
          Select a feature to view details
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// Leaflet will be imported only on client-side in the onMounted hook

const zoom = ref(6);
const center = ref([47.21322, -1.559482]);
const geoJsonData = ref(null);
const mapRef = ref(null);
const geoJsonRef = ref(null);
const isSidebarOpen = ref(false);
const selectedFeature = ref(null);

const currentTab = ref('info');
const tabs = [
  { id: 'info', name: 'Info' },
  { id: 'references', name: 'References' },
  { id: 'media', name: 'Media' },
  { id: 'comments', name: 'Comments' },
];

// Define GeoJSON options
const geoJsonOptions = {
  style: (feature) => ({
    fillColor: '#3388ff',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  }),
  onEachFeature: (feature, layer) => {
    layer.on('click', async (e) => {
      // Show loading state
      selectedFeature.value = { properties: { name: 'Loading...' } };
      isSidebarOpen.value = true;

      // Fetch detailed data for this specific feature
      await fetchFeatureDetails(feature.properties.id);

      e.originalEvent.stopPropagation();
    });
  },
};

const openSidebar = () => {
  console.log('Opening sidebar');
  isSidebarOpen.value = true;
};

const closeSidebar = () => {
  console.log('Closing sidebar');
  isSidebarOpen.value = false;
  selectedFeature.value = null;
};

const fitMapToBounds = () => {
  if (mapRef.value && geoJsonRef.value) {
    const leafletMap = mapRef.value.leafletObject;
    const geoJsonLayer = geoJsonRef.value.leafletObject;
    const bounds = geoJsonLayer.getBounds();
    leafletMap.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 16,
    });
  }
};

const fetchGeoJson = async () => {
  try {
    const response = await fetch('http://localhost:9090/api/v1/locations');
    const data = await response.json();
    console.log('GeoJSON data:', data); // Debug log
    geoJsonData.value = data;
  } catch (error) {
    console.error('Error fetching GeoJSON:', error);
  }
};

const onGeoJsonReady = () => {
  console.log('GeoJSON layer ready');
  fitMapToBounds();
};

const onMapReady = async (mapInstance) => {
  console.log('Map is ready');

  // Import Leaflet icons configuration only when the map is ready (client-side)
  if (typeof window !== 'undefined') {
    try {
      // Dynamically import the Leaflet icons configuration
      await import('~/utils/leaflet-icons');
      console.log('Leaflet icons configured successfully');
    } catch (error) {
      console.error('Failed to configure Leaflet icons:', error);
    }
  }

  fetchGeoJson();
};

// Add a new function to fetch feature details
const fetchFeatureDetails = async (featureId) => {
  try {
    // Fetch the location details
    const locationResponse = await fetch(`http://localhost:9090/api/v1/locations/${featureId}`);
    const locationData = await locationResponse.json();

    // Create a base feature object
    const detailedFeature = {
      type: 'Feature',
      geometry: locationData.geometry || { type: 'Point', coordinates: [locationData.longitude, locationData.latitude] },
      properties: {
        ...locationData,
        references: [],
        media: [],
        comments: [],
      },
    };

    // Fetch references
    const referencesResponse = await fetch(
      `http://localhost:9090/api/v1/resources?resource_type=reference&shape_id=${featureId}`,
    );
    detailedFeature.properties.references = await referencesResponse.json() || [];

    // Fetch media
    const mediaResponse = await fetch(
      `http://localhost:9090/api/v1/resources?resource_type=media&shape_id=${featureId}`,
    );
    detailedFeature.properties.media = await mediaResponse.json() || [];

    // Fetch comments
    const commentsResponse = await fetch(
      `http://localhost:9090/api/v1/resources?resource_type=comment&shape_id=${featureId}`,
    );
    detailedFeature.properties.comments = await commentsResponse.json() || [];

    // Update the selected feature with all the data
    selectedFeature.value = detailedFeature;
  } catch (error) {
    console.error('Error fetching feature details:', error);
    selectedFeature.value = { properties: { name: 'Error loading data', error: error.message } };
  }
};

// Helper function to check if a URL is a YouTube URL
const isYouTubeUrl = (url) => {
  if (!url) return false;

  // Match various YouTube URL formats
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
  return youtubeRegex.test(url);
};

// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';

  // Extract video ID from various YouTube URL formats
  let videoId = '';

  // youtu.be format
  if (url.includes('youtu.be')) {
    videoId = url.split('/').pop().split('?')[0];
  }
  // youtube.com/watch?v= format
  else if (url.includes('watch?v=')) {
    videoId = new URL(url).searchParams.get('v');
  }
  // youtube.com/embed/ format
  else if (url.includes('/embed/')) {
    videoId = url.split('/embed/')[1].split('?')[0];
  }

  // Return embed URL with additional parameters for better embedding
  return `https://www.youtube.com/embed/${videoId}?rel=0`;
};
</script>

<style>
.leaflet-container {
  height: 100%;
  width: 100%;
}
</style>
