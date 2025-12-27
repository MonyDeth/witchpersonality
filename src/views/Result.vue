<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import gsap from "gsap";

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const cardRef = ref(null);
const loaderLogoRef = ref(null); // Ref for the spinning logo
const character = ref(null);
const revealed = ref(false);

let spinTween = null; // Reference to the GSAP animation for cleanup

const personalities = {
  1: {
    name: "Marie",
    description: "You're thoughtful and reserved, though you're not to be perceived as weak as your compassion comes from the kindness your soul preserves dearly in your hold. You're a person with refined taste sure but with the simple need to be understood. You long to be seen as a sister rather than a standard.",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    color: "Emerald Green", likes: "Herbal Tea, Vintage Records", dislikes: "Disharmony, Cold Coffee",
    image: "/images/1-marie.png", spotify: "https://open.spotify.com/embed/playlist/61nGAiN77VagnmEQ6rvyNO?utm_source=generator"
  },
  2: {
    name: "Lyda",
    description: "You're fierce and headstrong, though this may come off as a flaw to some who might perceive you as reckless in your actions even if they are well meant. You don't require luxury, you're content being surrounded by those you declare as sisters, even if it might be hard for you to admit so at first, even to yourself.",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    color: "Crimson Red", likes: "Orange Soda, Spicy Food", dislikes: "Standing Still, Rain Clouds",
    image: "/images/2-lyda.png", spotify: "https://open.spotify.com/embed/playlist/61nGAiN77VagnmEQ6rvyNO?utm_source=generator"
  },
  3: {
    name: "Vanna",
    description: "You're creative and passionate, perhaps a bit clumsy in your craft but that has yet to hinder your fingers in any way. You desire for change and for a better tomorrow, one free of constrictions driven by fear. You let yourself belong with sisters who, like yourself, share these ideals, as you march onward to your goals.\n",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    color: "Celestial Blue", likes: "Shrimps , Coffee", dislikes: "Wet Shoes",
    image: "/images/3-vanna.png", spotify: "https://open.spotify.com/embed/playlist/61nGAiN77VagnmEQ6rvyNO?utm_source=generator"
  },
  4: {
    name: "Mao",
    description: "Huh…well, consider yourself a little fella, a friend of witches and a companion to those in need. Alternatively, meow.",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    color: "Midnight Violet", likes: "Shiny Trinkets, Ancient Spells", dislikes: "Rules, Early Mornings",
    image: "/images/4-cat.png", spotify: "https://open.spotify.com/embed/playlist/61nGAiN77VagnmEQ6rvyNO?utm_source=generator"
  },
};

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

  character.value = personalities[maxKey] || personalities[1];

  // Simulated loading delay
  setTimeout(() => {
    stopLoading();
  }, 2500);
});

function stopLoading() {
  // KILL the animation instance to save memory
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
  // Safety cleanup
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
          <p class="lexend bio-text">{{ character?.bio }}</p>
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
</style>