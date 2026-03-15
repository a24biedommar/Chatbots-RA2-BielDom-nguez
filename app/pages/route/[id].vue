<template>
  <div class="route-detail-page bg-light min-vh-100 pt-5 mt-4">
    <div class="container py-4">
      <nav class="mb-4">
        <NuxtLink to="/" class="btn btn-link text-emerald p-0 text-decoration-none fw-bold">
          <i class="bi bi-arrow-left me-2"></i>Tornar a l'historial
        </NuxtLink>
      </nav>

      <div v-if="route" class="route-content animate-fade-in">
        <div class="row g-4">
          <!-- Main Info & Map -->
          <div class="col-lg-8">
            <div class="modern-card p-4 shadow-sm mb-4">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h1 class="h2 fw-bold mb-1">{{ route.title }}</h1>
                  <p class="text-secondary mb-0"><i class="bi bi-calendar-event me-2"></i>{{ formatDate(route.timestamp) }}</p>
                </div>
                <button class="btn btn-light rounded-circle shadow-sm" title="Descarregar PDF">
                  <i class="bi bi-download"></i>
                </button>
              </div>
              <div class="rounded-4 overflow-hidden border shadow-sm" style="height: 450px">
                <RouteMap :waypoints="route.waypoints" :center="[route.location.lat, route.location.lng]" />
              </div>
            </div>
          </div>

          <!-- Itinerary -->
          <div class="col-lg-4">
            <div class="modern-card p-4 shadow-sm h-100">
              <h4 class="fw-bold mb-4"><i class="bi bi-list-task me-2 text-emerald"></i>Itinerari</h4>
              <div class="timeline">
                <div v-for="(wp, index) in sortedWaypoints" :key="index" class="timeline-item pb-4">
                  <div class="timeline-dot"></div>
                  <div class="ps-4">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <h6 class="fw-bold mb-0">{{ wp.title }}</h6>
                      <small class="badge bg-mint text-emerald">{{ wp.duration }}</small>
                    </div>
                    <p class="small text-secondary mb-0">{{ wp.description }}</p>
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
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTravelStore } from '~/stores/useTravelStore'
import RouteMap from '~/components/maps/RouteMap.vue'

const routeParam = useRoute()
const travelStore = useTravelStore()

onMounted(async () => {
  await travelStore.initStore()
})

const route = computed(() => travelStore.getRouteById(routeParam.params.id))

const sortedWaypoints = computed(() => {
  var r = route.value
  if (!r || !r.waypoints) return []
  var arr = []
  for (var i = 0; i < r.waypoints.length; i++) {
    arr.push(r.waypoints[i])
  }
  arr.sort(function (a, b) {
    return a.order - b.order
  })
  return arr
})

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.text-emerald { color: var(--primary-emerald); }
.bg-mint { background: var(--light-mint); }

.timeline { border-left: 2px dashed var(--light-mint); margin-left: 10px; }
.timeline-item { position: relative; }
.timeline-dot {
  position: absolute;
  left: -6px;
  top: 0;
  width: 10px;
  height: 10px;
  background: var(--primary-emerald);
  border-radius: 50%;
  box-shadow: 0 0 0 4px white;
}
</style>
