<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <header class="hero-gradient">
      <div class="container text-center py-5">
        <h1 class="display-3 fw-bold mb-3 mt-5 animate-slide-up">
          Viatja més lluny, <br />
          <span class="text-emerald">amb IA al teu costat.</span>
        </h1>
        <p class="lead text-secondary mb-5 mx-auto animate-fade-in" style="max-width: 600px">
          Genera rutes personalitzades en segons, basades en la teva ubicació i el clima actual.
        </p>
        <div class="d-flex justify-content-center gap-3 animate-fade-in-delayed">
          <NuxtLink to="/aplicacio/galeria" class="btn btn-emerald btn-lg px-5 shadow">Comença Ara</NuxtLink>
          <a href="#features" class="btn btn-outline-dark btn-lg px-4 border-2">Saber-ne més</a>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section id="features" class="py-5 bg-white">
      <div class="container py-5">
        <div class="row g-4">
          <div class="col-md-4">
            <div class="modern-card p-4 h-100 border-0">
              <div class="feature-icon">
                <i class="bi bi-robot"></i>
              </div>
              <h4 class="fw-bold">Rutes amb IA</h4>
              <p class="text-secondary">Itineraris únics generats per Gemini 1.5, adaptats als teus gustos i el context local.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="modern-card p-4 h-100 border-0">
              <div class="feature-icon">
                <i class="bi bi-cloud-sun"></i>
              </div>
              <h4 class="fw-bold">Context Climàtic</h4>
              <p class="text-secondary">No t'arrisquis. TravelBuddy té en compte la previsió del temps per a cada parada.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="modern-card p-4 h-100 border-0">
              <div class="feature-icon">
                <i class="bi bi-wifi-off"></i>
              </div>
              <h4 class="fw-bold">Sempre Offline</h4>
              <p class="text-secondary">Guarda les teves rutes i mapes. Consulta-les sense dades ni wifi a qualsevol lloc.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-5 bg-light">
      <div class="container py-5">
        <div class="text-center mb-5">
          <h2 class="fw-bold">Com funciona?</h2>
          <p class="text-secondary">En 3 simples passos estaràs a punt per a la teva aventura.</p>
        </div>
        <div class="row text-center g-5">
          <div class="col-md-4">
            <div class="step-num mx-auto mb-4">1</div>
            <h5 class="fw-bold">Explica'ns el pla</h5>
            <p class="text-secondary">Digues al xat què et ve de gust fer avui.</p>
          </div>
          <div class="col-md-4">
            <div class="step-num mx-auto mb-4">2</div>
            <h5 class="fw-bold">Rep la teva ruta</h5>
            <p class="text-secondary">La IA crea un itinerari detallat amb mapes.</p>
          </div>
          <div class="col-md-4">
            <div class="step-num mx-auto mb-4">3</div>
            <h5 class="fw-bold">Gaudeix el camí</h5>
            <p class="text-secondary">Guarda-la i utilitza-la fins i tot offline.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- History Section - ELIMINAT segons petició -->
  </div>
</template>

<script setup lang="js">
import { onMounted } from 'vue'
import { useTravelStore } from '~/stores/useTravelStore'
import RouteHistory from '~/components/ui/RouteHistory.vue'

const travelStore = useTravelStore()

onMounted(async function () {
  await travelStore.initStore()
})
</script>

<style scoped>
.text-emerald { color: var(--primary-emerald); }

.step-num {
  width: 40px;
  height: 40px;
  background: var(--primary-emerald);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* Custom Animations */
.animate-slide-up {
  animation: slideUp 0.8s ease-out;
}
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}
.animate-fade-in-delayed {
  animation: fadeIn 1s ease-out 0.4s both;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
