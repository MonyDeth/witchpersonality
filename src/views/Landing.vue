<script setup>
import { onMounted, ref } from "vue";
import { gsap } from "gsap";

const titleRef = ref(null);
const paperRef = ref(null);
const foregroundRef = ref(null);
const starBgRef = ref(null);

onMounted(() => {
  const hasVisited = localStorage.getItem('nompang_has_visited');
  const startDelay = hasVisited ? 0 : 3.5;

  const tl = gsap.timeline({
    delay: startDelay,
    defaults: { ease: "power2.out", force3D: true }
  });

  tl.from(paperRef.value, {
    y: 200,
    opacity: 0,
    scale: 0.8,
    rotation: -5,
    duration: 1
  });

  tl.from(titleRef.value, {
    y: 60,
    opacity: 0,
    scale: 0.9,
    duration: 1,
    ease: "back.out(1.7)"
  }, "-=0.6");

  // Clouds slide up from the floor
  tl.from(foregroundRef.value, {
    y: 120,
    opacity: 0,
    duration: 1.2
  }, "-=0.8");
});

const handleMouseEnter = () => {
  gsap.to(starBgRef.value, { scale: 1.2, duration: 0.4, ease: "back.out(2)" });
};

const handleMouseLeave = () => {
  gsap.to(starBgRef.value, { scale: 1.1, duration: 0.3, ease: "power2.inOut" });
};
</script>

<template>
  <div class="viewport-wrapper">
    <section class="landing-mobile-screen">

      <div class="main-container">
        <img src="../assets/paper-background.svg" alt="" class="paper" ref="paperRef"/>

        <div class="content-group" ref="titleRef">
          <div class="title-wrapper">
            <h1 class="title-text pop">Personality Test</h1>
            <h1 class="title-text-bg pop">Personality Test</h1>
          </div>

          <router-link
              to="/questions"
              class="star-button-wrapper"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
          >
            <div class="star-bg-container">
              <img src="../assets/star-background.webp" class="star-bg" ref="starBgRef" alt=""/>
            </div>
            <img src="../assets/star-foreground.webp" class="star-fg" alt="Start Button"/>
            <span class="start-text pop">START</span>
          </router-link>
        </div>
      </div>

      <div ref="foregroundRef" class="foreground">
        <img src="../assets/foreground-left.png" alt="" class="foreground-left"/>
        <img src="../assets/foreground-right.png" alt="" class="foreground-right"/>
      </div>

    </section>
  </div>
</template>

<style scoped>
/* 1. VIEWPORT WRAPPER: Fills remaining space below header */
.viewport-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  /* flex: 1 takes up the remaining height in a flex-column layout */
  flex: 1;
  width: 100%;
  background: #2A5BBD;
  overflow: hidden;
}

/* 2. MOBILE SCREEN: The locked 450px container */
.landing-mobile-screen {
  position: relative;
  width: 100%;
  max-width: 450px;
  /* 100% of the viewport-wrapper's height */
  height: 85vh;
  background: #2A5BBD;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Keeps content near the top/header */
  padding-top: 5dvh; /* Space between header and paper */
  overflow: hidden;
}

.main-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 2;
  margin-top: 12px;
}

.paper {
  position: absolute;
  width: 115%;
  max-width: none;
  z-index: 1;
  filter: drop-shadow(10px 10px 0px rgba(0,0,0,.25));
}

.content-group {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

/* --- TITLES --- */
.title-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3.5rem;
  margin-bottom: 1.5rem;
}

.title-text, .title-text-bg {
  position: absolute;
  margin: 0;
  font-size: 2rem;
  white-space: nowrap;
  line-height: 1;
  text-transform: uppercase;
  rotate: 2deg;
}

.title-text {
  color: white;
  z-index: 10;
  -webkit-text-stroke: 6px #2A5BBD;
  paint-order: stroke fill;
}

.title-text-bg {
  color: #2A5BBD;
  z-index: 9;
  -webkit-text-stroke: 6px #2A5BBD;
  transform: translateY(6px);
}

/* --- STAR BUTTON --- */
.star-button-wrapper {
  position: relative;
  width: 13rem;
  height: 13rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

.star-bg-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  transform: translateY(8px);
  animation: spin 70s linear infinite;
}

.star-bg { width: 110%; height: auto; }
.star-fg { position: absolute; width: 100%; z-index: 2; animation: spin 45s linear infinite; }
.start-text {
  position: absolute;
  z-index: 3;
  color: white;
  font-size: 1.3rem;
  font-weight: 900;
  filter: drop-shadow(2px 2px 0px rgba(0,0,0,.25));
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* --- CLOUD FOREGROUND (ADJUSTED) --- */
.foreground {
  position: absolute;
  bottom: 0; /* Pinned exactly to the bottom of the restricted view */
  left: 0;
  width: 100%;
  height: 160px;
  pointer-events: none;
  z-index: 5;
}

.foreground-left, .foreground-right {
  position: absolute;
  bottom: -2px; /* Prevent tiny gaps at the very bottom */
  width: 70%;
}

.foreground-left { left: -5%; }
.foreground-right { right: -5%; }

@media (max-width: 480px) {
  .landing-mobile-screen {
    max-width: 100%;
    height: 85vh;
    padding-top: 10dvh; /* Slightly more space on real mobile browsers */
  }
}
</style>