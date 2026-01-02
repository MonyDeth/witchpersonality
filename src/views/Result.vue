<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { personalities } from "../data/personalities.js"; // Import the data
import gsap from "gsap";

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const cardRef = ref(null);
const loaderLogoRef = ref(null);
const character = ref(null);
const revealed = ref(false);

let spinTween = null;

onMounted(async () => {
  // Start the spin animation immediately
  spinTween = gsap.to(loaderLogoRef.value, {
    rotation: -920,
    duration: 3,
    repeat: -1,
    ease: "expo.inOut"
  });

  const answersQuery = route.query.answers;
  if (!answersQuery) {
    stopLoading();
    return;
  }

  // Calculate Result
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

  // Use the imported personalities object
  character.value = personalities[maxKey] || personalities[1];

  // Simulated loading delay
  setTimeout(() => {
    stopLoading();
  }, 2500);
});

function stopLoading() {
  if (spinTween) {
    spinTween.kill();
    spinTween = null;
  }
  loading.value = false;
  nextTick(() => {
    animateCardEntry();
  });
}

onUnmounted(() => {
  if (spinTween) spinTween.kill();
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
  const tl = gsap.timeline();
  tl.to(cardRef.value, {
    rotationY: 180,
    y: 0,
    rotation: 0,
    duration: 0.8,
    ease: "power2.inOut"
  });
  revealed.value = true;
  nextTick(() => {
    gsap.from(".reveal-section", {
      y: 100,
      opacity: 0,
      rotation: 2,
      stagger: 0.2,
      duration: 0.8,
      ease: "back.out(1.2)",
      clearProps: "all"
    });
    gsap.from(".restart-btn", {
      opacity: 0,
      scale: 0.8,
      delay: 1,
      duration: 0.5
    });
  });
}

const copyLink = () => {
  // Point to home page so the link is accessible to new users
  const homeUrl = window.location.origin;
  navigator.clipboard.writeText(homeUrl).then(() => {
    alert("Link to quiz copied!");
  });
};

const shareToX = () => {
  const title = `I got ${character.value.name}! A Witch's Stop personality`;
  const description = `Find who you relate to most with the A Witch's Stop personality quiz! By Nompang Studios`;
  const homeUrl = window.location.origin;

  const shareText = `${title}\n${description}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(homeUrl)}`;

  window.open(xUrl, '_blank');
};
</script>

<template>
  <div v-if="loading" class="loading-screen">
    <img
        src="../assets/loading.webp"
        alt="Loading"
        class="logo-loader"
        ref="loaderLogoRef"
    />
    <h3 class="pop">Gazing at the stars...</h3>
  </div>

  <div class="viewport-wrapper" v-else>
    <section class="landing-mobile-screen scrollable">

      <div class="card-area">
        <div class="cardCont" ref="cardRef" @click="revealResult">
          <div class="cardBack" :style="{ backgroundImage: `url(${character?.image})` }"></div>
          <div class="cardFront" style="background-image: url('/images/card-back.png')">
            <div class="click-text pop">Tap to Reveal!</div>
          </div>
        </div>
      </div>

      <div v-if="revealed" class="results-content">
        <div class="reveal-section result-card">
          <h3 class="subtitle lexend">Your Character is:</h3>
          <div class="character-name-wrapper">
            <h1 class="character-name-bg pop">{{ character?.name }}</h1>
            <h1 class="character-name pop">{{ character?.name }}</h1>
          </div>
          <p class="character-description lexend">{{ character?.description }}</p>
        </div>

        <div class="reveal-section info-card">
          <h4 class="pop section-title">Preferences</h4>
          <div class="stats-list lexend">
            <p><strong class="lexend-bold">Favorite Color:</strong> {{ character?.color }}</p>
            <p><strong class="lexend-bold">Likes:</strong> {{ character?.likes }}</p>
            <p><strong class="lexend-bold">Dislikes:</strong> {{ character?.dislikes }}</p>
          </div>
        </div>

        <div class="reveal-section spotify-card">
          <h4 class="pop section-title">Playlist</h4>
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
        <div class="reveal-section share-card">
          <h4 class="pop section-title">Share Result</h4>
          <div class="share-grid">
            <button @click="copyLink" class="share-btn lexend-bold">
              <i class="ri-links-line"></i> Copy Link
            </button>
            <button @click="shareToX" class="share-btn x-style lexend-bold">
              <i class="ri-twitter-x-fill"></i> Post
            </button>
          </div>
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
.character-description{
  margin-top: 24px;
}
.logo-loader {
  width: 120px;
  margin-bottom: 1.5rem;
  will-change: transform;
}

/* CARD AREA */
.card-area {
  perspective: 1000px;
  padding-top: 5vh;
  margin-bottom: 2rem;
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
  top: 20px;
  width: 100%;
  text-align: center;
  color: #2A5BBD;
  background: white;
  padding: 8px 0;
}
.icon{
  width: 18px;
}

/* RESULT SECTIONS */
.results-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -75px;
}

.result-card { rotate: 1deg; }
.info-card { rotate: -1deg; }
.spotify-card { rotate: 1deg; }

.reveal-section {
  background: white;
  width: 90%;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 6px 6px 0px rgba(0,0,0,0.2);
  color: #2A5BBD;
  will-change: transform, opacity;
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

.share-card {
  rotate: -1deg;
  text-align: left;
}

.share-desc {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.share-grid {
  display: flex;
  gap: 10px;
}

.share-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid #2A5BBD;
  background: white;
  color: #2A5BBD;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  transition: transform 0.2s, background 0.2s;
}

.share-btn:hover {
  background: #f0f4ff;
  transform: translateY(-2px);
}

.x-style {
  background: #2A5BBD;
  color: white;
}

.x-style:hover {
  background: #1a47a1;
}
</style>