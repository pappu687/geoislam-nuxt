<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Admin Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex">
            <NuxtLink to="/" class="flex items-center px-4 text-gray-900">
              Home
            </NuxtLink>
            <div class="flex space-x-8">
              <NuxtLink
                to="/admin/locations"
                class="inline-flex items-center px-1 pt-0 text-sm font-medium text-gray-900"
              >
                Locations
              </NuxtLink>
              <!-- Add more admin navigation items here -->
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="py-10">
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>
