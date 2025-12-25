<script setup>
import { onMounted, ref } from "vue";
import { gsap } from "gsap";

const titleRef = ref(null);
const paperRef = ref(null);
const foregroundRef = ref(null);
const starBgRef = ref(null);

onMounted(() => {
  const tl = gsap.timeline({ delay: 3.5 });
  // 1. Paper slides up
  tl.from(paperRef.value, {
    y: 200,
    opacity: 0,
    scale: 0.8,
    rotation: -5,
    duration: 1,
    ease: "power2.out"
  });

  // 2. Title group (including star) pops in
  tl.from(titleRef.value, {
    y: 100,
    opacity: 0,
    scale: 0.9,
    duration: 1,
    ease: "back.out(1.7)"
  }, "-=0.6");

  // 3. Grass foreground slides up
  tl.from(foregroundRef.value, {
    y: 300,
    opacity: 0,
    duration: 1.2,
    ease: "power2.out"
  }, "-=0.8");
});

const handleMouseEnter = () => {
  gsap.to(starBgRef.value, {
    scale: 1.3,
    duration: 0.4,
    ease: "back.out(2)"
  });
};

const handleMouseLeave = () => {
  gsap.to(starBgRef.value, {
    scale: 1,
    duration: 0.3,
    ease: "power2.inOut"
  });
};
</script>

<template>
  <section class="landing">
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
            <img
                src="../assets/star-background.webp"
                class="star-bg"
                ref="starBgRef"
                alt=""
            />
          </div>
          <img
              src="../assets/star-foreground.webp"
              class="star-fg"
              alt="Start Button"
          />
          <span class="start-text pop">START</span>
        </router-link>
      </div>

    </div>
  </section>

  <div ref="foregroundRef" class="foreground">
    <img src="../assets/foreground-left.png" alt="" class="foreground-left"/>
    <img src="../assets/foreground-right.png" alt="" class="foreground-right"/>
  </div>
</template>

<style scoped>
.landing {
  position: relative;
  width: 100%;
  height: 75vh;
  background: #2A5BBD;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
}

.paper {
  position: absolute;
  width: 80%;
  max-width: 700px;
  z-index: 1; /* Lowest */
  filter: drop-shadow(10px 10px 0px rgba(0,0,0,.25));
}

.content-group {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2; /* Sits on top of the paper */
}
.title-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /* Adjust height to match your font-size so it doesn't collapse */
  height: 4rem;
  margin-bottom: 2rem;
}

.title-text, .title-text-bg {
  position: absolute;
  margin: 0;
  font-size: 3rem; /* Match your landing page scale */
  white-space: nowrap;
  line-height: 1;
  text-transform: uppercase; /* Optional: usually looks better for this 3D style */
  rotate: 2deg;
}

.title-text {
  color: white;
  z-index: 10;
  -webkit-text-stroke: 8px #2A5BBD;
  paint-order: stroke fill;
}

.title-text-bg {
  color: #2A5BBD;
  z-index: 9;
  -webkit-text-stroke: 8px #2A5BBD;
  transform: translateY(6px);
  paint-order: stroke fill;
}
/* --- STAR BUTTON --- */
.star-button-wrapper {
  position: relative;
  width: 14rem;
  height: 14rem;
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
  transform: translateY(10px);
  animation: spin 70s linear infinite;
}

.star-bg {
  width: 100%;
  height: auto;
}

.star-fg {
  position: absolute;
  width: 100%;
  z-index: 2;
  animation: spin 45s linear infinite;
}

.start-text {
  position: absolute;
  z-index: 3;
  color: white;
  font-size: 1.4rem;
  font-weight: 900;
  pointer-events: none;
  filter: drop-shadow(2px 2px 0px rgba(0,0,0,.25));

}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}


/* --- FOREGROUND --- */
.foreground {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  pointer-events: none;
  z-index: 100; /* Highest z-index to cover the bottom of the paper */
}

.foreground-left { position: absolute; bottom: 0; left: 0; width: 40%; }
.foreground-right { position: absolute; bottom: 0; right: 0; width: 40%; }

@media (max-width: 768px) {
  .title-text, .title-text-bg {
    font-size: 1.5rem;
  }
  .title-wrapper {
    padding-top: 10px;
    height: 2rem;
  }

  .star-button-wrapper { width: 10rem; height: 10rem; }
  .paper { width: 110%; }
}
</style>