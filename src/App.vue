<template>
  <div id="future-goose-app">
    <router-view v-slot="{ Component, route }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
#future-goose-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f5ff 0%, #e8f0fe 50%, #f5f7fa 100%);
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
