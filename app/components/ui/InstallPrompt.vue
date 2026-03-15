<template>
  <div v-if="showPrompt" class="install-prompt">
    <div class="content">
      <p>Vols instal·lar TravelBuddy al teu dispositiu?</p>
      <div class="actions">
        <button @click="installPWA" class="install-btn">Instal·lar</button>
        <button @click="showPrompt = false" class="dismiss-btn">Ara no</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'

const showPrompt = ref(false)
var deferredPrompt = null

onMounted(function () {
  if (process.client) {
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault()
      deferredPrompt = e
      showPrompt.value = true
    })

    window.addEventListener('appinstalled', function () {
      showPrompt.value = false
      deferredPrompt = null
      console.log('PWA was installed')
    })
  }
})

async function installPWA() {
  if (!deferredPrompt) return

  showPrompt.value = false
  deferredPrompt.prompt()

  var choice = await deferredPrompt.userChoice
  console.log('User response to the install prompt: ' + choice.outcome)

  deferredPrompt = null
}
</script>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: 1.5rem;
  left: 1rem;
  right: 1rem;
  background: white;
  padding: 1.25rem;
  border-radius: 16px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  border: 1px solid #eee;
}

.content p {
  margin: 0 0 1rem 0;
  font-weight: 600;
  color: #333;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

button {
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.install-btn {
  background: #007bff;
  color: white;
}

.dismiss-btn {
  background: #f0f0f0;
  color: #666;
}
</style>
