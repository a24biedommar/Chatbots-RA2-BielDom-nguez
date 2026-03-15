/**
 * Crea i destrueix un mapa Leaflet dins un contenidor del modal.
 * S'ha de cridar initModalMap quan el modal és visible i destroyModalMap quan es tanca.
 */
export function useModalMap() {
  var mapInstance = null
  var L = null

  function getCenter(center) {
    if (!center) return [41.3851, 2.1734]
    if (Array.isArray(center) && center.length >= 2) {
      return [Number(center[0]) || 41.3851, Number(center[1]) || 2.1734]
    }
    if (typeof center === 'string') {
      var parts = center.split(',')
      if (parts.length >= 2) return [Number(parts[0]) || 41.3851, Number(parts[1]) || 2.1734]
    }
    return [41.3851, 2.1734]
  }

  async function initModalMap(containerEl, waypoints, center) {
    if (!process.client || !containerEl) return
    destroyModalMap()
    L = (await import('leaflet')).default
    await import('leaflet/dist/leaflet.css')

    var viewCenter = getCenter(center)
    mapInstance = L.map(containerEl).setView(viewCenter, 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapInstance)

    var latlngs = []
    if (viewCenter.length >= 2) {
      latlngs.push(viewCenter)
      L.marker(viewCenter, {
        icon: L.divIcon({
          className: 'origin-marker',
          html: '<div style="background:#10b981;width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>',
          iconSize: [12, 12]
        })
      }).bindPopup('<b>Origen</b><br>La teva ubicació').addTo(mapInstance)
    }

    var wps = waypoints || []
    var markers = []
    for (var i = 0; i < wps.length; i++) {
      var wp = wps[i]
      var lat = wp.lat !== undefined && wp.lat !== null ? wp.lat : wp.latitude
      var lng = wp.lng !== undefined && wp.lng !== null ? wp.lng : wp.longitude
      var pos = [Number(lat) || 0, Number(lng) || 0]
      latlngs.push(pos)
      var titol = wp.title || wp.name || wp.titol || ('Parada ' + (i + 1))
      var desc = wp.description || wp.descripcio || ''
      var m = L.marker(pos).bindPopup('<b>' + titol + '</b><br>' + desc).addTo(mapInstance)
      markers.push(m)
    }

    if (latlngs.length > 1) {
      L.polyline(latlngs, { color: '#10b981', weight: 4, opacity: 0.8, lineJoin: 'round' }).addTo(mapInstance)
    }
    if (markers.length > 0) {
      var group = L.featureGroup(markers)
      mapInstance.fitBounds(group.getBounds().pad(0.2))
    }
  }

  function destroyModalMap() {
    if (mapInstance) {
      mapInstance.remove()
      mapInstance = null
    }
  }

  return { initModalMap, destroyModalMap }
}
