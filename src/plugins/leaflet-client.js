// This plugin ensures Leaflet is only loaded on the client side
export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client-side
  if (process.client) {
    // Import Leaflet CSS
    import('leaflet/dist/leaflet.css');
    import('~/assets/css/leaflet-custom.css');
    
    console.log('Leaflet CSS loaded on client-side');
  }
});
