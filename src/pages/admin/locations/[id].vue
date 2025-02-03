<template>
  <div>
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2
          class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
        >
          Edit Location
        </h2>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
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
              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
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
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700"
                  >Name</label
                >
                <div class="mt-1">
                  <input
                    type="text"
                    id="name"
                    v-model="location.properties.name"
                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div class="sm:col-span-6">
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-700"
                  >Description</label
                >
                <div class="mt-1">
                  <textarea
                    id="description"
                    v-model="location.properties.description"
                    rows="3"
                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <!-- Coordinates -->
              <div class="sm:col-span-3">
                <label
                  for="latitude"
                  class="block text-sm font-medium text-gray-700"
                  >Latitude</label
                >
                <div class="mt-1">
                  <input
                    type="number"
                    step="any"
                    id="latitude"
                    v-model.number="location.geometry.coordinates[1]"
                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label
                  for="longitude"
                  class="block text-sm font-medium text-gray-700"
                  >Longitude</label
                >
                <div class="mt-1">
                  <input
                    type="number"
                    step="any"
                    id="longitude"
                    v-model.number="location.geometry.coordinates[0]"
                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <!-- Additional Properties -->
              <div class="sm:col-span-6">
                <label
                  for="properties"
                  class="block text-sm font-medium text-gray-700"
                  >Additional Properties</label
                >
                <div class="mt-1">
                  <textarea
                    id="properties"
                    v-model="propertiesJson"
                    rows="10"
                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <p class="mt-2 text-sm text-gray-500">
                  Edit additional properties in JSON format
                </p>
              </div>
            </div>
          </div>

          <!-- References Tab -->
          <div v-if="currentTab === 'references'" class="space-y-6">
            <div
              v-for="(reference, index) in location.properties.references"
              :key="index"
              class="space-y-4"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium">Reference {{ index + 1 }}</h3>
                <button
                  @click.prevent="removeItem('references', index)"
                  class="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Title</label
                  >
                  <input
                    type="text"
                    v-model="reference.title"
                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Description</label
                  >
                  <textarea
                    v-model="reference.description"
                    rows="3"
                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
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
            <div
              v-for="(media, index) in location.properties.media"
              :key="index"
              class="space-y-4"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium">Media {{ index + 1 }}</h3>
                <button
                  @click.prevent="removeItem('media', index)"
                  class="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Title</label
                  >
                  <input
                    type="text"
                    v-model="media.title"
                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Media Type</label
                  >
                  <select
                    v-model="media.type"
                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="document">Document</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Upload File</label
                  >
                  <input
                    type="file"
                    @change="handleFileUpload($event, index)"
                    class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <p v-if="media.file" class="mt-2 text-sm text-gray-500">
                    Current file: {{ media.file.name }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Description</label
                  >
                  <textarea
                    v-model="media.description"
                    rows="3"
                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
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
            <div
              v-for="(comment, index) in location.properties.comments"
              :key="index"
              class="space-y-4"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium">Comment {{ index + 1 }}</h3>
                <button
                  @click.prevent="removeItem('comments', index)"
                  class="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Title</label
                  >
                  <input
                    type="text"
                    v-model="comment.title"
                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Description</label
                  >
                  <textarea
                    v-model="comment.description"
                    rows="3"
                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
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
  { name: "info", label: "Info" },
  { name: "references", label: "References" },
  { name: "media", label: "Media" },
  { name: "comments", label: "Comments" },
];
const currentTab = ref("info");

// Initialize location data with new properties
const location = ref({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [0, 0],
  },
  properties: {
    name: "",
    description: "",
    references: [],
    media: [],
    comments: [],
  },
});

// Methods for managing repeatable fields
const addItem = (section) => {
  if (section === "media") {
    location.value.properties[section].push({
      id: null,
      title: "",
      description: "",
      type: "image",
      file: null,
      url: "",
    });
  } else {
    location.value.properties[section].push({
      id: null,
      title: "",
      description: "",
      type: section.slice(0, -1),
    });
  }
};

const removeItem = (section, index) => {
  deleteResource(section, index);
};

// Existing computed property for additional properties JSON
const propertiesJson = computed({
  get() {
    const props = { ...location.value?.properties };
    if (!props) return "{}";

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
        name: location.value.properties?.name || "",
        description: location.value.properties?.description || "",
        references: location.value.properties?.references || [],
        media: location.value.properties?.media || [],
        comments: location.value.properties?.comments || [],
        ...parsed,
      };
    } catch (e) {
      console.error("Invalid JSON");
    }
  },
});

// Fetch location
const fetchLocation = async () => {
  try {
    const response = await fetch(
      `http://localhost:9090/api/v1/locations/${route.params.id}`
    );
    const data = await response.json();

    // Map the server response to our GeoJSON structure
    location.value = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [data.longitude || 0, data.latitude || 0],
      },
      properties: {
        name: data.name || "",
        description: "", // Server doesn't provide this yet
        verses: data.verses || "",
        prophet: data.prophet || "",
        timeline: data.timeline || "",
        references: location.value.properties.references || [],
        media: location.value.properties.media || [],
        comments: location.value.properties.comments || [],
      },
    };
  } catch (error) {
    console.error("Error fetching location:", error);
  }
};

// Update the fetchResources function to handle error responses
const fetchResources = async () => {
  try {
    // Fetch references
    const referencesResponse = await fetch(
      `http://localhost:9090/api/v1/resources?type=reference&shape_id=${route.params.id}`
    );
    const referencesData = await referencesResponse.json();
    location.value.properties.references = Array.isArray(referencesData)
      ? referencesData.map((ref) => ({
          id: ref.ID,
          title: ref.title || "",
          description: ref.description || "",
          type: "reference",
        }))
      : [];

    // Fetch media
    const mediaResponse = await fetch(
      `http://localhost:9090/api/v1/resources?type=media&shape_id=${route.params.id}`
    );
    const mediaData = await mediaResponse.json();
    location.value.properties.media = Array.isArray(mediaData)
      ? mediaData.map((media) => ({
          id: media.ID,
          title: media.title || "",
          description: media.description || "",
          type: media.mediaType || "image",
          url: media.url || "",
          file: null,
        }))
      : [];

    // Fetch comments
    const commentsResponse = await fetch(
      `http://localhost:9090/api/v1/resources?type=comment&shape_id=${route.params.id}`
    );
    const commentsData = await commentsResponse.json();
    location.value.properties.comments = Array.isArray(commentsData)
      ? commentsData.map((comment) => ({
          id: comment.ID,
          title: comment.title || "",
          description: comment.description || "",
          type: "comment",
        }))
      : [];
  } catch (error) {
    console.error("Error fetching resources:", error);
    // Initialize empty arrays if fetch fails
    location.value.properties.references = [];
    location.value.properties.media = [];
    location.value.properties.comments = [];
  }
};

// New handleSubmit function to manage different tab submissions
const handleSubmit = async () => {
  try {
    // Save location data first
    await saveLocation();

    // Then save all resources
    await saveResources();

    router.push("/admin/locations");
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

// Update saveLocation to only handle location data
const saveLocation = async () => {
  try {
    const serverData = {
      ID: route.params.id,
      name: location.value.properties.name,
      latitude: location.value.geometry.coordinates[1],
      longitude: location.value.geometry.coordinates[0],
      verses: location.value.properties.verses || "",
      prophet: location.value.properties.prophet || "",
      timeline: location.value.properties.timeline || "",
    };

    const locationResponse = await fetch(
      `http://localhost:9090/api/v1/locations/${route.params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serverData),
      }
    );

    if (!locationResponse.ok) {
      throw new Error("Failed to save location");
    }
  } catch (error) {
    console.error("Error saving location:", error);
    throw error;
  }
};

// Update saveResources to handle all resource types
const saveResources = async () => {
  try {
    // Create arrays to track resources to create, update, and delete
    const promises = [];

    // Handle references
    for (const reference of location.value.properties.references) {
      const referenceData = {
        ID: reference.id,
        shape_id: route.params.id,
        title: reference.title,
        description: reference.description,
        type: "reference",
      };

      promises.push(
        fetch(
          `http://localhost:9090/api/v1/resources${
            reference.id ? `/${reference.id}` : ""
          }`,
          {
            method: reference.id ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(referenceData),
          }
        )
      );
    }

    // Handle media
    for (const media of location.value.properties.media) {
      const formData = new FormData();
      const mediaData = {
        ID: media.id,
        shape_id: route.params.id,
        title: media.title,
        description: media.description,
        type: "media",
        mediaType: media.type,
      };

      formData.append("data", JSON.stringify(mediaData));
      if (media.file) {
        formData.append("file", media.file);
      }

      promises.push(
        fetch(
          `http://localhost:9090/api/v1/resources${
            media.id ? `/${media.id}` : ""
          }`,
          {
            method: media.id ? "PUT" : "POST",
            body: formData,
          }
        )
      );
    }

    // Handle comments
    for (const comment of location.value.properties.comments) {
      const commentData = {
        ID: comment.id,
        shape_id: route.params.id,
        title: comment.title,
        description: comment.description,
        type: "comment",
      };

      promises.push(
        fetch(
          `http://localhost:9090/api/v1/resources${
            comment.id ? `/${comment.id}` : ""
          }`,
          {
            method: comment.id ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(commentData),
          }
        )
      );
    }

    // Wait for all resource saves to complete
    await Promise.all(promises);
  } catch (error) {
    console.error("Error saving resources:", error);
    throw error;
  }
};

// Fetch data on mount if editing existing location
onMounted(() => {
  if (route.params.id !== "create") {
    fetchLocation();
    fetchResources();
  }
});

// Handle file upload
const handleFileUpload = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    location.value.properties.media[index].file = file;
    // You might want to generate a preview URL for images
    if (file.type.startsWith("image/")) {
      location.value.properties.media[index].url = URL.createObjectURL(file);
    }
  }
};

// Delete resource
const deleteResource = async (section, index) => {
  const resource = location.value.properties[section][index];
  if (resource.id) {
    try {
      await fetch(`http://localhost:9090/api/v1/resources/${resource.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting resource:", error);
      return;
    }
  }
  location.value.properties[section].splice(index, 1);
};

definePageMeta({
  layout: "admin",
});
</script>
