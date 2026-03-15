<template>
  <div class="app-container">
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <InstallPrompt />
  </div>
</template>

<script setup lang="js">
import InstallPrompt from '~/components/ui/InstallPrompt.vue'
</script>

<style>
/* Global app styles or transitions can go here if needed */
</style>
