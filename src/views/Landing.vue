<script setup>
import { onMounted, ref } from "vue";
import { gsap } from "gsap";
import Foreground from "@/components/foreground.vue";

const titleRef = ref(null);
const paperRef = ref(null);
const foregroundRef = ref(null);
const startButtonRef = ref(null);

onMounted(() => {
  const tl = gsap.timeline();

  // Animate paper first - “jumpy” effect
  tl.from(paperRef.value, {
    y: 200,
    opacity: 0,
    scale: 0.8,
    rotation: -5,
    duration: 1,
    ease: "steps(4)"
  });

  // Animate title after paper mostly finishes
  tl.from(titleRef.value, {
    y: 150,
    opacity: 0,
    scale: 0.7  ,
    rotation: -2,
    duration: 1,
    ease: "ease-out"
  }, "-=0.2"); // slight overlap so it doesn’t feel too delayed

  // Animate foreground last
  tl.from(foregroundRef.value, {
    y: 500,
    opacity: 0,
    duration: 1.5,
    ease: "steps(8)"
  },"-=2" );
});

</script>

<template>
  <section class="landing">
    <div class="start">
      <div class="title" ref="titleRef">
        <h1 class="dm-serif-text-regular-italic">Personality Test</h1>
        <router-link to="/questions" class="start-button-container" ref="startButtonRef">
          <div class="start-button">
            <img src="../assets/start-icon.png" alt="sparkly start icon" class="start-button-icon">
          </div>
        </router-link>
      </div>
      <img src="../assets/paper-background.svg" alt="paper-background" class="paper" ref="paperRef"/>
    </div>
  </section>


  <div ref="foregroundRef" class="foreground">
    <img src="../assets/foreground-left.png" alt="" class="foreground-left"/>
    <img src="../assets/foreground-right.png" alt="" class="foreground-right"/>
  </div>
</template>

<style scoped>
.landing {
  padding: 0 2rem;
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 1;
  padding-top: 4rem;
  height: auto;
  color: #2A5BBD;
}

.paper {
  position: absolute;
  z-index: 0;
}

.start {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.start-button {
  height: 8rem;
  display: flex;
  background: #2A5BBD;
  width: 8rem;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  transition: ease 0.3s;
}

.start-button:hover {
  background: #1a47a1;
  scale: 1.2;
}

.start-button-container {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
}

.start-button-icon {
  width: 6rem;
}

.foreground {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  pointer-events: none; /* clicks pass through */
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
.paper{
  filter: drop-shadow(1px 8px 0 rgba(0, 0, 0, 0.2));
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .foreground-left,
  .foreground-right {
    max-width: 35%;  /* shrink on mobile */
  }

}
</style>
