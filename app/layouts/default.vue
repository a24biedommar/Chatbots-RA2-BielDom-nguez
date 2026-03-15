<template>
  <div class="app-layout">
    <main class="min-vh-100">
      <slot />
    </main>

    <footer v-if="!isAppRoute" class="bg-white py-5 border-top mt-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 text-center text-md-start">
            <span class="fw-bold text-emerald">TravelBuddy</span> &copy; 2026. Tots els drets reservats.
          </div>
          <div class="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <a href="#" class="text-secondary me-3"><i class="bi bi-twitter"></i></a>
            <a href="#" class="text-secondary me-3"><i class="bi bi-instagram"></i></a>
            <a href="#" class="text-secondary"><i class="bi bi-github"></i></a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="js">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isAppRoute = computed(function () {
  return route.path.includes('/aplicacio/') || route.path.endsWith('/aplicacio')
})
</script>

<style scoped>
.app-navbar {
  z-index: 1050;
  height: 72px;
}
.app-content {
  padding-top: 72px; /* Alçada del navbar per evitar solapament */
}
.text-emerald {
  color: var(--primary-emerald);
}
.nav-link {
  font-weight: 600;
  color: #444 !important;
}
.nav-link:hover, .router-link-active {
  color: var(--primary-emerald) !important;
}
</style>
