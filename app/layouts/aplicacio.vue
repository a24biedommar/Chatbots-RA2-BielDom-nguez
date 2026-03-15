<template>
  <div class="aplicacio-layout">
    <header class="aplicacio-header">
      <nav class="aplicacio-nav">
        <div class="container d-flex align-items-center">
          <NuxtLink class="navbar-brand d-flex align-items-center" to="/aplicacio/galeria">
            <i class="bi bi-compass-fill me-2 text-emerald"></i>
            <span class="fw-bold text-dark">TravelBuddy</span>
          </NuxtLink>
          <div class="d-flex align-items-center ms-auto">
            <NuxtLink class="aplicacio-nav-link" to="/aplicacio/chat" active-class="text-emerald">Xat</NuxtLink>
            <NuxtLink class="aplicacio-nav-link" to="/aplicacio/galeria" active-class="text-emerald">Galeria</NuxtLink>
            <NuxtLink class="btn btn-outline-danger btn-sm rounded-pill px-3 ms-2" to="/">Sortir</NuxtLink>
          </div>
        </div>
      </nav>
    </header>
    <main class="aplicacio-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="js">
</script>

<style scoped>
.aplicacio-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.aplicacio-header {
  height: 72px;
  min-height: 72px;
  flex-shrink: 0;
  background: white;
  border-bottom: 1px solid #dee2e6;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.aplicacio-nav {
  height: 72px;
  min-height: 72px;
  display: flex;
  align-items: center;
  width: 100%;
}

.aplicacio-nav-link {
  padding-left: 1rem;
  padding-right: 1rem;
  font-weight: 700;
  color: #444;
  text-decoration: none;
}
.aplicacio-nav-link:hover,
.aplicacio-nav-link.text-emerald {
  color: var(--primary-emerald);
}

.text-emerald {
  color: var(--primary-emerald);
}

.aplicacio-main {
  flex: 1;
}
</style>
