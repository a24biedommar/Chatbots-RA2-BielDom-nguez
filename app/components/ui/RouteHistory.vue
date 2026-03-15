<template>
  <div class="route-history">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold mb-0">El Teu Historial</h3>
      <span class="badge bg-mint text-emerald rounded-pill px-3">{{ routes.length }} rutes</span>
    </div>

    <div v-if="routes.length === 0" class="text-center py-5 bg-light rounded-4">
      <i class="bi bi-journal-x display-4 text-secondary mb-3 d-block"></i>
      <p class="text-secondary mb-0">Encara no has generat cap ruta.</p>
    </div>

    <div v-else class="row g-3">
      <div v-for="route in routes" :key="route.id" class="col-12">
        <div class="history-card p-3 d-flex align-items-center" @click="goToRoute(route.id)">
          <div class="icon-box me-3">
            <i class="bi bi-geo-alt-fill text-emerald"></i>
          </div>
          <div class="flex-grow-1">
            <h6 class="fw-bold mb-0">{{ route.title }}</h6>
            <small class="text-secondary">{{ formatDate(route.timestamp) }}</small>
          </div>
          <div class="text-end me-3 d-none d-sm-block">
            <span class="badge bg-light text-dark border">{{ route.waypoints.length }} parades</span>
          </div>
          <button class="btn btn-link text-danger p-0 ms-2" @click.stop="travelStore.deleteRoute(route.id)">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { useTravelStore } from '~/stores/useTravelStore'

defineProps({ routes: Array })
const travelStore = useTravelStore()
const router = useRouter()

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('ca-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
function goToRoute(id) {
  router.push('/route/' + id)
}
</script>

<style scoped>
.text-emerald { color: var(--primary-emerald); }
.bg-mint { background: var(--light-mint); }

.history-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
}
.history-card:hover {
  background: var(--light-mint);
  border-color: var(--primary-emerald);
  transform: translateX(5px);
}
.icon-box {
  width: 45px;
  height: 45px;
  background: var(--soft-gray);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
</style>
