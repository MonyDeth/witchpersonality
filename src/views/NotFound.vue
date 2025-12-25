<script setup>
import { onMounted, ref } from "vue";
import gsap from "gsap";

const containerRef = ref(null);

onMounted(() => {
  gsap.from(containerRef.value, {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power2.out"
  });
});
</script>

<template>
  <div class="not-found" ref="containerRef">
    <div class="content">
      <h1 class="pop error-code">404</h1>
      <h2 class="pop">You've strayed too far from the stop...</h2>
      <p class="lexend">
        This path doesn't seem to exist. Even the stars can't guide you here.
      </p>

      <router-link to="/" class="back-home lexend-bold">
        Return Homepage
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  justify-content: center;
  background-color: #2A5BBD;
  text-align: center;
  padding: 2rem;
}

.error-code {
  font-size: 8rem;
  margin: 0;
  color: white;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
}

h2 {
  color: white;
  font-size: 1.5rem;
  margin: 1rem 0;
}

.lexend {
  color: rgba(255, 255, 255, 0.8);
  max-width: 400px;
  margin: 0 auto 2rem;
}

.back-home {
  display: inline-block;
  background: white;
  color: #2A5BBD;
  padding: 1rem 2rem;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
}

.back-home:hover {
  transform: translateY(-3px);
  color: white;
  background-color: #2A5BBD;
}
</style>