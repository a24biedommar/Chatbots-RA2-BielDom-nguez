<template>
  <div class="chat-page-container">
    <div class="chat-content bg-light overflow-hidden">
      <div class="container-fluid h-100 d-flex flex-column p-0">
        <div v-if="saveStatus" class="save-badge-container">
          <div class="badge bg-success animate-fade-in">
            <i class="bi bi-check-circle me-1"></i> Ruta guardada correctament
          </div>
        </div>

        <div class="flex-grow-1 d-flex justify-content-center overflow-hidden">
          <!-- Chat Section -->
          <div class="col-lg-10 h-100 d-flex flex-column bg-white shadow-sm">
            <div class="card-header bg-white p-3 border-bottom d-flex align-items-center justify-content-between flex-shrink-0">
              <div class="d-flex align-items-center">
                <div class="status-indicator me-2"></div>
                <h5 class="mb-0 fw-bold">TravelBuddy Chat</h5>
              </div>
              <small class="text-secondary" v-if="coords">Ubicació activa</small>
            </div>
            <div class="flex-grow-1 overflow-hidden">
              <ChatWindow 
                :messages="activeMessages" 
                :loading="loading"
                @send="handleSendMessage"
                @view-route="handleViewRoute"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Ruta -->
    <div class="modal fade" id="routeModal" tabindex="-1" aria-labelledby="routeModalLabel" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="modal-header bg-emerald text-white border-0 py-3">
            <h5 class="modal-title fw-bold" id="routeModalLabel">
              <i class="bi bi-geo-alt-fill me-2"></i> {{ selectedRouteTitle }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-0">
            <div class="row g-0">
              <!-- Mapa lateral al modal -->
              <div class="col-lg-7">
                <div class="map-modal-container" style="height: 500px; min-height: 500px;">
                  <div ref="modalMapContainer" class="modal-map-div"></div>
                </div>
              </div>
              <!-- Detalls de la ruta -->
              <div class="col-lg-5 bg-white p-4 overflow-auto" style="max-height: 500px">
                <div class="route-details">
                  <h6 class="text-emerald fw-bold mb-3 border-bottom pb-2">Itinerari del trayecto</h6>
                  
                  <div class="timeline ps-3">
                    <div v-for="(wp, index) in selectedWaypoints" :key="index" class="timeline-item pb-4 position-relative border-start border-emerald border-2">
                      <div class="timeline-dot bg-emerald rounded-circle position-absolute" style="width: 12px; height: 12px; left: -7px; top: 0"></div>
                      <div class="ms-3">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                          <h6 class="mb-0 fw-bold">{{ wp.title || wp.name || 'Parada ' + (index + 1) }}</h6>
                          <span class="badge bg-light text-secondary border">{{ wp.duration || '—' }}</span>
                        </div>
                        <p class="text-secondary small mb-0">{{ wp.description || '—' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Info adicional -->
                  <div class="mt-4 p-3 rounded-3 bg-light border border-2 border-emerald-light">
                    <h6 class="fw-bold mb-2"><i class="bi bi-info-circle me-2 text-emerald"></i>Especificacions</h6>
                    <ul class="list-unstyled small mb-0 text-secondary">
                      <li class="mb-2"><i class="bi bi-clock me-2"></i>Tiempo total estimado: {{ estimatedTimeText }}</li>
                      <li class="mb-2"><i class="bi bi-train-front me-2"></i>Metro: {{ metroText }}</li>
                      <li><i class="bi bi-pin-map me-2"></i>De {{ waypointsFromTo }}</li>
                    </ul>
                  </div>

                  <!-- Secció de Puntuació i Guardar -->
                  <div class="mt-4 border-top pt-3">
                    <h6 class="fw-bold mb-2">Puntua i Guarda la Ruta</h6>
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex gap-2">
                        <i 
                          v-for="i in 5" 
                          :key="i" 
                          :class="['bi fs-4 cursor-pointer', starClass(i)]"
                          @click="tempRating = i"
                        ></i>
                      </div>
                      <button 
                        @click="handleSaveRoute" 
                        class="btn btn-emerald px-4"
                        :disabled="isSaved"
                      >
                        <i class="bi bi-bookmark-star-fill me-2"></i>
                        {{ saveButtonText }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
definePageMeta({ layout: 'aplicacio' })

import { ref, onMounted, computed, nextTick } from 'vue'
import { useChatStore } from '~/stores/useChatStore'
import { useTravelStore } from '~/stores/useTravelStore'
import { useLocation } from '~/composables/useLocation'
import { useModalMap } from '~/composables/useModalMap'

const chatStore = useChatStore()
const travelStore = useTravelStore()
const { coords, getLocation } = useLocation()
const loading = ref(false)
const saveStatus = ref(false)
const selectedRoute = ref(null)
const tempRating = ref(0)
const isSaved = ref(false)
const modalRef = ref(null)
const modalMapContainer = ref(null)
let bootstrapModal = null
var modalMap = useModalMap()

onMounted(async () => {
  getLocation()
  if (!chatStore.activeSessionId) {
    chatStore.createNewSession()
  }
  await travelStore.initStore()

  if (process.client) {
    bootstrapModal = new bootstrap.Modal(modalRef.value)
    var el = modalRef.value
    if (el) {
      el.addEventListener('shown.bs.modal', function () {
        nextTick(function () {
          setTimeout(function () {
            var route = selectedRoute.value
            var container = modalMapContainer.value
            if (container && route) {
              var center = route.location ? [route.location.lat, route.location.lng] : [41.3851, 2.1734]
              modalMap.initModalMap(container, route.waypoints || [], center)
            }
          }, 300)
        })
      })
      el.addEventListener('hidden.bs.modal', function () {
        modalMap.destroyModalMap()
      })
    }
  }
})

function starClass(i) {
  if (tempRating.value >= i) {
    return 'bi-star-fill text-warning'
  }
  return 'bi-star text-secondary'
}

const saveButtonText = computed(function () {
  if (isSaved.value) {
    return 'Guardada'
  }
  return 'Guardar a Galeria'
})

const activeMessages = computed(function () {
  var session = chatStore.activeSession
  if (session && session.messages) {
    return session.messages
  }
  return []
})

const selectedRouteTitle = computed(function () {
  if (selectedRoute.value && selectedRoute.value.title) {
    return selectedRoute.value.title
  }
  return 'Detalls de la Ruta'
})

const selectedWaypoints = computed(function () {
  if (selectedRoute.value && selectedRoute.value.waypoints) {
    return selectedRoute.value.waypoints
  }
  return []
})

const estimatedTimeText = computed(function () {
  if (selectedRoute.value && selectedRoute.value.estimatedTime) {
    return selectedRoute.value.estimatedTime
  }
  return totalTime.value
})

const metroText = computed(function () {
  if (selectedRoute.value && selectedRoute.value.metro) {
    return selectedRoute.value.metro
  }
  return 'Consultar línies recomanades'
})

const waypointsFromTo = computed(function () {
  var r = selectedRoute.value
  if (!r || !r.waypoints || r.waypoints.length === 0) {
    return ''
  }
  var first = r.waypoints[0].title || r.waypoints[0].name || 'Origen'
  var last = r.waypoints[r.waypoints.length - 1].title || r.waypoints[r.waypoints.length - 1].name || 'Destí'
  return first + ' a ' + last
})

const totalTime = computed(() => {
  if (!selectedRoute.value) return '0 min'
  var waypoints = selectedRoute.value.waypoints
  var total = 0
  for (var w = 0; w < waypoints.length; w++) {
    var mins = parseInt(waypoints[w].duration) || 0
    total = total + mins
  }
  return total + ' min'
})

const handleSendMessage = async (text) => {
  loading.value = true
  saveStatus.value = false

  chatStore.addMessage({ role: 'user', content: text, timestamp: Date.now() })

  var session = chatStore.activeSession
  var history = session && session.messages ? session.messages : []

  try {
    const response = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        prompt: text,
        location: coords.value,
        history: history
      }
    })

    var messagePayload = {
      role: 'assistant',
      content: response.content,
      timestamp: Date.now()
    }

    if (response.type === 'route' && response.route) {
      var loc = coords.value
      if (!loc) {
        loc = { lat: 0, lng: 0 }
      }
      var rawWaypoints = response.route.waypoints || []
      var waypoints = []
      for (var i = 0; i < rawWaypoints.length; i++) {
        waypoints.push(normalizeWaypoint(rawWaypoints[i], i))
      }
      const newRoute = {
        id: crypto.randomUUID(),
        title: response.route.title || 'Ruta',
        timestamp: Date.now(),
        waypoints: waypoints,
        metro: response.route.metro,
        estimatedTime: response.route.estimatedTime,
        location: loc
      }
      messagePayload.route = newRoute
    }

    chatStore.addMessage(messagePayload)
  } catch (error) {
    chatStore.addMessage({ role: 'assistant', content: 'Ho sento, hi ha hagut un error al processar la teva petició.', timestamp: Date.now() })
  } finally {
    loading.value = false
  }
}

function normalizeWaypoint(raw, index) {
  var lat = raw.lat
  if (lat === undefined || lat === null) {
    lat = raw.latitude
  }
  var lng = raw.lng
  if (lng === undefined || lng === null) {
    lng = raw.longitude
  }
  return {
    title: raw.title || raw.name || raw.titol || 'Parada ' + (index + 1),
    description: raw.description || raw.descripcio || '',
    lat: Number(lat) || 0,
    lng: Number(lng) || 0,
    duration: raw.duration || raw.durada || '0 min',
    order: raw.order !== undefined ? raw.order : index
  }
}

function handleViewRoute(route) {
  selectedRoute.value = route
  tempRating.value = route.rating || 0
  isSaved.value = !!travelStore.getRouteById(route.id)
  if (bootstrapModal) {
    bootstrapModal.show()
  }
}

const handleSaveRoute = async () => {
  if (!selectedRoute.value) return
  
  var rutaAGuardar = JSON.parse(JSON.stringify(selectedRoute.value))
  rutaAGuardar.rating = tempRating.value
  
  await travelStore.addRoute(rutaAGuardar)
  isSaved.value = true
  saveStatus.value = true
  setTimeout(() => { saveStatus.value = false }, 5000)
}
</script>

<style scoped>
.chat-page-container {
  height: 100%;
  min-height: calc(100vh - 72px);
  display: flex;
  flex-direction: column;
}

.chat-content {
  flex-grow: 1;
  height: 100%;
}

.save-badge-container {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 1000;
}

.status-indicator {
  width: 10px;
  height: 10px;
  background: var(--primary-emerald);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--primary-emerald);
}
.btn-emerald {
  background: var(--primary-emerald);
  color: white;
}
.bg-emerald { background: var(--primary-emerald); }
.text-emerald { color: var(--primary-emerald); }
.border-emerald { border-color: var(--primary-emerald) !important; }
.bg-emerald-light { background-color: rgba(16, 185, 129, 0.05); }
.border-emerald-light { border-color: rgba(16, 185, 129, 0.1) !important; }

.shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.06); }
.animate-fade-in { animation: fadeIn 0.5s ease-out; }

@keyframes fadeIn { 
  from { opacity: 0; transform: translateY(-10px); } 
  to { opacity: 1; transform: translateY(0); } 
}

.timeline-item:last-child {
  border-start: 0 !important;
}

.map-modal-container {
  overflow: hidden;
  position: relative;
}
.modal-map-div {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}
</style>
