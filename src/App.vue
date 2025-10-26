<script setup>
import Header from "@/components/Header.vue";
import Landing from "@/views/Landing.vue";
import About  from "@/views/About.vue";
</script>

<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
  <div id="foreground">
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.foreground {
  position: relative;
}
</style>
