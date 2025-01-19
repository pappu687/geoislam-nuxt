<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Locations</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all locations in your GeoJSON database.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <NuxtLink
          to="/admin/locations/create"
          class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Add Location
        </NuxtLink>
      </div>
    </div>

    <!-- Location List -->
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="overflow-x-auto">

</div>

        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">Name</th>
                <th scope="col" class="px-6 py-3">Type</th>
                <th scope="col" class="px-6 py-3">Coordinates</th>
                <th scope="col" class="px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
             <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" v-for="location in locations" :key="location.id">
                <td class="px-6 py-4">
                  {{ location.properties.name }}
                </td>
                <td class="px-6 py-4">
                  {{ location.geometry.type }}
                </td>
                <td class="px-6 py-4">
                  {{ formatCoordinates(location.geometry.coordinates) }}
                </td>
                <td class="px-6 py-4">
                  <NuxtLink :to="'/admin/locations/' + location.id" class="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </NuxtLink>
                  <button @click="deleteLocation(location.id)" class="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const locations = ref([]);

// Fetch locations
const fetchLocations = async () => {
  try {
    const response = await fetch('http://localhost:9090/api/v1/locations');
    const data = await response.json();
    locations.value = data.features || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
  }
};

// Format coordinates for display
const formatCoordinates = (coords) => {
  if (Array.isArray(coords)) {
    return `[${coords.map(c => Array.isArray(c) ? '...' : c.toFixed(6)).join(', ')}]`;
  }
  return '';
};

// Delete location
const deleteLocation = async (id) => {
  if (!confirm('Are you sure you want to delete this location?')) return;

  try {
    await fetch(`http://localhost:9090/api/v1/locations/${id}`, {
      method: 'DELETE',
    });
    await fetchLocations(); // Refresh the list
  } catch (error) {
    console.error('Error deleting location:', error);
  }
};

// Fetch locations on mount
onMounted(() => {
  fetchLocations();
});

definePageMeta({
  layout: 'admin',
});
</script>
