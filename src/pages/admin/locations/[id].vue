<template>
  <div>
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Edit Location
        </h2>
      </div>
    </div>

    <form @submit.prevent="saveLocation" class="mt-8 space-y-6">
      <!-- Basic Information -->
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-4">
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <div class="mt-1">
                <input
                  type="text"
                  id="name"
                  v-model="location.properties.name"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div class="sm:col-span-6">
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <div class="mt-1">
                <textarea
                  id="description"
                  v-model="location.properties.description"
                  rows="3"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- Coordinates -->
            <div class="sm:col-span-3">
              <label for="latitude" class="block text-sm font-medium text-gray-700">Latitude</label>
              <div class="mt-1">
                <input
                  type="number"
                  step="any"
                  id="latitude"
                  v-model.number="location.geometry.coordinates[1]"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="longitude" class="block text-sm font-medium text-gray-700">Longitude</label>
              <div class="mt-1">
                <input
                  type="number"
                  step="any"
                  id="longitude"
                  v-model.number="location.geometry.coordinates[0]"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- Additional Properties -->
            <div class="sm:col-span-6">
              <label for="properties" class="block text-sm font-medium text-gray-700">Additional Properties</label>
              <div class="mt-1">
                <textarea
                  id="properties"
                  v-model="propertiesJson"
                  rows="10"
                  class="font-mono block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <p class="mt-2 text-sm text-gray-500">Edit additional properties in JSON format</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3">
        <NuxtLink
          to="/admin/locations"
          class="rounded-md bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

// Initialize location data
const location = ref({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [0, 0],
  },
  properties: {
    name: '',
    description: '',
  },
});

// Computed property for additional properties JSON
const propertiesJson = computed({
  get () {
    const props = { ...location.value.properties };
    delete props.name;
    delete props.description;
    return JSON.stringify(props, null, 2);
  },
  set (value) {
    try {
      const parsed = JSON.parse(value);
      location.value.properties = {
        name: location.value.properties.name,
        description: location.value.properties.description,
        ...parsed,
      };
    } catch (e) {
      console.error('Invalid JSON');
    }
  },
});

// Fetch location data
const fetchLocation = async () => {
  try {
    const response = await fetch(`http://localhost:9090/api/v1/locations/${route.params.id}`);
    const data = await response.json();
    location.value = data;
  } catch (error) {
    console.error('Error fetching location:', error);
  }
};

// Save location
const saveLocation = async () => {
  try {
    await fetch(`http://localhost:9090/api/v1/locations/${route.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location.value),
    });
    router.push('/admin/locations');
  } catch (error) {
    console.error('Error saving location:', error);
  }
};

// Fetch data on mount if editing existing location
onMounted(() => {
  if (route.params.id !== 'create') {
    fetchLocation();
  }
});
definePageMeta({
  layout: 'admin',
});
</script>
