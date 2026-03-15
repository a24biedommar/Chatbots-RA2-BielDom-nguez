<template>
  <header class="app-header-wrapper">
    <nav class="navbar navbar-expand-lg bg-white border-bottom shadow-sm app-header-nav">
      <div class="container">
        <NuxtLink class="navbar-brand d-flex align-items-center" to="/aplicacio/galeria">
          <i class="bi bi-compass-fill me-2 text-emerald"></i>
          <span class="fw-bold tracking-tight text-dark">TravelBuddy</span>
        </NuxtLink>

        <div class="d-flex align-items-center ms-auto">
          <NuxtLink class="nav-link px-3 fw-bold" to="/aplicacio/chat" active-class="text-emerald">Xat</NuxtLink>
          <NuxtLink class="nav-link px-3 fw-bold" to="/aplicacio/galeria" active-class="text-emerald">Galeria</NuxtLink>
          <NuxtLink class="btn btn-outline-danger btn-sm rounded-pill px-3 ms-2" to="/">Sortir</NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.app-header-wrapper {
  height: 72px;
  min-height: 72px;
  flex-shrink: 0;
}

.app-header-nav {
  height: 72px;
  min-height: 72px;
}

.text-emerald { color: var(--primary-emerald) !important; }
.nav-link { color: #444; transition: color 0.2s; }
.nav-link:hover { color: var(--primary-emerald); }
</style>
