<template>
  <div data-theme="autumn">
    <div class="navbar fixed bg-base-100 z-40 shadow-sm">
      <div class="navbar-start">
        <NuxtLink class="btn btn-ghost md:text-xl" href="/">GeoIslam</NuxtLink>
      </div>
      <div class="navbar-center hidden lg:flex">
        <!-- Middle part, may be logo-->
      </div>
      <div class="navbar-end pe-4">
        <NuxtLink
            class="btn btn-sm md:btn-sm btn-primary"
            href="/admin/locations"

          >
            Admin
        </NuxtLink>
      </div>
    </div>
    <slot />
  </div>
</template>
