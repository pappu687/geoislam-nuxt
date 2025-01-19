<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-xl">
        <h1 data-aos="fade-down" class="text-4xl md:text-7xl font-bold mb-6">GeoIslam</h1>
        <p data-aos="fade-down" data-aos-delay="300" class="md:text-lg mb-6">Discover the Geography of Islamic History. Explore significant events and locations through an interactive map that brings the past to life.</p>

          <NuxtLink
              data-aos="fade-down"
              data-aos-delay="600"
              class="btn btn-sm md:btn-md btn-primary"
              to="/map">
              Explore
          </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import { definePageMeta } from '#imports';
import GenericPanel from '~/components/commons/GenericPanel';

export default {
  components: {
    GenericPanel,
  },

  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        path: '/',
        redirect: '/map',
      });
    },
  },

  setup () {
    definePageMeta({
      layout: 'default',
    });
  },
};
</script>
