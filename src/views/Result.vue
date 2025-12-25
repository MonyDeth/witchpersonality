<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import gsap from "gsap";

const router = useRouter();
const route = useRoute();

const loading = ref(true);        // NEW: loading screen visibility
const cardRef = ref(null);
const resultRef = ref(null);
const character = ref(null);
const result = ref("");
const revealed = ref(false);

const personalities = {
  1: { name: "Marie", description: "Thoughtful and introspective.", image: "/images/1-marie.png" },
  2: { name: "Lyda", description: "Outgoing and adventurous.", image: "/images/2-lyda.png" },
  3: { name: "Vanna", description: "Creative and curious.", image: "/images/3-vanna.png" },
  4: { name: "Mao", description: "Meow Meow Meow... Meow!", image: "/images/4-cat.png" },
};

// Helper to preload images
function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = resolve;
  });
}

onMounted(async () => {
  const answersQuery = route.query.answers;

  if (!answersQuery) {
    result.value = "No results available.";
    loading.value = false;
    return;
  }

  // Start the loading animation immediately
  flickerLogo();

  const answers = answersQuery.split(",");
  const counts = {};
  answers.forEach(p => counts[p] = (counts[p] || 0) + 1);

  let max = -Infinity;
  let maxKey = null;
  for (const key in counts) {
    if (counts[key] > max) {
      max = counts[key];
      maxKey = key;
    }
  }

  character.value = personalities[maxKey] || personalities[1];
  result.value = character.value.description;

  // Preload the specific character image
  await preloadImage(character.value.image);

  // Smooth transition to results
  setTimeout(async () => {
    // 2. OPTIMIZATION: Kill the background animation before hiding the loader
    if (loaderTimeline) {
      loaderTimeline.kill();
      loaderTimeline = null;
    }

    loading.value = false;
    await nextTick();
    animateCardEntry();
    initCard();
  }, 2500);
});

let loaderTimeline;

function flickerLogo() {
  loaderTimeline = gsap.timeline({ repeat: -1, yoyo: true });
  loaderTimeline.to(".logo-loader", { opacity: 0.3, duration: 0.8, ease: "power1.inOut" })
      .to(".logo-loader", { opacity: 1, duration: 0.8, ease: "power1.inOut" });
}

function animateCardEntry() {
  const card = cardRef.value;

  const tl = gsap.timeline({
    defaults: { force3D: true }
  });

  tl.from(card, {
    y: 100,
    opacity: 0,
    scale: 0.9,
    rotation: -3,
    duration: 1.2, // Slightly longer for a more "premium" feel
    ease: "power3.out", // Smoother than power2
  });

  tl.to(card, {
    y: "-=20",
    duration: 3,
    ease: "sine.inOut", // This is the secret to smooth floating
    yoyo: true,
    repeat: -1,
  }, "-=0.2");

}

function initCard() {
  const card = cardRef.value;
  const front = card.querySelector(".cardFront");
  const back = card.querySelector(".cardBack");

  gsap.set(card, { transformStyle: "preserve-3d", transformPerspective: 1000, x: 0, y: 0 });
  gsap.set(back, { rotationY: -180 });
  gsap.set(resultRef.value, { opacity: 0, x: 50 });

  const tl = gsap.timeline({ paused: true });
  tl.to(front, { rotationY: 180, duration: 1 })
      .to(back, { rotationY: 0, duration: 1 }, 0)
      .to(card, {
        x: window.innerWidth > 768 ? -220 : 0,
        y: 0,
        rotation: -2,
        duration: 0.8,
        ease: "power2.out",
      }, 0)
      .to(resultRef.value, { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0);

  card.addEventListener("click", () => {
    if (!revealed.value) {
      revealed.value = true;
      tl.play();
    }
  });
}
</script>

<template>
  <div v-if="loading" class="loading-screen">
    <img src="../assets/logo-loader.png" alt="Logo" class="logo-loader" />
    <h3 class="title lexend">Gazing at the stars...</h3>
  </div>

  <div class="page-container" :class="{ 'is-hidden': loading }">
    <div class="cardCont" ref="cardRef">
      <div class="cardBack" :style="{ backgroundImage: `url(${character?.image})` }"></div>
      <div class="cardFront" style="background-image: url('/images/card-back.png')">
        <div class="click-text pop">Click to Reveal</div>
      </div>
    </div>

    <div class="result-container" ref="resultRef">
      <h3 class="subtitle lexend">You are:</h3>
      <div class="character-name-wrapper">
        <h1 class="character-name-bg pop">{{ character?.name }}</h1>
        <h1 class="character-name pop">{{ character?.name }}</h1>
      </div>
      <p class="character-description lexend">{{ result }}</p>

      <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/61nGAiN77VagnmEQ6rvyNO?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

      <button @click="router.push('/')" class="lexend-bold">Restart Test</button>
    </div>
  </div>
</template>

<style scoped>
/* --- Loading Screen --- */
.loading-screen {
  position: fixed;
  inset: 0;
  background: #2a5bbd;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  z-index: 10000;
}

.logo-loader {
  width: 180px;
  opacity: 1;
  animation: flicker 1.6s infinite ease-in-out;
}

/* --- Existing Styles Below --- */
.page-container {
  position: relative;
  width: 100%;
  background: #2a5bbd;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  flex-wrap: wrap;
}
.page-container.is-hidden {
  visibility: hidden;
  height: 0;
  overflow: hidden;
  padding: 0;
}

.cardCont {
  width: 400px;
  max-width: 90%;
  height: 600px;
  max-height: 80vh;
  position: relative;
  cursor: pointer;
  margin-bottom: 2rem;
}

.cardFront, .cardBack {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  cursor: pointer;
  box-shadow: 8px 8px 0px rgba(0,0,0,0.4);
}

.cardBack {
  transform: rotateY(-180deg);
}

.click-text {
  margin: 1rem;
  color: #fff;
  font-size: 1rem;
  text-align: center;
}

.result-container {
  position: absolute;
  right: 20%;
  top: 40%;
  transform: translateY(-50%) translateX(220px);
  background: #fff;
  padding: 2rem;
  color: #2a5bbd;
  max-width: 750px;
  min-width: 550px;
  box-shadow: 8px 8px 0px rgba(0,0,0,0.4);
}
.character-name-wrapper {
  position: relative;
  display: flex;
  justify-content: flex-start; /* Aligns text to the left of the container */
  align-items: center;
  height: 6rem; /* Adjust based on your font size */
  margin: 1rem 0;
}

.character-name, .character-name-bg {
  position: absolute;
  margin: 0;
  font-size: 5rem; /* Large and impactful */
  white-space: nowrap;
  line-height: 1;
  text-transform: uppercase;
}

/* The Top White Layer */
.character-name {
  color: white;
  z-index: 10;
  -webkit-text-stroke: 10px #2A5BBD;
  paint-order: stroke fill;
}

/* The Bottom Blue Layer (The "3D" part) */
.character-name-bg {
  color: #2A5BBD;
  z-index: 9;
  /* Thick stroke to make the border look chunky */
  -webkit-text-stroke: 10px #2A5BBD;
  transform: translateY(6px);
  paint-order: stroke fill;
}

.subtitle { color: #6c6c6c; }
.character-description { font-size: 1.5rem; }

@media (max-width: 768px) {
  .page-container {
    flex-direction: column;
    align-items: center;
  }
  .result-container {
    position: static;
    transform: none;
    margin-top: 2rem;
    width: 90%;
  }
  .cardCont {
    width: 200px;
    max-width: 90%;
    height: 300px;
    max-height: 80vh;
    position: relative;
    cursor: pointer;
    margin-bottom: 2rem;
  }

  .character-name {
    font-size: 1.8rem;
  }
  .character-description {
    font-size: 1rem;
  }

  .result-container {
    position: absolute;
    right: 5%;
    top: 150%;

    transform: translateY(-50%) translateX(220px);
    background: #fff;
    padding: 2rem;
    color: #2a5bbd;
    max-width: 750px;
    min-width: 250px;
    box-shadow: 8px 8px 0px rgba(0,0,0,0.4);
    rotate: 1deg;
  }
  .character-name-wrapper {
    height: 3rem;
  }
  .character-name, .character-name-bg {
    font-size: 2.2rem;
  }

}

.result-container button {
  margin-top: 1rem;
  background: #2a5bbd;
  color: #fff;
  border: none;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: 0.2s;
}
.result-container button:hover {
  transform: translateY(-2px) scale(1.05);
}
</style>
