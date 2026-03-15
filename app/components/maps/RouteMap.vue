<template>
  <div class="route-map-root">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps({
  waypoints: { type: Array, default: () => [] },
  center: { type: Array, default: null }
})

const mapContainer = ref(null)
let map = null
let markers = []
let L = null

function getCenterArray() {
  var c = props.center
  if (!c) return [41.3851, 2.1734]
  if (Array.isArray(c) && c.length >= 2) return [Number(c[0]) || 41.3851, Number(c[1]) || 2.1734]
  if (typeof c === 'string') {
    var parts = c.split(',')
    if (parts.length >= 2) return [Number(parts[0]) || 41.3851, Number(parts[1]) || 2.1734]
  }
  return [41.3851, 2.1734]
}

function invalidateSize() {
  if (map) {
    map.invalidateSize()
    updateMarkers(L)
  }
}

function handleResize() {
  invalidateSize()
}

onMounted(async () => {
  if (!process.client) return
  L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')

  nextTick(function () {
    setTimeout(function () {
      if (!mapContainer.value) return
      var viewCenter = getCenterArray()
      map = L.map(mapContainer.value).setView(viewCenter, 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      updateMarkers(L)
      window.addEventListener('resize', handleResize)
    }, 100)
  })
})

defineExpose({ invalidateSize })

function updateMarkers(L) {
  if (!map) return

  var layersToRemove = []
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      layersToRemove.push(layer)
    }
  })
  for (var i = 0; i < layersToRemove.length; i++) {
    map.removeLayer(layersToRemove[i])
  }
  markers = []
  var latlngs = []
  var centerArr = getCenterArray()

  if (centerArr && centerArr.length >= 2) {
    latlngs.push(centerArr)
    L.marker(centerArr, {
      icon: L.divIcon({
        className: 'origin-marker',
        html: '<div style="background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
        iconSize: [12, 12]
      })
    }).bindPopup('<b>Origen</b><br>La teva ubicació').addTo(map)
  }

  if (props.waypoints && Array.isArray(props.waypoints) && props.waypoints.length > 0) {
    for (var w = 0; w < props.waypoints.length; w++) {
      var wp = props.waypoints[w]
      var lat = wp.lat !== undefined && wp.lat !== null ? wp.lat : wp.latitude
      var lng = wp.lng !== undefined && wp.lng !== null ? wp.lng : wp.longitude
      var pos = [Number(lat) || 0, Number(lng) || 0]
      latlngs.push(pos)
      var titol = wp.title || wp.name || wp.titol || ('Parada ' + (w + 1))
      var desc = wp.description || wp.descripcio || ''
      var marker = L.marker(pos)
        .bindPopup('<b>' + titol + '</b><br>' + desc)
        .addTo(map)
      markers.push(marker)
    }

    if (latlngs.length > 1) {
      L.polyline(latlngs, {
        color: '#10b981',
        weight: 4,
        opacity: 0.8,
        lineJoin: 'round'
      }).addTo(map)
    }

    var group = L.featureGroup(markers)
    map.fitBounds(group.getBounds().pad(0.2))
  }
}

watch(function () { return props.waypoints }, function () {
  if (process.client && map && L) {
    updateMarkers(L)
  }
}, { deep: true })

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('resize', handleResize)
  }
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.route-map-root {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: block;
}

.map-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: block;
  border-radius: 8px;
  z-index: 0;
}
</style>
