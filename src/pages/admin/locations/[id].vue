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
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click.prevent="currentTab = tab.name"
            :class="[
              currentTab === tab.name
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <!-- Info Tab -->
          <div v-if="currentTab === 'info'" class="space-y-6">
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

          <!-- References Tab -->
          <div v-if="currentTab === 'references'" class="space-y-6">
            <div v-for="(reference, index) in location.properties.references" :key="index" class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium">Reference {{ index + 1 }}</h3>
                <button @click.prevent="removeItem('references', index)" class="text-red-600 hover:text-red-800">
                  Remove
                </button>
              </div>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    v-model="reference.title"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    v-model="reference.description"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <button
              @click.prevent="addItem('references')"
              class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Add Reference
            </button>
          </div>

          <!-- Media Tab -->
          <div v-if="currentTab === 'media'" class="space-y-6">
            <div v-for="(media, index) in location.properties.media" :key="index" class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium">Media {{ index + 1 }}</h3>
                <button @click.prevent="removeItem('media', index)" class="text-red-600 hover:text-red-800">
                  Remove
                </button>
              </div>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    v-model="media.title"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700">Media Type</label>
                  <select
                    v-model="media.type"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="document">Document</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Upload File</label>
                  <input
                    type="file"
                    @change="handleFileUpload($event, index)"
                    class="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                  <p v-if="media.file" class="mt-2 text-sm text-gray-500">
                    Current file: {{ media.file.name }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    v-model="media.description"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <button
              @click.prevent="addItem('media')"
              class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Add Media
            </button>
          </div>

          <!-- Comments Tab -->
          <div v-if="currentTab === 'comments'" class="space-y-6">
            <div v-for="(comment, index) in location.properties.comments" :key="index" class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium">Comment {{ index + 1 }}</h3>
                <button @click.prevent="removeItem('comments', index)" class="text-red-600 hover:text-red-800">
                  Remove
                </button>
              </div>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    v-model="comment.title"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    v-model="comment.description"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <button
              @click.prevent="addItem('comments')"
              class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Add Comment
            </button>
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

// Tab configuration
const tabs = [
  { name: 'info', label: 'Info' },
  { name: 'references', label: 'References' },
  { name: 'media', label: 'Media' },
  { name: 'comments', label: 'Comments' },
];
const currentTab = ref('info');

// Initialize location data with new properties
const location = ref({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [0, 0],
  },
  properties: {
    name: '',
    description: '',
    references: [],
    media: [],
    comments: [],
  },
});

// Methods for managing repeatable fields
const addItem = (section) => {
  if (section === 'media') {
    location.value.properties[section].push({
      title: '',
      description: '',
      type: 'image', // default type
      file: null,
      url: '' // to store the uploaded file URL
    });
  } else {
    location.value.properties[section].push({
      title: '',
      description: ''
    });
  }
};

const removeItem = (section, index) => {
  location.value.properties[section].splice(index, 1);
};

// Existing computed property for additional properties JSON
const propertiesJson = computed({
  get() {
    const props = { ...location.value?.properties };
    if (!props) return '{}';
    
    delete props.name;
    delete props.description;
    delete props.references;
    delete props.media;
    delete props.comments;
    return JSON.stringify(props, null, 2);
  },
  set(value) {  
    try {
      const parsed = JSON.parse(value);
      location.value.properties = {
        name: location.value.properties?.name || '',
        description: location.value.properties?.description || '',
        references: location.value.properties?.references || [],
        media: location.value.properties?.media || [],
        comments: location.value.properties?.comments || [],
        ...parsed,
      };
    } catch (e) {
      console.error('Invalid JSON');
    }
  },
});

// Fetch location
const fetchLocation = async () => {
  try {
    const response = await fetch(`http://localhost:9090/api/v1/locations/${route.params.id}`);
    const data = await response.json();
    
    // Map the server response to our GeoJSON structure
    location.value = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [data.longitude || 0, data.latitude || 0],
      },
      properties: {
        name: data.name || '',
        description: '',  // Server doesn't provide this yet
        verses: data.verses || '',
        prophet: data.prophet || '',
        timeline: data.timeline || '',
        references: location.value.properties.references || [],
        media: location.value.properties.media || [],
        comments: location.value.properties.comments || [],
      }
    };
  } catch (error) {
    console.error('Error fetching location:', error);
  }
};

// Save location
const saveLocation = async () => {
  try {
    // Create the server-format data
    const serverData = {
      ID: route.params.id,
      name: location.value.properties.name,
      latitude: location.value.geometry.coordinates[1],
      longitude: location.value.geometry.coordinates[0],
      verses: location.value.properties.verses || '',
      prophet: location.value.properties.prophet || '',
      timeline: location.value.properties.timeline || '',
      // Add any other fields the server expects
    };

    // Handle file uploads if present
    const hasFiles = location.value.properties.media.some(media => media.file);
    
    if (hasFiles) {
      const formData = new FormData();
      formData.append('location', JSON.stringify(serverData));
      
      // Add files to FormData
      location.value.properties.media.forEach((media, index) => {
        if (media.file) {
          formData.append(`media_${index}`, media.file);
        }
      });
      
      await fetch(`http://localhost:9090/api/v1/locations/${route.params.id}`, {
        method: 'PUT',
        body: formData
      });
    } else {
      await fetch(`http://localhost:9090/api/v1/locations/${route.params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverData),
      });
    }
    
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

// Handle file upload
const handleFileUpload = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    location.value.properties.media[index].file = file;
    // You might want to generate a preview URL for images
    if (file.type.startsWith('image/')) {
      location.value.properties.media[index].url = URL.createObjectURL(file);
    }
  }
};

definePageMeta({
  layout: 'admin',
});
</script>
