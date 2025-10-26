<script setup>
</script>

<template>
  <div class="foreground-container">
    <img src="../assets/foreground-left.png" alt="foreground left" class="foreground-left">
    <img src="../assets/foreground-right.png" alt="foreground right" class="foreground-right">
  </div>
</template>


<style scoped>
.foreground-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 1000;
}

/* Left foreground at left side */
.foreground-left {
  position: absolute;
  bottom: 0;
  left: 0;
  max-width: 50%;      /* responsive size */
  height: auto;
}

/* Right foreground at right side */
.foreground-right {
  position: absolute;
  bottom: 0;
  right: 0;
  max-width: 50%;      /* responsive size */
  height: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .foreground-left,
  .foreground-right {
    max-width: 35%;  /* shrink on mobile */
  }
}
</style>
