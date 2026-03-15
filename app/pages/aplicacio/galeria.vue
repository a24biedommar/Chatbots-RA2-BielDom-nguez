<template>
  <div class="galeria-page-container">
    <div class="galeria-page bg-light min-vh-100 pt-4">
      <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="fw-bold mb-0">La Teva Galeria de Rutes</h2>
          <div class="search-box">
            <div class="input-group shadow-sm">
              <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-emerald"></i></span>
              <input 
                v-model="filtreText" 
                type="text" 
                class="form-control border-start-0 ps-0" 
                placeholder="Cerca rutes..."
              />
            </div>
          </div>
        </div>

        <div v-if="rutesFiltrades.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm">
          <i class="bi bi-journal-x display-1 text-light-emerald mb-3"></i>
          <h4 class="text-secondary">No s'han trobat rutes</h4>
          <p class="text-muted">Prova amb un altre criteri de cerca o crea una nova ruta al xat.</p>
          <NuxtLink to="/aplicacio/chat" class="btn btn-emerald mt-2">Anar al Xat</NuxtLink>
        </div>

        <div v-else class="row g-4">
          <div v-for="ruta in rutesFiltrades" :key="ruta.id" class="col-md-6 col-lg-4">
            <div class="modern-card h-100 overflow-hidden d-flex flex-column">
              <div class="card-img-placeholder bg-emerald-light d-flex align-items-center justify-content-center p-4">
                <i class="bi bi-geo-alt-fill text-emerald display-4"></i>
              </div>
              <div class="p-4 flex-grow-1">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="fw-bold mb-0 text-truncate" style="max-width: 80%">{{ ruta.title }}</h5>
                  <span class="badge bg-mint text-emerald border">{{ ratingText(ruta) }} <i class="bi bi-star-fill"></i></span>
                </div>
                <p class="text-secondary small mb-3"><i class="bi bi-calendar3 me-2"></i>{{ formatejarData(ruta.timestamp) }}</p>
                
                <div class="rating-stars mb-4">
                  <span class="small text-muted d-block mb-1">Puntua aquesta ruta:</span>
                  <div class="d-flex gap-1">
                    <i 
                      v-for="i in 5" 
                      :key="i" 
                      :class="['bi star-icon', starClassRuta(ruta, i)]"
                      @click="actualitzarPuntuacio(ruta.id, i)"
                    ></i>
                  </div>
                </div>

                <div class="d-flex gap-2 mt-auto">
                  <button @click="veureRuta(ruta)" class="btn btn-emerald flex-grow-1">
                    <i class="bi bi-eye-fill me-1"></i> Detalls
                  </button>
                  <button @click="eliminarRuta(ruta.id)" class="btn btn-outline-danger shadow-none">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Ruta -->
    <div class="modal fade" id="rutaModal" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="modal-header ruta-modal-header border-0 py-3">
            <h5 class="modal-title fw-bold text-white">
              <i class="bi bi-geo-alt-fill me-2"></i> {{ rutaSeleccionadaTitle }}
            </h5>
            <button type="button" class="btn-close ruta-modal-close" data-bs-dismiss="modal" aria-label="Tancar"></button>
          </div>
          <div class="modal-body p-0">
            <div class="row g-0">
              <div class="col-lg-7">
                <div class="map-modal-container" style="height: 500px; min-height: 500px;">
                  <div ref="modalMapContainer" class="modal-map-div"></div>
                </div>
              </div>
              <div class="col-lg-5 bg-white p-4 overflow-auto" style="max-height: 500px">
                <div class="route-details">
                  <h6 class="text-emerald fw-bold mb-3 border-bottom pb-2">Itinerari del trayecto</h6>
                  <div class="timeline ps-3">
                    <div v-for="(wp, idx) in rutaSeleccionadaWaypoints" :key="idx" class="timeline-item pb-4 position-relative border-start border-emerald border-2">
                      <div class="timeline-dot bg-emerald rounded-circle position-absolute" style="width: 12px; height: 12px; left: -7px; top: 0"></div>
                      <div class="ms-3">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                          <h6 class="mb-0 fw-bold">{{ wp.title || wp.name || 'Parada ' + (idx + 1) }}</h6>
                          <span class="badge bg-light text-secondary border">{{ wp.duration || '—' }}</span>
                        </div>
                        <p class="text-secondary small mb-0">{{ wp.description || '—' }}</p>
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
  </div>
</template>

<script setup lang="js">
definePageMeta({ layout: 'aplicacio' })

import { ref, computed, onMounted, nextTick } from 'vue'
import { useTravelStore } from '~/stores/useTravelStore'
import { useModalMap } from '~/composables/useModalMap'

var travelStore = useTravelStore()
var filtreText = ref('')
var rutaSeleccionada = ref(null)
var modalRef = ref(null)
var modalMapContainer = ref(null)
var bootstrapModal = ref(null)
var modalMap = useModalMap()

function starClassRuta(ruta, i) {
  var r = ruta.rating || 0
  if (r >= i) {
    return 'bi-star-fill text-warning'
  }
  return 'bi-star text-secondary'
}

function ratingText(ruta) {
  var r = ruta.rating || 0
  return r.toFixed(1)
}

const rutaSeleccionadaTitle = computed(function () {
  if (rutaSeleccionada.value && rutaSeleccionada.value.title) {
    return rutaSeleccionada.value.title
  }
  return 'Detalls de la Ruta'
})

const rutaSeleccionadaWaypoints = computed(function () {
  if (rutaSeleccionada.value && rutaSeleccionada.value.waypoints) {
    return rutaSeleccionada.value.waypoints
  }
  return []
})

onMounted(async function () {
  await travelStore.initStore()
  if (process.client) {
    bootstrapModal.value = new bootstrap.Modal(modalRef.value)
    var el = modalRef.value
    if (el) {
      el.addEventListener('shown.bs.modal', function () {
        nextTick(function () {
          setTimeout(function () {
            var route = rutaSeleccionada.value
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

/**
 * Filtra i ordena les rutes segons el text de cerca i les estrelles.
 * A) Filtra per títol (ignorant majúscules).
 * B) Ordena per rating de més a menys.
 */
var rutesFiltrades = computed(function() {
  var text = filtreText.value.toLowerCase();
  var rutes = travelStore.routes;
  var resultat = [];
  var i;

  for (i = 0; i < rutes.length; i++) {
    if (rutes[i].title.toLowerCase().indexOf(text) !== -1) {
      resultat.push(rutes[i]);
    }
  }

  // Ordenar per estrelles (més a menys)
  resultat.sort(function(a, b) {
    return (b.rating || 0) - (a.rating || 0);
  });

  return resultat;
});

function veureRuta(ruta) {
  rutaSeleccionada.value = ruta
  if (bootstrapModal.value) {
    bootstrapModal.value.show()
  }
}

function actualitzarPuntuacio(id, estrelles) {
  travelStore.updateRouteRating(id, estrelles)
}

function eliminarRuta(id) {
  if (confirm('Estàs segur que vols eliminar aquesta ruta?')) {
    travelStore.deleteRoute(id)
  }
}

function formatejarData(ts) {
  return new Date(ts).toLocaleDateString('ca-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.text-emerald { color: var(--primary-emerald); }
.bg-emerald-light { background-color: rgba(16, 185, 129, 0.05); }
.bg-mint { background: var(--light-mint); }
.text-light-emerald { color: rgba(16, 185, 129, 0.2); }

/* Header del modal: fons verd i text/X visibles */
.ruta-modal-header {
  background-color: #10b981;
  color: white;
}
.ruta-modal-header .modal-title {
  color: white;
}
.ruta-modal-close {
  filter: brightness(0) invert(1);
  opacity: 1;
}
.ruta-modal-close:hover {
  opacity: 0.8;
}

.card-img-placeholder {
  height: 140px;
  border-bottom: 1px solid #eee;
}

.star-icon {
  cursor: pointer;
  font-size: 1.2rem;
  transition: transform 0.2s;
}

.star-icon:hover {
  transform: scale(1.2);
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

.search-box {
  width: 300px;
}
</style>
