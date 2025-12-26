<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import gsap from "gsap";

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const cardRef = ref(null);
const resultRef = ref(null);
const character = ref(null);
const revealed = ref(false);

const personalities = {
  1: {
    name: "Marie",
    description: "The Heart of the Band.",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    color: "Emerald, Green", likes: "Green stuff idk", dislikes: "67",
    image: "/images/1-marie.png", spotify: "https://open.spotify.com/embed/playlist/37i9dQZF1EIdf9KPrv2H7H"
  },
  2: {
    name: "Lyda",
    description: "The Spark of Energy.",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    color: "Red", likes: "Water", dislikes: "water shower",
    image: "/images/2-lyda.png", spotify: "https://open.spotify.com/embed/playlist/37i9dQZF1EIdf9KPrv2H7H"
  },
  3: {
    name: "Vanna",
    description: "The Ethereal Dreamer.",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    color: "BLUE", likes: "cat", dislikes: "shower",
    image: "/images/3-vanna.png", spotify: "https://open.spotify.com/embed/playlist/37i9dQZF1EIdf9KPrv2H7H"
  },
  4: {
    name: "Mao",
    description: "The Chaos Element.",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    color: "Void", likes: "Tuna, Keyboard Warmth, Naps, yo mama", dislikes: "Water, Vacuum Cleaners, and impending of doom of humanity consequences",
    image: "/images/4-cat.png", spotify: "https://open.spotify.com/embed/playlist/37i9dQZF1EIdf9KPrv2H7H"
  },
};

onMounted(async () => {
  const answersQuery = route.query.answers;
  if (!answersQuery) {
    loading.value = false;
    return;
  }

  const answers = answersQuery.split(",");
  const counts = {};
  answers.forEach(p => counts[p] = (counts[p] || 0) + 1);

  let max = -Infinity;
  let maxKey = 1;
  for (const key in counts) {
    if (counts[key] > max) {
      max = counts[key];
      maxKey = key;
    }
  }

  character.value = personalities[maxKey] || personalities[1];

  setTimeout(async () => {
    loading.value = false;
    await nextTick();
    animateCardEntry();
  }, 2500);
});

// --- ANIMATIONS ---
function animateCardEntry() {
  const tl = gsap.timeline();

  tl.from(cardRef.value, {
    y: 100,
    opacity: 0,
    scale: 0.9,
    rotation: -5,
    duration: 1.2,
    ease: "power3.out"
  });

  // Floating Loop
  tl.to(cardRef.value, {
    y: "-=15",
    duration: 2.5,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });
}

function revealResult() {
  if (revealed.value) return;


  // gsap.killTweensOf(cardRef.value);

  const tl = gsap.timeline();

  // 1. Flip the main card
  tl.to(cardRef.value, {
    rotationY: 180,
    y: 0,
    rotation: 0,
    duration: 0.8,
    ease: "power2.inOut"
  });

  // 2. Set initial state for result sections
  revealed.value = true;

  // 3. Staggered slide-in for the detail boxes
  nextTick(() => {
    gsap.from(".reveal-section", {
      y: 100,
      opacity: 0,
      rotation: 2,
      stagger: 0.2,
      duration: 0.8,
      ease: "back.out(1.2)",
      clearProps: "all" // Cleans up transforms after animation
    });

    gsap.from(".restart-btn", {
      opacity: 0,
      scale: 0.8,
      delay: 1,
      duration: 0.5
    });
  });
}
</script>

<template>
  <div v-if="loading" class="loading-screen">
    <img src="../assets/logo-loader.png" alt="Logo" class="logo-loader" />
    <h3 class="pop">Gazing at the stars...</h3>
  </div>

  <div class="viewport-wrapper" v-else>
    <section class="landing-mobile-screen scrollable">

      <div class="card-area">
        <div class="cardCont" ref="cardRef" @click="revealResult">
          <div class="cardBack" :style="{ backgroundImage: `url(${character?.image})` }"></div>
          <div class="cardFront" style="background-image: url('/images/card-back.png')">
            <div class="click-text pop">Tap to Reveal</div>
          </div>
        </div>
      </div>

      <div v-if="revealed" class="results-content">

        <div class="reveal-section result-card">
          <h3 class="subtitle lexend">You are:</h3>
          <div class="character-name-wrapper">
            <h1 class="character-name-bg pop">{{ character?.name }}</h1>
            <h1 class="character-name pop">{{ character?.name }}</h1>
          </div>
          <p class="character-description lexend">{{ character?.description }}</p>
        </div>

        <div class="reveal-section info-card">
          <h4 class="pop section-title">About Her</h4>
          <p class="lexend bio-text">{{ character?.bio }}</p>
          <div class="stats-list lexend">
            <p><strong class="lexend-bold">Favorite Color:</strong> {{ character?.color }}</p>
            <p><strong class="lexend-bold">Likes:</strong> {{ character?.likes }}</p>
            <p><strong class="lexend-bold">Dislikes:</strong> {{ character?.dislikes }}</p>
          </div>
        </div>

        <div class="reveal-section spotify-card">
          <h4 class="pop section-title">Her Playlist</h4>
          <iframe
              style="border-radius:12px"
              :src="character?.spotify"
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy">
          </iframe>
        </div>
        <button @click="router.push('/')" class="restart-btn pop">Restart Test</button>
        <div class="footer-spacer"></div>
      </div>

    </section>
  </div>
</template>

<style scoped>
.viewport-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
  background: #2A5BBD;
  overflow: hidden;
}

.landing-mobile-screen {
  position: relative;
  width: 100%;
  max-width: 450px;
  height: 100%;
  background: #2A5BBD;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
}

.scrollable::-webkit-scrollbar { width: 0px; }

/* LOADING SCREEN */
.loading-screen {
  position: fixed;
  inset: 0;
  background: #2a5bbd;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  z-index: 999;
  color: white;
}
.logo-loader { width: 140px; margin-bottom: 1rem; }

/* CARD AREA */
.card-area {
  perspective: 1000px;
  padding-top: 5vh;
  margin-bottom: 2rem; /* Reduced so content is visible sooner */
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 440px;
}

.cardCont {
  width: 280px;
  height: 420px;
  position: relative;
  transform-style: preserve-3d;
  cursor: pointer;
}

.cardFront, .cardBack {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  backface-visibility: hidden;
  box-shadow: 10px 10px 0px rgba(0,0,0,0.3);
}

.cardBack { transform: rotateY(-180deg); }
.click-text {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: white;
  background: rgba(42, 91, 189, 0.9);
  padding: 8px 0;
}

/* RESULT SECTIONS */
.results-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Content starts slightly overlapped with card area for a tight look */
  margin-top: -20px;
}

.result-card, spotify-card {
  rotate: 1deg;
}

.info-card{
  rotate: -1deg;
}
.reveal-section {
  background: white;
  width: 90%;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 6px 6px 0px rgba(0,0,0,0.2);
  color: #2A5BBD;
  /* Ensure transform doesn't clip during animation */
  will-change: transform, opacity;
  translate: 0 -100px;
}

/* TYPOGRAPHY */
.character-name-wrapper {
  position: relative;
  height: 3.5rem;
  margin: 0.5rem 0;
}
.character-name, .character-name-bg {
  position: absolute;
  font-size: 2.8rem;
  text-transform: uppercase;
}
.character-name { color: white; z-index: 2; -webkit-text-stroke: 6px #2A5BBD; paint-order: stroke fill; }
.character-name-bg { color: #2A5BBD; z-index: 1; transform: translateY(5px); -webkit-text-stroke: 6px #2A5BBD; }

.section-title {
  font-size: 1.1rem;
  border-bottom: 2px dashed #2A5BBD;
  margin-bottom: 1rem;
  display: inline-block;
}

.bio-text { font-size: 0.9rem; line-height: 1.6; }
.stats-list p { font-size: 0.85rem; margin: 5px 0; }

.restart-btn {
  background: white;
  color: #2A5BBD;
  border: none;
  padding: 1rem 2rem;
  margin: 2rem 0;
  box-shadow: 4px 4px 0px rgba(0,0,0,0.3);
  cursor: pointer;
  font-weight: bold;
}

.footer-spacer { height: 10vh; }
</style>