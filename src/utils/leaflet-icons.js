// This file should only be imported on the client side
// Check if we're in a browser environment before importing Leaflet
let L = null;

// Only execute this code in the browser
if (typeof window !== 'undefined') {
  // Dynamically import Leaflet
  L = require('leaflet');

  // Fix Leaflet's default icon path issues with bundlers
  delete L.Icon.Default.prototype._getIconUrl;

  // Set default icon paths manually
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

export default L;
