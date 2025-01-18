<template>
  <GenericPanel />
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
